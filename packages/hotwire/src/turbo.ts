import { Transaction, TransactionContext } from '@sentry/types';

import { TurboBeforeFetchRequestEvent, TurboInstrumentation } from './types'

let activeTransaction: Transaction | undefined;
let startingUrl: string | undefined;

export function turboInstrumentation(): TurboInstrumentation {
  return (
    customStartTransaction: (context: TransactionContext) => Transaction | undefined,
    startTransactionOnPageLoad: boolean = true,
    startTransactionOnLocationChange: boolean = true
  ): void => {
    startingUrl = window.location.href;

    if (startTransactionOnPageLoad) {
      activeTransaction = customStartTransaction({
        name: window.location.pathname,
        op: "pageload",
        metadata: { source: "url" },
      });
    }

    if (startTransactionOnLocationChange) {
      document.documentElement.addEventListener(
        "turbo:before-fetch-request",
        async (event) => {
          // https://github.com/microsoft/TypeScript/issues/28357
          const detail = (event as TurboBeforeFetchRequestEvent).detail;

          event.preventDefault();

          const from = detail.fetchOptions.referrer;
          const to = detail.url;

          /**
           * This early return is there to account for some cases where a
           * navigation transaction starts right after long-running
           * pageload. We make sure that if `from` is undefined and a
           * valid `startingURL` exists, we don't create an uneccessary
           * navigation transaction.
           *
           * This was hard to duplicate, but this behavior stopped as soon
           * as this fix was applied. This issue might also only be caused
           * in certain development environments where the usage of a hot
           * module reloader is causing errors.
           */
          if (
            from === undefined &&
            startingUrl &&
            startingUrl.indexOf(to.toString()) !== -1
          ) {
            startingUrl = undefined;
            return;
          }

          if (from?.toString() !== to.toString()) {
            startingUrl = undefined;

            if (activeTransaction) {
              // If there's an open transaction on the scope, we need to
              // finish it before creating an new one.
              activeTransaction.finish();
            }

            activeTransaction = customStartTransaction({
              name: window.location.pathname,
              op: "navigation",
              metadata: { source: "url" },
            });
          }

          detail.resume();
        }
      );
    }
  };
}

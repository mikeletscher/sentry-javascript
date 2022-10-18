import { Transaction, TransactionContext } from '@sentry/types';

export type TurboInstrumentation = <T extends Transaction>(
  startTransaction: (context: TransactionContext) => T | undefined,
  startTransactionOnPageLoad?: boolean,
  startTransactionOnLocationChange?: boolean,
) => void;

// From https://github.com/hotwired/turbo/blob/ade31a6268e8171f057dd40c5362cfb938cad8b8/src/http/fetch_request.ts
export type TurboBeforeFetchRequestEvent = CustomEvent<{
  fetchOptions: RequestInit
  url: URL
  resume: (value?: any) => void
}>



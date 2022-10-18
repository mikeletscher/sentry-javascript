import { BrowserOptions, init as browserInit, SDK_VERSION } from '@sentry/browser';

/**
 * Inits the Hotwire SDK
 */
export function init(options: BrowserOptions): void {
  options._metadata = options._metadata || {};
  options._metadata.sdk = options._metadata.sdk || {
    name: 'sentry.javascript.hotwire',
    packages: [
      {
        name: 'npm:@sentry/hotwire',
        version: SDK_VERSION,
      },
    ],
    version: SDK_VERSION,
  };
  browserInit(options);
}

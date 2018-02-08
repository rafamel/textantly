// Users will only see deployed updates on the "N+1" visit to a page.
// Read: https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
import config from 'config';
import warn from 'utils/warn';
import store from 'store/_store';
import { actions } from 'store';

const isLocalhost = Boolean(
    window.location.hostname === 'localhost'
        // [::1] is the IPv6 localhost address.
        || window.location.hostname === '[::1]'
        // 127.0.0.1/8 is considered localhost for IPv4.
        || window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
);

function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
        .then(response => {
            // Ensure we really are getting a JS file.
            if (
                response.status === 404
                || response.headers
                    .get('content-type')
                    .indexOf('javascript') === -1
            ) {
                // No service worker found. Reload the page.
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl);
            }
        })
        .catch(() => {
            warn(
                'No internet connection found. App is running in offline mode.',
                'log'
            );
        });
}

function registerValidSW(swUrl) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state !== 'installed') return;
                    if (navigator.serviceWorker.controller) {
                        // The old content will have been purged and
                        // the fresh content will have been added to the cache.
                        // It's the perfect time to display a "New content is
                        // available; please refresh." message in your web app.
                        warn(
                            `There's a new version available. Please refresh.`,
                            'log'
                        );
                        store.dispatch(actions.alerts.add(
                            `There's a new version available. Please refresh.`
                        ));
                    } else {
                        // At this point, everything has been precached.
                        // It's the perfect time to display a
                        // "Content is cached for offline use." message.
                        warn('Content is cached for offline use.', 'log');
                    }
                };
            };
        })
        .catch(error => {
            warn(
                ['Error during service worker registration:', error],
                'error'
            );
        });
}

function register() {
    if ('serviceWorker' in navigator) {
        warn('Registering service worker', 'log');
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
        // Service worker won't work if PUBLIC_URL is on a different
        // origin from what our page is served on
        // (if a CDN is used to serve assets):
        // https://github.com/facebookincubator/create-react-app/issues/2374
        if (publicUrl.origin !== window.location.origin) return;

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
            if (isLocalhost) {
                // Check if a service worker still exists or not.
                checkValidServiceWorker(swUrl);
            } else {
                // Is not local host. Just register service worker
                registerValidSW(swUrl);
            }
        });
    }
}

function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}

export default function initServiceWorker() {
    if (!config.production) return;
    if (config.serviceWorker) register();
    else unregister();
}

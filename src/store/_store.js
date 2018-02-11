import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import localForage from 'localforage';
import {
  initialState,
  reducer,
  logic,
  persist as persistWhitelist
} from './index';
import { historian } from './edits/init';
import warn from 'utils/warn';
import config from 'config';

const middleware = applyMiddleware(logic);

const hasSupport = () =>
  localForage.supports(localForage.WEBSQL) ||
  localForage.supports(localForage.LOCALSTORAGE);

let store, persistor;
if (config.persistStore && hasSupport()) {
  localForage.config({
    driver: [localForage.WEBSQL, localForage.LOCALSTORAGE]
  });

  const safeLocalForage = (() => {
    const setItem = localForage.setItem.bind(localForage);
    let disabled = false;
    return {
      ...localForage,
      setItem: (...args) => {
        return disabled
          ? Promise.resolve()
          : setItem(...args).catch((err) => {
              // If we reach storage limit
              // (or any other storage error),
              // reset store
              localForage.clear();
              warn('Store persist has been disabled');
              disabled = true;
              return Promise.reject(err);
            });
      }
    };
  })();

  const migrate = async (state, currentVersion) => {
    // Restarts state when versions don't match
    if (!state || !state._persist || state._persist.version === undefined) {
      return null;
    }

    let inboundVersion = state._persist.version;
    return inboundVersion === currentVersion ? state : initialState;
  };

  const persistConfig = {
    version: config.version,
    key: 'root',
    storage: safeLocalForage,
    whitelist: persistWhitelist,
    migrate,
    transforms: [
      // Filter history
      createTransform(
        (inbound, key) => {
          return {
            ...inbound,
            [historian.key]: null
          };
        },
        (outbound, key) => {
          return {
            ...outbound,
            [historian.key]: initialState.edits[historian.key]
          };
        },
        { whitelist: ['edits'] }
      )
    ]
  };

  store = createStore(persistReducer(persistConfig, reducer), middleware);
  persistor = persistStore(store);
} else {
  if (config.persistStore) warn('Store persist is not supported');

  store = createStore(reducer, middleware);
  persistor = {
    subscribe: (cb) => cb(),
    getState: () => ({ bootstrapped: true })
  };
}

export { store as default, persistor };

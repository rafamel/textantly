import packagejson from '../package.json';
const env = process.env.NODE_ENV;
const onEnv = (obj) => (obj.hasOwnProperty(env) ? obj[env] : obj.default);

export default {
  version: packagejson.version,
  production: env === 'production',
  snackbarDuration: 3500,
  mobileBreakpoint: 'md',
  defaults: {
    source: {
      name: '',
      src: 'static/default.png'
    },
    text: {
      textString: 'Your Text Here',
      fontFamily: 'Playfair Display SC',
      fontWeight: '400',
      alignment: 'center',
      overlayPosition: 'left',
      overlayWidth: 40,
      overlayHeight: 20,
      colorScheme: 'light'
    }
  },
  serviceWorker: true, // Only in production
  persistStore: onEnv({
    default: true,
    production: true
  }),
  tracking: onEnv({
    default: false,
    production: true
  }),
  image: {
    timeout: 20000,
    proxy: (src) => {
      src = encodeURI(
        src
          .split('//')
          .slice(1)
          .join('//')
      );
      return `https://images.weserv.nl/?url=${src}&${Date.now()}`;
    }
  }
};

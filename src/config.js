const env = process.env.NODE_ENV;
const onEnv = (obj) => obj.hasOwnProperty(env) ? obj[env] : obj.default;

export default {
    production: env === 'production',
    snackbarDuration: 3500,
    mobileBreakpoint: 'md',
    defaults: {
        src: {
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
    persistStore: onEnv({
        default: true,
        development: false
    }),
    serviceWorker: onEnv({
        default: true,
        development: false
    }),
    image: {
        timeout: 20000,
        proxy: (src) => {
            src = encodeURI(src.split('//').slice(1).join('//'));
            return `https://images.weserv.nl/?url=${src}&${Date.now()}`;
        }
    }
};

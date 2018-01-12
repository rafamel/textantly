export default {
    name: 'Textantly',
    snackbarDuration: 3500,
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
    }
};

import fonts from 'google-fonts-complete';
import FontFaceObserver from 'fontfaceobserver';
import googleFonts from 'google-fonts';

const data = Object.keys(fonts).reduce((acc, key) => {
    const font = fonts[key];
    if (!font.variants || !font.variants.normal) return acc;
    const weights = Object.keys(font.variants.normal);
    if (!weights.length) return acc;
    acc[key] = weights;
    return acc;
}, {});

function load(fontName, timeout = 3000) {
    googleFonts.add({ [fontName]: true });
    return (new FontFaceObserver(fontName)).load(null, timeout);
}

export {
    data,
    load
};

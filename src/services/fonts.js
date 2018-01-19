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

function preload(fontName, weight, timeout) {
    return (new FontFaceObserver(fontName, { weight }))
        .load(null, timeout);
}

function load(fontName, timeout = 4000) {
    googleFonts.add({ [fontName]: true });
    return Promise.all(
        data[fontName].map(weight => preload(fontName, weight, timeout))
    );
}

export {
    data,
    load
};

import FontFaceObserver from 'fontfaceobserver';
import googleFonts from 'google-fonts';
import data from './google-fonts';

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

export { data, load };

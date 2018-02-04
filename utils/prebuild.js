const fs = require('fs');
const path = require('path');
const fonts = require('google-fonts-complete');

// Fonts - We'll pre-select the data we need
// as it'll significantly reduce the bundle size
const fontData = Object.keys(fonts).reduce((acc, key) => {
    const font = fonts[key];
    if (!font.variants || !font.variants.normal) return acc;
    const weights = Object.keys(font.variants.normal);
    if (!weights.length) return acc;
    acc[key] = weights;
    return acc;
}, {});

fs.writeFileSync(
    path.join(__dirname, '../src/services/google-fonts.json'),
    JSON.stringify(fontData)
);

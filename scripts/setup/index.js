'use strict';
const path = require('path');

const reactScripts = 'custom-react-scripts';
const reactScriptsDir = path.join(__dirname, '../../node_modules/', reactScripts);

async function setup() {
    // await require('./reinstall-react-scripts')(reactScripts);
    await require('./enable-eslint')(reactScriptsDir);
}

setup().catch(e => { console.error(e) });

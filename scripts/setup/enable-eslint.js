'use strict';
const path = require('path');
const readDir = require('fs-readdir-recursive');
const iterator = require('object-recursive-iterator');
const fs = require('fs');
const config = require('../../config');

module.exports = (reactScriptsDir) => {
    return new Promise((resolve, reject) => {
        console.log('\nSubstituting useElintrc & ignore\n')
        const files = readDir(reactScriptsDir)
            .filter(name => name.indexOf('webpack.config') !== -1);
        if (!files.length) {
            return reject(Error('webpack.config not found'));
        }
        for (let file of files) {
            const filePath = path.join(reactScriptsDir, file);
            let content = fs.readFileSync(filePath).toString();
            const regexp = /(ignore:( *)?(false|true),?( |\n)*useEslintrc:( *)?(false|true)|useEslintrc:( *)?(false|true),?( |\n)*ignore:( *)?(false|true))/;
            if (!content.match(regexp)) {
                return reject(Error(`useEslintrc & ignore options not found in ${file}`));
            }
            content = content.replace(
                regexp,
                `useEslintrc: ${config.reactApp.useEslintrc},
                ignore: ${config.reactApp.useEslintignore}`
            );
            fs.writeFileSync(filePath, content);
        }
        resolve();
    });
};

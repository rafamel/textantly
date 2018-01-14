'use strict';
const { getLoader } = require('react-app-rewired');

function getBabelLoader(config) {
    const loaderMatcher = (rule) => rule.loader && rule.loader.indexOf('babel-loader') !== -1;
    const babelLoader = getLoader(config.module.rules, loaderMatcher);
    if (!babelLoader) throw Error('babel-loader not found');
    return babelLoader;
}

function getBabelPresetReactApp(config) {
        const babelLoader = getBabelLoader(config);
        // https://github.com/facebookincubator/create-react-app/tree/master/packages/babel-preset-react-app
        const babelPresetReactApp = require(babelLoader.options.presets[0]);
        if (!babelPresetReactApp) throw Error('babel-preset-react-app not found');
        return babelPresetReactApp;
}

function getBabelPresetEnvConf(config) {
    const babelPresetEnv = getBabelPresetReactApp(config)
        .presets
        .filter(x => x[0] === require.resolve('babel-preset-env') || x[0] === 'babel-preset-env')[0];
    if (!babelPresetEnv) throw Error('babel-preset-env not found');
    return babelPresetEnv[1] || {};
}

function injectBabelPreset(plugin, config) {
    const babelLoader = getBabelLoader(config);
    babelLoader.options.presets = (babelLoader.options.presets || []).concat([plugin]);
    return config;
}

function injectBabelPlugin(plugin, config) {
    const babelLoader = getBabelLoader(config);
    babelLoader.options.plugins = [plugin].concat(babelLoader.options.plugins || []);
    return config;
}

module.exports = {
    getPresetEnvConf: getBabelPresetEnvConf,
    getLoader: getBabelLoader,
    preset: injectBabelPreset,
    plugin: injectBabelPlugin
};

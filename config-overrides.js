const merge = require('lodash.merge');
const babelRewire = require('./util/babel-rewire');
const rewireEslint = require('react-app-rewire-eslint');

function babel(config, env) {
    // Add babel-polyfill (useBuiltIns: true) for target
    const babelPresetEnvConf = babelRewire.getPresetEnvConf(config);
    config = babelRewire.preset([
        require.resolve('babel-preset-env'),
        merge(babelPresetEnvConf, { targets: { ie: 9 }, useBuiltIns: true })
    ], config);

    // Add 'babel-plugin-transform-class-properties' if not added by default
    config = babelRewire.plugin(require.resolve('babel-plugin-transform-class-properties'), config);
    return config;
}

module.exports = {
    webpack(config, env) {
        // Rewire babel
        config = babel(config, env);

        // Not rewiting Eslint at the moment:
        // Maintaining a more strict eslint config for the console via
        // util/daemon, and the looser react-app default one
        // for the dev environment
        // config = rewireEslint(config, env);

        return config;
    },
    jest(config) {
        if (!config.testMatch) config.testMatch = [];
        config.testMatch
            .push('<rootDir>/test/**/?(*.)(spec|test).js?(x)');

        return config;
    }
};

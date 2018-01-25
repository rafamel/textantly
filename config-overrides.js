// const rewireEslint = require('react-app-rewire-eslint');

module.exports = {
    webpack(config, env) {
        // Absolute paths for ./src
        if (!config.resolve) config.resolve = [];
        config.resolve.modules = (config.resolve.modules || [])
            .concat(['./src']);

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

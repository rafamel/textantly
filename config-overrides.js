// const rewireEslint = require('react-app-rewire-eslint');

module.exports = {
    webpack(config, env) {
        // Not rewiting Eslint at the moment:
        // Maintaining a more strict eslint config for the console via
        // util/daemon, and the looser react-app default one
        // for the dev environment
        // config = rewireEslint(config, env);

        return {
            ...config,
            resolve: {
                ...(config.resolve || {}),
                modules: ((config.resolve && config.resolve.modules) || [])
                    .concat(['./src'])
            }
        };
    },
    jest(config) {
        return {
            ...config,
            testMatch: (config.testMatch || [])
                .concat('<rootDir>/test/**/?(*.)(spec|test).js?(x)'),
            moduleDirectories: (config.moduleDirectories || ['node_modules'])
                .concat('src')
        }
    }
};

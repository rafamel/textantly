const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
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
      // Customize SWPrecacheWebpackPlugin to precache static/default.png
      // (only in production)
      plugins: config.plugins.map((plugin) => {
        if (
          env !== 'production' ||
          plugin.constructor.name !== 'SWPrecacheWebpackPlugin'
        ) {
          return plugin;
        }
        return new SWPrecacheWebpackPlugin({
          ...plugin.options,
          filename: 'service-worker.js',
          mergeStaticsConfig: true,
          staticFileGlobs: ['public/static/default.png'],
          stripPrefix: 'public/',
          staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
        });
      }),
      // Customize modules resolve by adding ./src as absolute
      resolve: {
        ...(config.resolve || {}),
        modules: ((config.resolve && config.resolve.modules) || []).concat([
          './src'
        ])
      }
    };
  },
  jest(config) {
    return {
      ...config,
      testMatch: (config.testMatch || []).concat(
        '<rootDir>/test/**/?(*.)(spec|test).js?(x)'
      ),
      moduleDirectories: (config.moduleDirectories || ['node_modules']).concat(
        'src'
      )
    };
  }
};

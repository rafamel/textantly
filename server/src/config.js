'use strict';
const { env, onEnv } = require('./utils/config-utils');

module.exports = {
    production: env === 'production',
    port: process.env.PORT || onEnv({
        default: 3000,
        production: 80
    }),
    logs: onEnv({
        default: 'dev',
        production: 'combined'
    }),
    joi: {
        abortEarly: true,
        convert: false,
        stripUnknown: true,
        presence: 'required',
        language: {
            root: 'Value',
            key: '{{!label}} '
        }
    }
};

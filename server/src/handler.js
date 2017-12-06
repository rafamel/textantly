'use strict';
const { PublicError, ErrorTypes } = require('./utils/public-error');
const config = require('./config');

const handle = {
    data(req, res, data) {
        res.send(data);
    },
    error(req, res, err) {
        res.status(err.status)
            .send(err.message);
    }
};

module.exports = function handler(appOrRouter) {
    appOrRouter.use((req, res, next) => {
        // 404 Error
        next(new PublicError('Not Found', {
            type: ErrorTypes.NotFound
        }));
    });
    appOrRouter.use((data, req, res, next) => {
        // Data delivery
        if (!(data instanceof Error) && data !== undefined) {
            return handle.data(req, res, data);
        }
        // Error handler
        if (!(data instanceof PublicError)) {
            data = new PublicError(null, { err: data });
        }
        if (!config.production && data.trace) console.error(data);
        handle.error(req, res, data);
    });
};

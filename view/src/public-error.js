'use strict';

module.exports = class PublicError extends Error {
    constructor(message) {
        super(message);
        this.isPublic = true;
    }
};

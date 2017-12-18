export default class PublicError extends Error {
    constructor(message) {
        super(message);
        this.isPublic = true;
    }
};

'use strict';
const camando = require('./camando');
const PublicError = require('../public-error');

module.exports = (canvasId) => {
    class Operation {
        constructor(forwards) {
            this._forwards = forwards;
        }
        async render() {
            const canvas = document.getElementById(canvasId.slice(1));
            const caman = camando.Caman(canvasId);
            this.saved = {
                image: canvas.toDataURL(),
                width: caman.width,
                height: caman.height
            };
            return this.forwards();
        }
        async forwards() {
            return camando.play(canvasId, this._forwards);
        }
        async backwards() {
            if (!this.saved || !this.saved.image || !this.saved.width) {
                throw new PublicError('No image data saved to undo');
            }
            return camando.imgLoad(canvasId, this.saved.image,
                false, this.saved.width, this.saved.height);
        }
    }

    return {
        resize: (data) => new Operation(function () {
            this.resize({
                width: data.w,
                height: data.h
            });
        })
    };
};

'use strict';
const { camando } = require('./camando');
const PublicError = require('../public-error');

module.exports = (canvasId) => {
    class Operation {
        constructor(forwards) {
            this._forwards = forwards;
        }
        async render() {
            const canvas = document.getElementById(canvasId.slice(1));
            const caman = Caman(canvasId);
            this.saved = {
                image: canvas.toDataURL(),
                width: caman.width,
                height: caman.height
            };
            return this.forwards();
        }
        async forwards() {
            return camando(canvasId, this._forwards);
        }
        async backwards() {
            if (!this.saved || !this.saved.image || !this.saved.width) {
                throw new PublicError('No image data saved to undo');
            }

            const img = new Image();
            img.src = this.saved.image;
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.id = canvasId.slice(1);
                        canvas.width = this.saved.width;
                        canvas.height = this.saved.height;
                        canvas.getContext('2d').drawImage(img, 0, 0,
                            this.saved.width, this.saved.height);
                        resolve(canvas);
                    } catch (e) { reject(e); }
                };
            }).then((canvas) => {
                return camando(canvasId, function () {
                    this.replaceCanvas(canvas);
                }, false);
            });
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

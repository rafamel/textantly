'use strict';
// eslint-disable-next-line
require('imports-loader?exports=>undefined,require=>false,this=>window!caman');

async function play(canvasId, callback, render = true) {
    let ans;
    return new Promise((resolve, reject) => {
        ans = Caman(canvasId, function () {
            try {
                callback.apply(this);
                if (!render) return resolve();
                this.render(() => {
                    resolve();
                });
            } catch (e) { reject(e); };
        });
    }).then(() => ans);
}

async function imgLoad(canvasId, src, cors, width, height) {
    const img = new Image();
    if (cors) img.crossOrigin = 'Anonymous';
    img.src = src;
    return new Promise((resolve, reject) => {
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.id = canvasId.slice(1);
                canvas.width = width || img.naturalWidth;
                canvas.height = height || img.naturalHeight;
                canvas.getContext('2d').drawImage(
                    img, 0, 0, canvas.width, canvas.height
                );
                resolve(canvas);
            } catch (e) { reject(e); }
        };
    }).then((canvas) => {
        return play(canvasId, function () {
            this.replaceCanvas(canvas);
        }, false);
    });
}

module.exports = {
    Caman,
    play,
    imgLoad
};

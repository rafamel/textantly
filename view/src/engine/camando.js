'use strict';
// eslint-disable-next-line
require('imports-loader?exports=>undefined,require=>false,this=>window!caman');

module.exports = {
    Caman,
    camando(canvasId, callback, render = true) {
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
};

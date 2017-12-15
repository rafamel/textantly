'use strict';
const camando = require('./camando');
const operations = require('./operations');
const PublicError = require('../public-error');
const config = require('../config');

class Canvaser {
    constructor(id) {
        this.id = id;
        this.name = 'image';
        this.operations = operations(id);
        this.history = {
            current: -1,
            arr: []
        };
    }
    async load(image) {
        this.name = image
            .split('/').slice(-1)[0]
            .split('.').slice(0, -1).join('.');

        let ans;
        return new Promise((resolve, reject) => {
            try {
                ans = camando.Caman(this.id, image, () => resolve());
            } catch (e) { reject(e); };
        }).then(() => ans);
    }
    async loadUrl(url) {
        this.name = url
            .split('/').slice(-1)[0]
            .split('.').slice(0, -1).join('.');

        return camando.imgLoad(this.id, url, true);
    }
    async render(operationType, data) {
        if (!this.operations.hasOwnProperty(operationType)) {
            throw new PublicError('Operation doesn\'t exist');
        }
        const operation = this.operations[operationType](data);
        return operation
            .render()
            .then(x => {
                this.history.arr.push(operation);
                this.history.current++;
                return x;
            });
    }
    async forwards(fromDo = false) {
        if (!(this.history.arr.length - 1 > this.history.current)) {
            throw new PublicError('No more forwards data');
        }

        return this.history.arr[this.history.current + 1]
            .forwards()
            .then(x => {
                this.history.current++;
                return x;
            });
    }
    async backwards() {
        if (this.history.current < 0) {
            throw new PublicError('No more backwards data');
        }
        const ans = await this.history.arr[this.history.current].backwards();
        this.history.current--;
        return ans;
    }
    export() {
        const link = document.createElement('a');
        link.href = document.getElementById(this.id.slice(1))
            .toDataURL();
        link.download = `${ config.name.toLowerCase() }-${ this.name }`;
        document.body.appendChild(link);
        link.click();
    }
}

module.exports = Canvaser;

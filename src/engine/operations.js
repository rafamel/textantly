import camando from './camando';
import PublicError from '../public-error';

class Operation {
    constructor(canvasId, forwards) {
        this.canvasId = canvasId;
        this._forwards = forwards;
    }
    async render() {
        const canvas = document.getElementById(this.canvasId.slice(1));
        const caman = camando.Caman(this.canvasId);
        this.saved = {
            image: canvas.toDataURL(),
            width: caman.width,
            height: caman.height
        };
        return this.forwards();
    }
    async forwards() {
        return camando.play(this.canvasId, this._forwards);
    }
    async backwards() {
        if (!this.saved || !this.saved.image || !this.saved.width) {
            throw new PublicError('No image data saved to undo');
        }
        return camando.imgLoad(this.canvasId, this.saved.image,
            false, this.saved.width, this.saved.height);
    }
}

export default (canvasId) => {
    return {
        resize: (data) => new Operation(canvasId, function () {
            this.resize({
                width: data.w,
                height: data.h
            });
        }),
        rotate: (data) => new Operation(canvasId, function () {
            this.rotate(data);
        })
    };
};

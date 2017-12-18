// eslint-disable-next-line
require('imports-loader?exports=>undefined,require=>false,this=>window!caman');
const Caman = window.Caman;

Caman.Plugin.register("rotate", function (degrees) {
    const radians = (angle) => angle * (Math.PI / 180);
    const trig = (angleA, bLength) => {
        const [A, B, C] = [angleA, 90, 90-angleA].map(x => radians(x));
        const length = (radians) => Math.ceil((Math.sin(radians) * bLength) / Math.sin(B));
        return [length(A), length(C)];
    };

    const angle = degrees % 360;
    if (angle === 0) return this;

    const canvas = document.createElement('canvas');
    canvas.id = this.canvas.id;

    let width, height;
    if (angle === 90 || angle === -270 || angle === 270 || angle === -90) {
        width = this.canvas.height;
        height = this.canvas.width;
    } else if (angle === 180 || angle === -180) {
        width = this.canvas.width;
        height = this.canvas.height;
    } else {
        const [heightA, widthA] = trig(angle, this.canvas.width);
        const [widthB, heightB] = trig(angle, this.canvas.height);
        width = widthA + widthB;
        height = heightA + heightB;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radians(angle));
    ctx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    ctx.restore();
    return this.replaceCanvas(canvas);
});

Caman.Filter.register("rotate", function () {
    return this.processPlugin("rotate", Array.prototype.slice.call(arguments, 0));
});

export default Caman;

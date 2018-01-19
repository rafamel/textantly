import isEqual from 'lodash.isequal';
import scale from './scale';
import rotate from './rotate';
import flip from './flip';
import resize from './resize';

function toCanvas(canvasOrImage) {
    switch (canvasOrImage.nodeName) {
    case 'CANVAS':
        return canvasOrImage;
    case 'IMG':
        const canvas = document.createElement('canvas');
        canvas.width = canvasOrImage.naturalWidth;
        canvas.height = canvasOrImage.naturalHeight;
        canvas.getContext('2d').drawImage(
            canvasOrImage, 0, 0, canvas.width, canvas.height
        );
        return canvas;
    default:
        return canvasOrImage;
    }
}

export default class CanvasEngine {
    constructor(image, onUpdate = (() => {})) {
        const source = toCanvas(image);
        this._canvases = {
            source,
            scaled: null,
            drawn: null
        };
        this.onUpdate = onUpdate;
        this._init = false;
        this._doScale = true;
        this._drawnMaxDimensions = {
            width: source.width,
            height: source.height
        };
        this._edits = null;
        this._available = null;
        this._availableTimeout = null;
    }
    init() {
        this._init = true;
        this.draw();
    }
    scale(doScale) {
        if (this._doScale === doScale) return;
        this._doScale = doScale;

        if (!this._doScale && this._canvases.scaled) {
            this._canvases.scaled = null;
            this.draw();
        } else if (this._doScale && !this._canvases.scaled) {
            this._drawScaled();
        }
    }
    setAvailable(available, force) {
        if (!force && isEqual(available, this._available)) return;

        this._available = available;
        if (this._availableTimeout) clearTimeout(this._availableTimeout);

        if (!available) {
            if (this._canvases.scaled) {
                this._canvases.scaled = null;
                this.draw();
            }
            return;
        }

        const drawn = this._canvases.drawn;
        if (!drawn) {
            if (this._doScale) this._drawScaled();
            else this.draw();
            return;
        }

        const scaled = scale.getDimensions(
            this._drawnMaxDimensions, available
        );
        drawn.style.width = `${scaled.width}px`;
        drawn.style.height = `${scaled.height}px`;

        if (!this._doScale) return;
        this._availableTimeout = setTimeout(() => {
            this._drawScaled();
        }, 300);
    }
    setEdits(edits) {
        if (isEqual(edits, this._edits)) return;
        this._edits = edits;

        return this.draw();
    }
    draw() {
        if (!this._init) return;
        let canvas = this._canvases.scaled || this._canvases.source;

        const edits = this._edits;
        if (!edits) {
            this._canvases.drawn = canvas;
            this._drawnMaxDimensions = this._getMaxDimensions();
        } else {
            const source = this._canvases.source;
            canvas = flip.draw(canvas, edits.flip);
            canvas = resize.draw(canvas, edits.resize,
                { width: source.width, height: source.height });
            canvas = rotate.draw(canvas, edits.rotate);

            this._canvases.drawn = canvas;
            this._drawnMaxDimensions = this._getMaxDimensions();
        }

        if (this._available) {
            const scaled = scale.getDimensions(
                this._drawnMaxDimensions, this._available
            );
            canvas.style.width = `${scaled.width}px`;
            canvas.style.height = `${scaled.height}px`;
        }

        this.onUpdate({
            canvas: this._canvases.drawn,
            maxDimensions: this._drawnMaxDimensions
        });
    }
    _getMaxDimensions() {
        if (!this._canvases.scaled) {
            const drawn = this._canvases.drawn;
            return { width: drawn.width, height: drawn.height };
        }

        const source = this._canvases.source;
        let dimensions = { width: source.width, height: source.height };

        const edits = this._edits;
        if (!edits) return dimensions;

        dimensions = resize.getDimensions(dimensions, edits.resize);
        dimensions = rotate.getDimensions(dimensions, edits.rotate);
        return dimensions;
    }
    _drawScaled() {
        if (this._availableTimeout) clearTimeout(this._availableTimeout);

        const available = this._available;
        if (!available) return this.draw();

        const factor = 1.5;
        const dimensions = {
            width: available.width * factor,
            height: available.height * factor
        };

        const source = this._canvases.source;
        if (dimensions.width < source.width
            || dimensions.height < source.height) {
            this._canvases.scaled = scale.draw(source, dimensions);
            this.draw();
        } else if (this._canvases.scaled) {
            this._canvases.scaled = null;
            this.draw();
        }
    }
}

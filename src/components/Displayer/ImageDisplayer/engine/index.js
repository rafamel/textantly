function rotate(canvas, degrees) {
    const radians = (angle) => angle * (Math.PI / 180);
    const trig = (angleA, bLength) => {
        const [A, B, C] = [angleA, 90, 90 - angleA].map(x => radians(x));
        const length = (radians) => Math.ceil(
            (Math.sin(radians) * bLength) / Math.sin(B)
        );
        return [length(A), length(C)];
    };
    const getDimensions = (angle) => {
        angle = Math.abs(angle);
        if (angle > 90) angle = 90 - (angle - 90);
        let width, height;
        if (angle === 90) {
            width = canvas.height;
            height = canvas.width;
        } else if (angle === 0) {
            width = canvas.width;
            height = canvas.height;
        } else {
            const [heightA, widthA] = trig(angle, canvas.width);
            const [widthB, heightB] = trig(angle, canvas.height);
            width = widthA + widthB;
            height = heightA + heightB;
        }
        return { width, height };
    }

    const angle = degrees % 360;
    if (angle === 0) return canvas;

    const { width, height } = getDimensions(angle);
    const rotCanvas = document.createElement('canvas');
    rotCanvas.width = Math.abs(width);
    rotCanvas.height = Math.abs(height);
    const ctx = rotCanvas.getContext('2d');
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radians(angle));
    ctx.drawImage(canvas, -canvas.width / 2,
        -canvas.height / 2, canvas.width, canvas.height);
    return rotCanvas;
}

export default function (canvas, edits) {
    canvas = rotate(canvas, edits.rotate);
    return canvas;
}

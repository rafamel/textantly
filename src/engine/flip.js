function draw(canvas, flip) {
    if (!flip) return canvas;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const ctx = newCanvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    return newCanvas;
}

export default { draw };

import fit from './fit';
import flip from './flip';
import rotate from './rotate';
import crop from './crop';
import resize from './resize';

function makeCanvas(canvasOrImage) {
  const canvas = document.createElement('canvas');
  switch (canvasOrImage.nodeName) {
    case 'CANVAS':
      canvas.width = canvasOrImage.width;
      canvas.height = canvasOrImage.height;
      canvas
        .getContext('2d')
        .drawImage(canvasOrImage, 0, 0, canvas.width, canvas.height);
      return canvas;
    case 'IMG':
      canvas.width = canvasOrImage.naturalWidth;
      canvas.height = canvasOrImage.naturalHeight;
      canvas
        .getContext('2d')
        .drawImage(canvasOrImage, 0, 0, canvas.width, canvas.height);
      return canvas;
    default:
      return canvasOrImage;
  }
}

function merge(baseCanvas, onTopCanvas) {
  const base = makeCanvas(baseCanvas);
  base.getContext('2d').drawImage(onTopCanvas, 0, 0, base.width, base.height);
  return base;
}

function draw(canvas, ops) {
  if (!ops) return canvas;

  if (ops.flip) canvas = flip.draw(canvas, ops.flip);
  if (ops.rotate) canvas = rotate.draw(canvas, ops.rotate);
  if (ops.crop) canvas = crop.draw(canvas, ops.crop);
  if (ops.resize) canvas = resize.draw(canvas, ops.resize);
  if (ops.fit) canvas = fit.draw(canvas, ops.fit);

  return canvas;
}

function getDimensions(dimensions, ops) {
  if (!dimensions) return { width: 0, height: 0 };
  if (!ops) return dimensions;

  if (ops.rotate) dimensions = rotate.getDimensions(dimensions, ops.rotate);
  if (ops.crop) dimensions = crop.getDimensions(dimensions, ops.crop);
  if (ops.resize) dimensions = resize.getDimensions(dimensions, ops.resize);
  if (ops.fit) dimensions = fit.getDimensions(dimensions, ops.fit);

  return dimensions;
}

export default {
  makeCanvas,
  merge,
  draw,
  getDimensions
};

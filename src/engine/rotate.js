const getRadians = (angle) => angle * (Math.PI / 180);
const trig = (angleA, bLength) => {
  const [A, B, C] = [angleA, 90, 90 - angleA].map((x) => getRadians(x));
  const length = (radians) =>
    Math.ceil(Math.sin(radians) * bLength / Math.sin(B));
  return [length(A), length(C)];
};

function getDimensions({ width, height }, degrees = 0) {
  let angle = degrees % 360;
  if (!degrees || !width || !height) return { width, height };

  angle = Math.abs(angle);
  if (angle > 180) angle = 180 - (angle - 180);
  if (angle > 90) angle = 90 - (angle - 90);

  const ans = {};
  if (angle === 0) {
    ans.width = width;
    ans.height = height;
  } else if (angle === 90) {
    ans.width = height;
    ans.height = width;
  } else {
    const [heightA, widthA] = trig(angle, width);
    const [widthB, heightB] = trig(angle, height);
    ans.width = Math.ceil(widthA + widthB);
    ans.height = Math.ceil(heightA + heightB);
  }
  return ans;
}

function draw(canvas, degrees) {
  if (!degrees) return canvas;
  const { width, height } = getDimensions(
    { width: canvas.width, height: canvas.height },
    degrees
  );
  const angle = degrees % 360;
  if (angle === 0) return canvas;

  const rotCanvas = document.createElement('canvas');
  rotCanvas.width = Math.abs(width);
  rotCanvas.height = Math.abs(height);
  const ctx = rotCanvas.getContext('2d');
  ctx.translate(width / 2, height / 2);
  ctx.rotate(getRadians(angle));
  ctx.drawImage(
    canvas,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  return rotCanvas;
}

export default {
  getDimensions,
  draw
};

import Config from "./config";

const canvas = document.createElement('canvas');
export const ctx = canvas.getContext('2d');
canvas.height = Config.canvasHeight;
canvas.width = Config.canvasWidth;
canvas.style = "border: 1px solid black";

// ctx.webkitImageSmoothingEnabled = false;
// ctx.mozImageSmoothingEnabled = false;
// ctx.imageSmoothingEnabled = false;

export const attachCanvas = (element) => {
  element.appendChild(canvas);
};

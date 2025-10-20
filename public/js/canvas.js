const canvas = document.querySelector(".canvas canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.imageSmoothingEnabled = false;

let drawing = false;
let lastX, lastY;
let strokeSize = 2;
let strokeColor = "black";

function drawPixelLine(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    ctx.fillRect(x0, y0, strokeSize, strokeSize);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

canvas.addEventListener("mousedown", start);

canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mouseleave", () => (drawing = false));

canvas.addEventListener("mousemove", move);

function start(e) {
  drawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = Math.floor(e.clientX - rect.left);
  lastY = Math.floor(e.clientY - rect.top);
}

function move(e) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  ctx.fillStyle = strokeColor;
  drawPixelLine(lastX, lastY, x, y);
  lastX = x;
  lastY = y;
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  start(touch);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  move(touch);
});
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  drawing = false;
});

/* BUTTONS */

let pencilButton = document.querySelector("button#pencil");
let eraserButton = document.querySelector("button#eraser");
let smallButton = document.querySelector("button#small");
let mediumButton = document.querySelector("button#medium");

let clearButton = document.querySelector("button#clear");

pencilButton.addEventListener("click", (e) => {
  e.preventDefault();
  strokeColor = "black";
  pencilButton.classList.add("active-tool");
  eraserButton.classList.remove("active-tool");
});

eraserButton.addEventListener("click", (e) => {
  e.preventDefault();
  strokeColor = "white";
  eraserButton.classList.add("active-tool");
  pencilButton.classList.remove("active-tool");
});

smallButton.addEventListener("click", (e) => {
  e.preventDefault();
  strokeSize = 1;
  smallButton.classList.add("active-tool");
  mediumButton.classList.remove("active-tool");
});

mediumButton.addEventListener("click", (e) => {
  e.preventDefault();
  strokeSize = 2;
  mediumButton.classList.add("active-tool");
  smallButton.classList.remove("active-tool");
});

clearButton.addEventListener("click", (e) => {
  e.preventDefault();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.clearCurrentText();
});

copyButton = document.querySelector("button#copy");
copyButton.addEventListener("click", (e) => {
  e.preventDefault();
  // copy image
  const images = document.querySelectorAll(
    "#chat-log .message-box .canvas img"
  );
  const lastImage = images[0];
  if (lastImage) {
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastImage.src;
  }
  // copy text
  const texts = document.querySelectorAll(
    "#chat-log .message-box .canvas .message-text"
  );
  const lastText = texts[0];
  if (lastText) {
    const text = lastText.innerHTML.replace(/<br>/g, "\n");
    window.setCurrentText(text);
  }
});

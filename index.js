import mapData from "./map.json" assert { type: "json" };

let map = JSON.parse(mapData);

const ds = document.querySelector("#canvas-container");

const img = new ImageViewer(map);
const canvas = img.getCanvas();
canvas.id = "myCanvas";
ds.appendChild(canvas);

export default function ImageViewer(data) {
  const BinaryParser = function BinaryParser(data, bytes) {
    this.data = data;
    this.bytes = bytes;
    this.pointer = 0;
  };

  BinaryParser.prototype.getNextSample = function getNextSample() {
    if (this.pointer >= this.data.length) return false;

    let val = 0;
    for (let i = 0; i < this.bytes; i += 1) {
      val = val * 255 + this.data[(this.pointer += 1)];
    }

    return val;
  };

  const PGMFormatter = function PGMFormatter(width, height, maxVal) {
    this.width = width;
    this.height = height;
    this.maxVal = maxVal;
  };

  PGMFormatter.prototype.getCanvas = function getCanvas(parser) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.width = this.width;
    canvas.width = this.width;

    ctx.height = this.height;
    canvas.height = this.height;

    const img = ctx.getImageData(0, 0, this.width, this.height);

    for (let row = 0; row < this.height; row += 1) {
      for (let col = 0; col < this.width; col += 1) {
        const d = parser.getNextSample() * (255 / this.maxVal);
        const pos = (row * this.width + col) * 4;

        img.data[pos] = 255 - d;
        img.data[pos + 1] = 255 - d;
        img.data[pos + 2] = 255 - d;
        img.data[pos + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    return canvas;
  };

  const width = 1920; //map.info.width;
  const height = 1632; //map.info.height;
  const imageData = map.data;
  const maxVal = 255;
  const bytes = maxVal < 256 ? 1 : 2;

  this.parser = new BinaryParser(imageData, bytes);
  this.formatter = new PGMFormatter(width, height, maxVal);

  ImageViewer.prototype.getCanvas = function getCanvas() {
    return this.formatter.getCanvas(this.parser);
  };
}

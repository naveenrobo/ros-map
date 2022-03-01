import mapData from "./map.json" assert { type: "json" };

let map = JSON.parse(mapData);

console.log(map);

let width = 255; //map.info.width;
let height = 255; //map.info.height;
let res = map.info.resolution;
let data = map.data;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

ctx.width = width;
canvas.width = width;

ctx.height = height;
canvas.height = height;

const img = ctx.getImageData(0, 0, width, height);

for (var row = 0; row < height; row++) {
  for (var col = 0; col < width; col++) {
    const pos = (row * width + col) * 4;

    img.data[pos] = 100 - data[pos];
    img.data[pos + 1] = 100 - data[pos + 1];
    img.data[pos + 2] = 100 - data[pos + 2];
    img.data[pos + 3] = 100;
  }
}

ctx.putImageData(img, 0, 0);
document.body.appendChild(canvas);

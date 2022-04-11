import preset from "https://luisarmando-testcoder.github.io/canvas-preset/index.js";

let frecuencies;
let maxFrecuency;
const [xIndex, yIndex] = [
  Math.round(Math.random() * 8),
  Math.round(Math.random() * 8),
];
const { size, clear, draw } = preset();

size();

const tableSquares = getTableSquares();
const getColorFrecuency = (frecuency) =>
  Math.round((frecuency / maxFrecuency) * 255);
const getColor = (r, g, b) => `rgba(${r}, ${g}, ${b}, 1)`;

draw(() => {
  if (!frecuencies) return;

  setFrecuencyIndexTableSquaresColors();
  clear(tableSquares[xIndex][yIndex].color);
}, 10);

function setFrecuencyIndexTableSquaresColors() {
  tableSquares.forEach((row, y) => {
    row.forEach((square, x) => {
      const rgbaParametersAmount = 4;
      const newIndex =
        y * Math.sqrt(frecuencies.length) + x * rgbaParametersAmount;
      const [r, g, b] = [
        getColorFrecuency(frecuencies[newIndex + 0]),
        getColorFrecuency(frecuencies[newIndex + 1]),
        getColorFrecuency(frecuencies[newIndex + 2]),
      ];
      square.color = getColor(r, g, b);
      square.normalSize = 1 - (r + g + b) / 3 / 255;
    });
  });
}

function getTableSquares(sideSize = 8) {
  return [...new Array(sideSize)].map((_, x) => {
    return [...new Array(sideSize)].map((_, y) => {
      return {
        x,
        y,
        color: null,
        width: 1,
        height: 1,
      };
    });
  });
}

function addEventListeners(eventNames, callback, target = window) {
  eventNames.forEach((eventName) => {
    target.addEventListener(eventName, callback);
  });
}

function captureStream(stream) {
  let audioContext = new AudioContext();
  let microphone = audioContext.createMediaStreamSource(stream);
  let analyser = audioContext.createAnalyser();

  microphone.connect(analyser);

  frecuencies = new Uint8Array(analyser.frequencyBinCount);

  function play() {
    analyser.getByteFrequencyData(frecuencies);

    maxFrecuency = 0;

    for (const frecuency of frecuencies) {
      if (frecuency > maxFrecuency) {
        maxFrecuency = frecuency;
      }
    }

    requestAnimationFrame(play);
  }

  play();
}

addEventListeners(["click", "touchstart"], () => {
  if (frecuencies) return;

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  navigator.getUserMedia(
    { video: false, audio: true },
    captureStream,
    console.log
  );
});

import preset from "https://luisarmando-testcoder.github.io/canvas-preset/index.js";

let frecuencies;
let maxFrecuency;
const { size, clear, draw, c, renderGroup } = preset();

size();

const tableSquares = getTableSquares();
const getFrecuency = (frecuency) =>
  Math.round((frecuency / maxFrecuency) * 255);
const getColor = (r, g, b) => `rgba(${r}, ${g}, ${b}, 1)`;

draw(() => {
  clear("black");

  if (!frecuencies) return;

  setFrecuencyIndexTableSquaresColors();

  let flatTable = tableSquares.flat();
  let mappedFlat = flatTable.map(({ x, y, color }) => {
    const newSize = c.width / c.height >= 1 ? c.height / 20 : c.width / 10;
    const newSpacing = 10;
    const getPosition = (sideSize, axisPointer) => {
      return (
        axisPointer * (newSpacing / 2 + newSize) +
        sideSize / 2 -
        (tableSquares.length * (newSpacing / 2 + newSize)) / 2
      );
    };

    return {
      x: getPosition(c.width, x),
      y: getPosition(c.height, y),
      width: newSize,
      height: newSize,
      color,
    };
  });

  flatTable = null;

  renderGroup("rect", mappedFlat);

  mappedFlat = null;
}, 10);

function setFrecuencyIndexTableSquaresColors() {
  tableSquares.forEach((row, y) => {
    row.forEach((square, x) => {
      const rgbaParametersAmount = 4;
      square.color = getColor(
        frecuencies[
          y * Math.sqrt(frecuencies.length) + x * rgbaParametersAmount + 0
        ],
        frecuencies[
          y * Math.sqrt(frecuencies.length) + x * rgbaParametersAmount + 1
        ],
        frecuencies[
          y * Math.sqrt(frecuencies.length) + x * rgbaParametersAmount + 2
        ]
      );
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
    target.addEventListener("click", callback);
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

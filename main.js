import preset from "https://luisarmando-testcoder.github.io/canvas-preset/index.js";

var frecuencies;
const { size, clear, draw, render, c, setAudioToggle } = preset();

size();

window.addEventListener("click", () => {
  if (frecuencies) return;

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  navigator.getUserMedia({ video: false, audio: true }, callback, console.log);
});

draw(() => {
  if (!frecuencies) return;

  // console.log(frecuencies);

  const getRandom = () => Math.round(Math.random() * 10);

  clear(`#${getRandom()}${getRandom()}${getRandom()}`);
}, 10);

function callback(stream) {
  var ctx = new AudioContext();
  var mic = ctx.createMediaStreamSource(stream);
  var analyser = ctx.createAnalyser();
  // oscillator will mimic heard frecuencies
  // var osc = ctx.createOscillator();

  mic.connect(analyser);
  // osc.connect(ctx.destination);
  // osc.start(0);

  frecuencies = new Uint8Array(analyser.frequencyBinCount);

  function play() {
    analyser.getByteFrequencyData(frecuencies);

    // get fullest bin
    var index = 0;
    for (var j = 0; j < analyser.frequencyBinCount; j++) {
      if (frecuencies[j] > frecuencies[index]) {
        index = j;
      }
    }

    var frequency = (index * ctx.sampleRate) / analyser.fftSize;
    // console.log(frequency);
    // osc.frequency.value = frequency;

    requestAnimationFrame(play);
  }

  play();
}

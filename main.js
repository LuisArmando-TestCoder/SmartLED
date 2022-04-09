import preset from "https://luisarmando-testcoder.github.io/canvas-preset/index.js";

const { size, clear, draw, render, c } = preset();

size();
// base before draft
draw(() => {
  const getRandom = () => (Math.round(Math.random() * 10));

  clear(`#${getRandom()}${getRandom()}${getRandom()}`);
}, 10);

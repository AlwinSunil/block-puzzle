const canvas = document.querySelector(".canvas");
const highScoreElem = document.querySelector(".highscore-value");

// Constants from local storage
const GRID_SIZE = parseInt(localStorage.getItem("grid"));
const HIGH_SCORE = localStorage.getItem("highscore");

// Set high score on UI
highScoreElem.innerText = HIGH_SCORE;

// Initialize canvas grid and items
setCanvasGrid();
generateCanvasItem();

// Event listeners
window.addEventListener("resize", adjustCanvasItemSize);

// Background audio
const backgroundAudio = createAudio(
  "../assets/audio/backgroundscore.mp3",
  0.4,
  true
);

initializeSoundCheckbox();

// Functions
function createAudio(src, volume, loop) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}

function setCanvasGrid() {
  canvas.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  canvas.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
}

function generateCanvasItem() {
  for (let i = 1; i < GRID_SIZE * GRID_SIZE + 1; i++) {
    const element = document.createElement("div");
    element.classList.add("canvas-item");
    element.id = `canvas-item-${i}`;
    canvas.appendChild(element);
  }
}

function adjustCanvasItemSize() {
  // Convert the NodeList to an array
  let blockItemElem = document.getElementsByClassName("block-item");
  blockItemElem = Array.from(blockItemElem);

  const canvasItem = document.querySelector(".canvas-item");
  blockItemSide = canvasItem.offsetWidth;

  blockItemElem.forEach((element) => {
    element.style.width = `${blockItemSide}px`;
    element.style.height = `${blockItemSide}px`;
  });
}

function initializeSoundCheckbox() {
  const soundCheckbox = document.getElementById("soundCheckbox");
  soundCheckbox.addEventListener("change", toggleBackgroundAudio);

  // Initial audio state based on the checkbox
  toggleBackgroundAudio();
}

function toggleBackgroundAudio() {
  const soundCheckbox = document.getElementById("soundCheckbox");
  if (soundCheckbox.checked) {
    backgroundAudio.play();
  } else {
    backgroundAudio.pause();
  }
}

function blockClickSound() {
  // Sound Effect by UNIVERSFIELD, "https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=124476"
  // From Pixabay
  playAudio("../assets/audio/item_click.mp3", 1, 0.3);
}

function canvasClickSound() {
  // Sound Effect by Samuel F. Johanns, https://pixabay.com/users/samuelfrancisjohnson-1207793/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=122134"
  // From Pixabay
  playAudio("../assets/audio/canvas_click.mp3", 1, 0.1);
}

function pointScoredSound() {
  // Sound Effect from Pixabay
  playAudio("../assets/audio/point_scored.mp3", 1, 0.1);
}

function playAudio(audioSrc, volume, currentTime) {
  const audio = createAudio(audioSrc, volume, false);
  audio.currentTime = currentTime;
  audio.play();
}

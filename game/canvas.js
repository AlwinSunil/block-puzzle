const canvas = document.querySelector(".canvas");
const highScoreElem = document.querySelector(".highscore-value");

// Data retrieved from local storage
const gridSize = parseInt(localStorage.getItem("grid"));
const highScore = localStorage.getItem("highscore");

// Updating highscore on UI
highScoreElem.innerText = highScore;

setCanvasGrid();
generateCanvasItem();

function setCanvasGrid() {
  canvas.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  canvas.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
}

function generateCanvasItem() {
  for (let i = 1; i < gridSize * gridSize + 1; i++) {
    const element = document.createElement("div");
    element.classList.add("canvas-item");
    element.id = `canvas-item-${i}`;
    canvas.appendChild(element);
  }
}

window.addEventListener("resize", getCanvasItemWidth);

function getCanvasItemWidth() {
  // Convert the NodeList to an array
  let blockItemElem = document.getElementsByClassName("block-item");
  blockItemElem = Array.from(blockItemElem);

  const canvasItem = document.querySelector(".canvas-item");
  blockItemSide = canvasItem.offsetWidth;
  
  blockItemElem.forEach(function (element) {
    element.style.width = `${blockItemSide}px`;
    element.style.height = `${blockItemSide}px`;
  });
}

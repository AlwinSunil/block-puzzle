const userDetailsForm = document.querySelector("#userdetails");
const usernameInput = document.querySelector("#username");
const nicknameInput = document.querySelector("#nickname");
const highScoreElem = document.querySelector(".highscore-value");
const infoPage = document.querySelector(".intro");
const gamePage = document.querySelector(".game");
const scoreValue = document.querySelector(".userscore-value");
const canvas = document.querySelector(".canvas");
const blocksElem = document.querySelector(".blocks");

// Global variables
let blockItemSide = 0;
const score = 0;

// Data retrived from local storage
const gridSize = localStorage.getItem("grid");
const highScore = localStorage.getItem("highscore");

// Updating highscore on UI
highScoreElem.innerText = highScore;
scoreValue.innerText = score;

const pauseElem = document.querySelector(".pause");
const pauseBtn = document.querySelector(".pause-btn");
const pauseMenuClose = document.querySelector(".menu-close");
const restartBtn = document.querySelector(".restart");

pauseBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  pauseElem.style.display = "flex";
});

pauseMenuClose.addEventListener("click", (event) => {
  pauseElem.style.display = "none";
});

restartBtn.addEventListener("click", (event) => {
  window.location.reload();
});

const blockShape = [
  [[1]],
  [[1, 1]],
  [[1], [1, 1]],
  [[1, 1], [1]],
  [[1, 1, 1], [1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
];

setCanvasGrid();
generateCanvasItem();

// Event Listeners
window.addEventListener("resize", getCanvasItemWidth);

userDetailsForm.onsubmit = function (event) {
  event.preventDefault();
  handleUserDetailsFormSubmit();
};

// Functions

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

function handleUserDetailsFormSubmit() {
  const username = usernameInput.value.trim();
  const nickname = nicknameInput.value.trim();

  if (username !== "" && nickname !== "") {
    localStorage.setItem("username", username);
    localStorage.setItem("nickname", nickname);
    startGame();
  } else alert("Please enter valid username and nickname.");
}

function startGame() {
  infoPage.remove();
  gamePage.style.display = "flex";
  generateBlock(blocksElem);
  getCanvasItemWidth();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBlock(blockElem) {
  for (let i = 0; i < 3; i++) {
    const shapeIndex = getRandomInt(0, blockShape.length - 1);

    const resultMatrix = nestedArrayToMatrix(blockShape[shapeIndex]);

    const block = document.createElement("div");
    block.classList.add("block");
    block.classList.add("pointer");
    blockElem.appendChild(block);

    createBlockElems(block, resultMatrix);
  }
}

function createBlockElems(block, resultMatrix) {
  const colors = ["Red", "Orange", "Yellow", "Green", "Blue"];
  const colorIndex = getRandomInt(0, 4);

  for (let row = 0; row < resultMatrix.length; row++) {
    for (let col = 0; col < resultMatrix[row].length; col++) {
      if (resultMatrix[row][col] === 1) {
        const element = document.createElement("div");
        element.classList.add("block-item");
        element.style.borderWidth = "3px";
        element.style.borderStyle = "solid";
        element.style.boxShadow = "0px 0px 10px rgba(255, 255, 255, 0.25)";
        element.style.backgroundColor = `var(--${colors[colorIndex]})`;
        element.style.borderColor = `var(--${colors[colorIndex]}-Bright)`;
        element.style.gridColumn = `${col + 1}`;
        element.style.gridRow = `${row + 1}`;
        block.appendChild(element);
      }
    }
  }
}

function nestedArrayToMatrix(nestedArray) {
  const rows = nestedArray.length;
  const columns = Math.max(...nestedArray.map((row) => row.length));

  const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < nestedArray[i].length; j++) {
      matrix[i][j] = nestedArray[i][j];
    }
  }

  return matrix;
}

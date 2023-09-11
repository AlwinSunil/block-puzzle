const userDetailsForm = document.querySelector("#userdetails");
const usernameInput = document.querySelector("#username");
const nicknameInput = document.querySelector("#nickname");
const infoPage = document.querySelector(".intro");
const gamePage = document.querySelector(".game");
const blocksElem = document.querySelector(".blocks");
const scoreValue = document.querySelector(".userscore-value");
const canvasItems = canvas.querySelectorAll(".canvas-item");

// Global variables
let SCORE = 0;

scoreValue.innerText = SCORE;

const blockShape = [
  [[1]],
  [[1, 1]],
  [[1, 1], [1]],
  [[1], [1, 1]],
  [([1, 1, 1], [1])],
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

userDetailsForm.onsubmit = function (event) {
  event.preventDefault();
  handleUserDetailsFormSubmit();
};

function handleUserDetailsFormSubmit() {
  const USER_NAME = usernameInput.value.trim();
  const NICK_NAME = nicknameInput.value.trim();

  if (USER_NAME !== "" && NICK_NAME !== "") {
    localStorage.setItem("username", USER_NAME);
    localStorage.setItem("nickname", NICK_NAME);
    startGame();
  } else alert("Please enter valid username and nickname.");
}

function startGame() {
  gamePage.style.display = "flex";
  infoPage.remove();

  generateBlock(blocksElem);
  adjustCanvasItemSize(); // Function definition in canvas.js
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let generatedBlockMatrices = [];

function trackBlocks() {
  let noOfBlockUsed = 0;

  const blocks = Array.from(blocksElem.children);

  blocks.forEach((blockItem, index) => {
    if (blockItem.classList.contains("block-used")) {
      generatedBlockMatrices.splice(index, 1);

      noOfBlockUsed += 1;
    }
  });

  if (noOfBlockUsed >= 3) {
    blocks.forEach((element) => element.remove());
    generatedBlockMatrices = [];
    generateBlock(blocksElem);
    noOfBlockUsed = 0;
  }
}

function generateBlock(blockElem) {
  const previousBlocks = blockElem.querySelectorAll(".block");

  previousBlocks.forEach((block) => {
    block.remove();
  });

  for (let i = 1; i < 4; i++) {
    const colors = ["Red", "Orange", "Yellow", "Green", "Blue"];
    const colorIndex = getRandomInt(0, 4);

    const shapeIndex = getRandomInt(0, blockShape.length - 1);

    const resultMatrix = blockShape[shapeIndex];
    generatedBlockMatrices.push(resultMatrix);

    const block = document.createElement("div");
    block.classList.add("block");
    block.id = `block-${i}`;
    block.setAttribute("data-matrix", JSON.stringify(resultMatrix));
    block.setAttribute("data-color", colors[colorIndex]);
    blockElem.appendChild(block);

    createBlockElems(block, resultMatrix, colors[colorIndex]);
  }

  adjustCanvasItemSize();
}

function createBlockElems(block, resultMatrix, color) {
  for (let row = 0; row < resultMatrix.length; row++) {
    for (let col = 0; col < resultMatrix[row].length; col++) {
      if (resultMatrix[row][col] === 1) {
        const element = document.createElement("div");
        element.classList.add("block-item");
        element.style.borderWidth = "3px";
        element.style.borderStyle = "solid";
        element.style.boxShadow = "0px 0px 10px rgba(255, 255, 255, 0.25)";
        element.style.backgroundColor = `var(--${color})`;
        element.style.borderColor = `var(--${color}-Bright)`;
        element.style.gridColumn = `${col + 1}`;
        element.style.gridRow = `${row + 1}`;
        block.appendChild(element);
      }
    }
  }
}

blocksElem.addEventListener("click", handleBlockClick);

let selectedBlock;
let selectedMatrix;
let selectedBlockColor;

function handleBlockClick(event) {
  const clickedBlock = event.target.parentElement;

  if (!clickedBlock.classList.contains("block")) return;
  blockClickSound();

  if (clickedBlock === selectedBlock) {
    clickedBlock.classList.remove("block-active");
    resetSelected();
  } else {
    if (selectedBlock) selectedBlock.classList.remove("block-active");

    if (!clickedBlock.classList.contains("block-used")) {
      selectedBlock = clickedBlock;
      selectedBlock.classList.add("block-active");
      selectedMatrix = JSON.parse(clickedBlock.getAttribute("data-matrix"));
      selectedBlockColor = clickedBlock.getAttribute("data-color");
    }
  }
}

const canvasMatrix = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0)
);

traceCanvasToMatrix();

canvas.addEventListener("click", handleCanvasClick);

function handleCanvasClick(event) {
  const clickedItem = event.target;

  if (clickedItem.classList.contains("canvas-item")) {
    const index = Array.from(canvasItems).indexOf(clickedItem);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    if (selectedMatrix) {
      canvasClickSound();

      if (canPlaceMatrix(row, col, selectedMatrix)) {
        if (selectedBlock) {
          selectedBlock.classList.remove("block-active");
          selectedBlock.classList.add("block-used");
        }
        placeMatrix(row, col);
        resetSelected();
        traceCanvasToMatrix();
      }
    }
  }

  updateCanvasHTML();
  updateScore();
  updateCanvasHTML();
  clearRowAndCol();
  trackBlocks();

  if (!checkIfMatrixesFit()) {
    gameover();
  }
}

function gameover() {
  localStorage.setItem("userscore", SCORE);
  setTimeout(() => {
    window.location.href = "../gameover/index.html";
  }, 500);
}

function resetSelected() {
  selectedBlock = null;
  selectedMatrix = null;
}

function traceCanvasToMatrix() {
  canvasItems.forEach((canvasItem, index) => {
    if (canvasItem.classList.contains("active")) {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      canvasMatrix[row][col] = 1;
    }
  });
}

function canPlaceMatrix(startRow, startCol, matrix) {
  const matrixSize = matrix.length;
  const matrixCols = matrix[0].length;

  // Check if the entire selectedMatrix can fit within the canvas boundaries
  if (startRow + matrixSize > GRID_SIZE || startCol + matrixCols > GRID_SIZE) {
    return false;
  }

  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixCols; col++) {
      if (
        (canvasMatrix[startRow + row][startCol + col] !== 0 &&
          matrix[row][col] === 1) ||
        startRow + row >= GRID_SIZE ||
        startCol + col >= GRID_SIZE
      ) {
        return false;
      }
    }
  }

  return true;
}

function placeMatrix(startRow, startCol) {
  const matrixSize = selectedMatrix.length;

  let matrixCols = 0;

  for (const row of selectedMatrix) {
    const rowLength = row.length;
    if (rowLength > matrixCols) {
      matrixCols = rowLength;
    }
  }

  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixCols; col++) {
      if (selectedMatrix[row][col] === 1) {
        canvasMatrix[startRow + row][startCol + col] = 1;
        updateCanvasItemColor(startRow + row, startCol + col);
      }
    }
  }
}

function updateCanvasItemColor(row, col) {
  const index = row * GRID_SIZE + col;
  const canvasItem = canvasItems[index];

  canvasItem.classList.add(selectedBlockColor);
}

function updateCanvasHTML() {
  canvasItems.forEach((canvasItem, index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    if (canvasMatrix[row][col] === 1) {
      canvasItem.classList.add("active");
    }
    if (canvasMatrix[row][col] === -1) {
      canvasItem.classList.remove("active");
      const classesToRemove = ["Red", "Orange", "Yellow", "Green", "Blue"];
      canvasItem.classList.remove(...classesToRemove);
    }
  });
}

function updateScore() {
  let noFilledRowAndCol = checkRowAndCol();

  let times = noFilledRowAndCol.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  if (times) pointScoredSound();

  if (times >= 4) SCORE = SCORE + 90;
  else if (times == 3) SCORE = SCORE + 60;
  else if (times == 2) SCORE = SCORE + 30;
  else if (times == 1) SCORE = SCORE + 10;
  scoreValue.innerText = SCORE;
}

function clearRowAndCol() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (canvasMatrix[row][col] === -1) {
        canvasMatrix[row][col] = 0;
      }
    }
  }
}

function checkRowAndCol() {
  let filledRows = [];
  let filledColumns = [];

  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    let isRowFilled = true;
    for (let col = 0; col < GRID_SIZE; col++) {
      if (canvasMatrix[row][col] !== 1) {
        isRowFilled = false;
        break;
      }
    }
    if (isRowFilled) {
      filledRows.push(row);
    }
  }

  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    let isColumnFilled = true;
    for (let row = 0; row < GRID_SIZE; row++) {
      if (canvasMatrix[row][col] !== 1) {
        isColumnFilled = false;
        break;
      }
    }
    if (isColumnFilled) {
      filledColumns.push(col);
    }
  }

  // Update rows to -1
  filledRows.forEach((row) => {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (canvasMatrix[row][col] === 1) {
        canvasMatrix[row][col] = -1;
      }
    }
  });

  // Update columns to -1
  filledColumns.forEach((col) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      if (canvasMatrix[row][col] === 1) {
        canvasMatrix[row][col] = -1;
      }
    }
  });

  return [filledColumns.length, filledRows.length];
}

function checkIfMatrixesFit() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (canvasMatrix[row][col] === 0) {
        for (let i = 0; i < generatedBlockMatrices.length; i++) {
          const matrix = generatedBlockMatrices[i];

          if (canPlaceMatrix(row, col, matrix)) {
            return true; // If at least one matrix fits, return true
          }
        }
      }
    }
  }

  return false; // No matrix fits, return false
}

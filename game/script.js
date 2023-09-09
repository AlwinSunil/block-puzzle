const userDetailsForm = document.querySelector("#userdetails");
const usernameInput = document.querySelector("#username");
const nicknameInput = document.querySelector("#nickname");
const infoPage = document.querySelector(".intro");
const gamePage = document.querySelector(".game");
const blocksElem = document.querySelector(".blocks");
const scoreValue = document.querySelector(".userscore-value");

// Global variables
let blockItemSide = 0;
const score = 0;

scoreValue.innerText = score;

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

userDetailsForm.onsubmit = function (event) {
  event.preventDefault();
  handleUserDetailsFormSubmit();
};

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
  getCanvasItemWidth(); // Function definition in canvas.js
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

    const resultMatrix = nestedArrayToMatrix(blockShape[shapeIndex]);

    const block = document.createElement("div");
    block.classList.add("block");
    block.classList.add("pointer");
    block.id = `block-${i}`;
    block.setAttribute("data-matrix", JSON.stringify(resultMatrix));
    block.setAttribute("data-color", colors[colorIndex]);
    blockElem.appendChild(block);

    createBlockElems(block, resultMatrix, colors[colorIndex]);
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

let selectBlock;
let dataMatrix;
let blockColor;
let prevSelectBlock = null;
let sectionActive = false;

const maxSelectedBlocks = 3;
let selectedBlockCount = 0;

blocksElem.addEventListener("click", (e) => {
  const clickedBlock = e.target.parentElement;

  if (selectBlock === clickedBlock) {
    // If the same block is clicked twice, deselect it
    selectBlock.style.transform = "scale(1)";
    selectBlock = null;
    selectedBlockCount--;
  } else if (
    clickedBlock &&
    clickedBlock.classList.contains("block") &&
    !sectionActive
  ) {
    selectBlock = clickedBlock;
    dataMatrix = selectBlock.getAttribute("data-matrix");
    blockColor = selectBlock.getAttribute("data-color");
    selectBlock.style.transform = "scale(1.25)";
    selectedBlockCount++;

    if (prevSelectBlock !== null) {
      prevSelectBlock.style.transform = "scale(1)";
    }

    prevSelectBlock = selectBlock;
  }
});

canvas.addEventListener("click", () => {
  if (selectBlock) selectBlock.style.transform = "scale(1)";
  selectBlockActive = false;
  selectBlock = null;
});

let matrix = trackCanvas();

function trackCanvas() {
  const matrix = Array.from({ length: 8 }, () => Array(8).fill(0));
  const canvasItems = document.querySelectorAll(".canvas-item");

  // Iterate through the canvas items
  canvasItems.forEach((canvasItem, index) => {
    if (canvasItem.classList.contains("active")) {
      const row = Math.floor(index / 8);
      const col = index % 8;
      matrix[row][col] = 1;
    }
  });

  return matrix;
}

canvas.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (clickedElement.classList.contains("canvas-item")) {
    const index = Array.from(clickedElement.parentElement.children).indexOf(
      clickedElement
    );
    const row = Math.floor(index / 8) + 1;
    const col = (index % 8) + 1;

    let position = [row - 1, col - 1];

    const updatedMatrix = updateMatrix(
      matrix,
      JSON.parse(dataMatrix),
      position[0],
      position[1]
    );
    updateCanvas(updatedMatrix);

    if (selectedBlockCount >= maxSelectedBlocks) {
      // Generate another set of blocks when the maximum is reached
      generateBlock(blocksElem);
      getCanvasItemWidth();
      selectedBlockCount = 0; // Reset the counter
    }
    matrix = trackCanvas();
  }
});

function updateCanvas(matrix) {
  const canvasItems = document.querySelectorAll(".canvas-item");

  canvasItems.forEach((canvasItem, index) => {
    if (matrix[Math.floor(index / 8)][index % 8] === 1) {
      canvasItem.classList.add("active");
      canvasItem.classList.add(blockColor);
    } else {
      canvasItem.classList.remove("active");
      canvasItem.classList.remove(blockColor);
    }
  });
}

function updateMatrix(originalMatrix, subMatrix, row, col) {
  const updatedMatrix = [];

  for (let i = 0; i < originalMatrix.length; i++) {
    updatedMatrix.push([...originalMatrix[i]]);
  }

  for (let i = 0; i < subMatrix.length; i++) {
    for (let j = 0; j < subMatrix[i].length; j++) {
      const newRow = row + i;
      const newCol = col + j;

      if (
        newRow >= 0 &&
        newRow < updatedMatrix.length &&
        newCol >= 0 &&
        newCol < updatedMatrix[0].length
      ) {
        updatedMatrix[newRow][newCol] = subMatrix[i][j];
      }
    }
  }

  return updatedMatrix;
}

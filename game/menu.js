const pauseElem = document.querySelector(".pause");
const pauseBtn = document.querySelector(".pause-btn");
const pauseMenuClose = document.querySelector(".menu-close");
const restartBtn = document.querySelector(".restart");

pauseBtn.addEventListener("click", () => (pauseElem.style.display = "flex"));

pauseMenuClose.addEventListener(
  "click",
  () => (pauseElem.style.display = "none")
);

restartBtn.addEventListener("click", () => window.location.reload());

const gameOverStatus = document.querySelector(".status");
const userScoreElem = document.querySelector(".userscore");
const userScoreValue = document.querySelector(".userscore span");
const highScoreValue = document.querySelector(".highscore span");

const playAgainBtn = document.querySelector(".playagain");

// Retrieving data from localstorage
const USER_SCORE = parseInt(localStorage.getItem("userscore"));
let HIGH_SCORE = parseInt(localStorage.getItem("highscore"));

userScoreValue.innerText = USER_SCORE;
highScoreValue.innerText = `🏆${HIGH_SCORE}`;

if (USER_SCORE > HIGH_SCORE) {
  localStorage.setItem("highscore", USER_SCORE);
  HIGH_SCORE = localStorage.getItem("highscore");
  highScoreValue.innerText = `🏆${HIGH_SCORE}`;
  gameOverStatus.innerHTML = "NEW HIGH <br> SCORE";
  gameOverStatus.style.color = "var(--Green)";
  userScoreElem.style.display = "none";
  window.document.title = "NEW HIGH SCORE - Block Puzzle";
}

playAgainBtn.addEventListener(
  "click",
  () => (window.location.href = "../index.html")
);

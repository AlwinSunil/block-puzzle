const gameOverStatus = document.querySelector(".status");
const userScoreElem = document.querySelector(".userscore");
const userScoreValue = document.querySelector(".userscore span");
const highScoreValue = document.querySelector(".highscore span");

const playAgainBtn = document.querySelector(".playagain");

// Retrieving data from localstorage
const userScore = localStorage.getItem("userscore");
let highScore = localStorage.getItem("highscore");

userScoreValue.innerText = userScore;
highScoreValue.innerText = `🏆${highScore}`;

if (userScore > highScore) {
  localStorage.setItem("highscore", userScore);
  highScore = localStorage.getItem("highscore");
  highScoreValue.innerText = `🏆${highScore}`;
  gameOverStatus.innerHTML = "NEW HIGH <br> SCORE";
  gameOverStatus.style.color = "var(--Green)";
  userScoreElem.style.display = "none";
  window.document.title = "NEW HIGH SCORE - Block Puzzle";
}

playAgainBtn.addEventListener(
  "click",
  () => (window.location.href = "../index.html")
);

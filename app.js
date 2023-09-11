const playBtn = document.querySelector(".btn-play");
const settingsBtn = document.querySelector(".btn-settings");
const settingsElem = document.querySelector(".settings");
const settingsClose = document.querySelector(".menu-close");
const difficultyMenu = document.querySelector(".difficulty");

playBtn.addEventListener("click", () => {
  localStorage.setItem("grid", difficultyMenu.value);
  window.location.href = "./game/index.html";
});

settingsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  settingsElem.style.display = "flex";
});

settingsClose.addEventListener("click", () => hideSettings());

// Hide the settings
document.addEventListener("click", (event) => {
  const target = event.target;

  if (settingsElem && !target.closest(".menu")) hideSettings();
});

function hideSettings() {
  settingsElem.style.display = "none";
}

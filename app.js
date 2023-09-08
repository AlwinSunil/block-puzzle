const settingsBtn = document.querySelector(".btn-settings");
const settingsElem = document.querySelector(".settings");
const settingsClose = document.querySelector(".menu-close");
const difficultyMenu = document.querySelector(".difficulty");
const playBtn = document.querySelector(".btn-play");

settingsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  settingsElem.style.display = "flex";
});

settingsClose.addEventListener("click", () => hideSettings());

playBtn.addEventListener("click", () => {
  localStorage.setItem("grid", difficultyMenu.value);
  window.location.href = "./game/index.html";
});

// Hide the settings
document.addEventListener("click", (event) => {
  const target = event.target;

  if (settingsElem && !target.closest(".menu")) {
    // If the target or its ancestors do not have the class "menu," hide the settings.
    hideSettings();
  }
});

function hideSettings() {
  settingsElem.style.display = "none";
}

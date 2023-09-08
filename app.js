const settingsBtn = document.querySelector(".btn-settings");
const settingsElem = document.querySelector(".settings");
const settingsClose = document.querySelector(".menu-close");
const difficultyMenu = document.querySelector(".difficulty");
const playBtn = document.querySelector(".btn-play");

settingsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  settingsElem.style.display = "flex";
});

settingsClose.addEventListener("click", (event) => {
  settingsElem.style.display = "none";
});

playBtn.addEventListener("click", (event) => {
  localStorage.setItem("grid", difficultyMenu.value);
  window.location.href = "./game/index.html";
});

// Hide the settings
document.addEventListener("click", (event) => {
  const target = event.target;

  if (settingsElem && !target.classList.contains("menu")) {
    let parent = target.parentElement;

    while (parent) {
      // If parent has the class "menu," so don't close the settings.
      if (parent.classList.contains("menu")) return;
      
      parent = parent.parentElement;
    }

    // If no parent has the class "menu," hide the settings.
    hideSettings();
  }
});

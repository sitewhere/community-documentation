var $nav = document.querySelector("#mobile-nav")
var $open_button = document.querySelector(".js-menu-open")
var $close_button = document.querySelector(".js-menu-close")

$open_button.addEventListener("click", () => {
  $nav.classList.remove("hidden")
});

$close_button.addEventListener("click", () => {
  $nav.classList.add("hidden")
});

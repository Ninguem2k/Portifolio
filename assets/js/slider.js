//################# sidebar ##################
let sidebar = document.querySelector("#navbar4");
let btncollapse = document.querySelector("#btn-collapse");

btncollapse.addEventListener("click", () => {
  sidebar.classList.toggle("collapse");
});
//################# collapse ##################
var card = document.getElementsByClassName("Exibir");
var content = document.getElementsByClassName("body");
var size = card.length;
for (var i = 0; i < size; i++) {
  card[i].addEventListener("click", function () {
    for (var i = 0; i < size; i++) {
      if (this === card[i]) {
        if (content[i].classList.contains("collapse")) {
          content[i].classList.remove("collapse");
        } else {
          content[i].classList.toggle("collapse");
        }
      } else if (content[i].classList.contains("collapse") === false) {
        content[i].classList.toggle("collapse");
      }
    }
  });
}

var projcts = document.getElementsByClassName("card-project-main");
var pages = 3;
var pages_total = projcts.length;
var page_atual = 1;
setPage_atual(1);
function setPage_atual(pagina) {
  page_atual = pagina;
  paginação();
}

function paginação() {
  var ataul = page_atual * pages;
  var interval_excluir = ataul - pages;
  var interval_incluir = interval_excluir + pages - 1;

  for (let index = 0; index < projcts.length; index++) {
    if (interval_excluir <= index && index <= interval_incluir) {
      aplicar_collapse(projcts[index], false);
    } else {
      aplicar_collapse(projcts[index], true);
    }
  }
}

function aplicar_collapse(element, opcao) {
  if (opcao === true) {
    if (element.classList.contains("collapse") === false) {
      element.classList.toggle("collapse");
    }
  } else if (opcao === false) {
    if (element.classList.contains("collapse") === true) {
      element.classList.toggle("collapse");
    }
  }
}

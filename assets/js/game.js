function game_termo() {
  var acertos = [];
  var PS_acertos = [];
  var erros = [];
  var PS_erros = [];
  var Letras_posicao_errada = [];
  var PS_Letras_posicao_errada = [];
  var input_termo = document.getElementsByClassName("PS-game");
  var palavra_errada = document.getElementById("palavra_errada");

  var termo = "SEMENTE";

  var value_input = validar_input(input_termo);
  var value_termo = termo_array(termo);

  function validar_input(array) {
    var array_input = [];
    for (let index = 0; index < array.length; index++) {
      array_input[index] = array[index].value.toUpperCase();
      next_input(index);
    }
    return array_input;
  }

  function termo_array(termo) {
    return termo.split("");
  }

  comparar_termo_input(value_input, value_termo);

  function comparar_termo_input(input, termo) {
    letra_existe(input, termo);
    gerar_palavra_errada(input);
    verificar_se_venceu();
  }

  function letra_existe(input, termo) {
    for (let index = 0; index < termo.length; index++) {
      if (input[index] === termo[index]) {
        acertos.push(input[index]);
        PS_acertos.push(index);
      } else {
        letra_posicao(input[index], index, termo);
      }
    }
  }

  function letra_posicao(input, PS, termo) {
    var existe = true;
    for (let index = 0; index < termo.length; index++) {
      if (input === termo[index]) {
        Letras_posicao_errada.push(input);
        PS_Letras_posicao_errada.push(PS);
        existe = false;
      }
    }
    if (existe) {
      erros.push(input);
      PS_erros.push(PS);
    }
  }

  function gerar_palavra_errada(array) {
    let row = document.createElement("div");
    row.classList.add("d-flex");
    row.classList.add("justify-content-center");
    for (let index = 0; index < array.length; index++) {
      let row_data = document.createElement("div");
      row_data.classList.add("letra-game");
      row_data.style.backgroundColor = Letra_color(index);
      row_data.style.color = "black";
      // row_data.style.width = "3em";
      row_data.innerHTML = array[index];
      row.appendChild(row_data);
    }
    palavra_errada.appendChild(row);
  }

  function Letra_color(index) {
    if (PS_acertos.includes(index)) {
      return "green";
    } else if (PS_Letras_posicao_errada.includes(index)) {
      return "Yellow";
    } else {
      return "red";
    }
  }

  function verificar_se_venceu() {
    if (acertos.length === 7) {
      document.getElementById("my-History").classList.toggle("collapse");
    }
  }
}

function next_input(casa) {
  var input_posicao = document.getElementsByClassName("PS-game");
  if (casa !== 0) {
    if (input_posicao[casa - 1].value === " ") {
      input_posicao[casa - 1].value = "";
      return alert("preencha o campo!");
    }
  }

  if (casa === input_posicao.length) {
    game_termo();
    for (let index = 0; index < input_posicao.length; index++) {
      input_posicao[index].value = "";
    }
    input_posicao[0].focus();
  } else {
    input_posicao[casa].focus();
  }
}

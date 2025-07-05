// Variáveis globais do jogo
let gameStats = {
    attempts: 0,
    maxAttempts: 6,
    currentAttempt: 0
};

// Variável para controlar auto-avanço
let isAutoAdvancing = false;

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
    
    console.log("Termo original:", termo);
    console.log("Termo array:", value_termo);
    console.log("Input do usuário:", value_input);

    function validar_input(array) {
        var array_input = [];
        for (let index = 0; index < array.length; index++) {
            array_input[index] = array[index].value.toUpperCase();
            // Remover a chamada de next_input aqui pois pode estar causando problemas
            // next_input(index);
        }
        
        console.log("Input validado:", array_input);
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
        gameStats.attempts++;
        updateGameStats();
    }

    function letra_existe(input, termo) {
        // Debug: mostrar comparação
        console.log("Comparando:", {
            input: input,
            termo: termo,
            inputLength: input.length,
            termoLength: termo.length
        });
        
        for (let index = 0; index < termo.length; index++) {
            console.log(`Posição ${index}: "${input[index]}" vs "${termo[index]}" = ${input[index] === termo[index]}`);
            
            if (input[index] === termo[index]) {
                acertos.push(input[index]);
                PS_acertos.push(index);
                console.log(`✅ Acerto na posição ${index}: "${input[index]}"`);
            } else {
                letra_posicao(input[index], index, termo);
            }
        }
        
        console.log("Total de acertos:", acertos.length);
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
        row.classList.add("d-flex", "justify-content-center", "mb-2");
        row.style.animationDelay = `${gameStats.attempts * 0.1}s`;
        
        for (let index = 0; index < array.length; index++) {
            let row_data = document.createElement("div");
            row_data.classList.add("letra-game");
            row_data.style.backgroundColor = Letra_color(index);
            row_data.style.color = "white";
            row_data.style.fontWeight = "bold";
            row_data.innerHTML = array[index];
            row.appendChild(row_data);
        }
        palavra_errada.appendChild(row);
        
        // Adicionar efeito de shake se houver erros
        if (erros.length > 0) {
            row.style.animation = "shake 0.5s ease-in-out";
        }
    }

    function Letra_color(index) {
        if (PS_acertos.includes(index)) {
            return "#28a745"; // Verde para acertos
        } else if (PS_Letras_posicao_errada.includes(index)) {
            return "#ffc107"; // Amarelo para posição errada
        } else {
            return "#dc3545"; // Vermelho para erros
        }
    }

    function verificar_se_venceu() {
        // Debug: mostrar informações da verificação
        console.log("Verificando vitória:", {
            acertos: acertos.length,
            acertosArray: acertos,
            termo: termo,
            value_input: value_input
        });
        
        // Mostrar resultado da tentativa
        showAttemptResult(acertos.length, erros.length, Letras_posicao_errada.length);
        
        if (acertos.length === 7) {
            console.log("🎉 VITÓRIA! Jogador acertou todas as letras!");
            showVictoryMessage();
            document.getElementById("my-History").classList.toggle("collapse");
            // Não resetar se ganhou - deixar o jogador ver a história
            return;
        } else if (gameStats.attempts >= gameStats.maxAttempts) {
            console.log("😔 Game Over! Tentativas esgotadas.");
            showGameOverMessage();
            // Resetar após game over
            setTimeout(() => {
                resetGameState();
            }, 3000);
        } else {
            console.log("Tentativa normal. Acertos:", acertos.length, "/ 7");
            // Resetar estado após tentativa normal
            setTimeout(() => {
                resetGameState();
            }, 2000);
        }
    }
}

function next_input(casa) {
    var input_posicao = document.getElementsByClassName("PS-game");
    
    // Verificar se o campo anterior está preenchido (exceto para o primeiro campo)
    if (casa !== 0) {
        const previousValue = input_posicao[casa - 1].value.trim();
        if (previousValue === "" || previousValue === " ") {
            input_posicao[casa - 1].value = "";
            showToast("Preencha o campo anterior primeiro!", "warning");
            highlightInput(input_posicao[casa - 1], false);
            input_posicao[casa - 1].focus();
            return;
        }
    }

    // Se chegou ao último campo, verificar se todos estão preenchidos
    if (casa === input_posicao.length) {
        if (!validateAllFields()) {
            showToast("Preencha todos os campos antes de tentar!", "warning");
            return;
        }
        
        game_termo();
        // O reset será feito pela função verificar_se_venceu
    } else {
        // Só avança se o campo atual estiver preenchido
        const currentValue = input_posicao[casa - 1].value.trim();
        if (currentValue !== "") {
            input_posicao[casa].focus();
        } else {
            showToast("Preencha o campo atual primeiro!", "warning");
            highlightInput(input_posicao[casa - 1], false);
        }
    }
}

// Funções auxiliares para melhorar a UX
function showToast(message, type = "info") {
    // Criar toast notification
    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Função para dar feedback visual no input
function highlightInput(input, isValid = true) {
    input.style.animation = isValid ? "pulseValid 0.3s ease" : "shake 0.5s ease-in-out";
    
    setTimeout(() => {
        input.style.animation = "";
    }, isValid ? 300 : 500);
}

// Função para validar se todos os campos estão preenchidos
function validateAllFields() {
    const inputs = document.querySelectorAll(".PS-game");
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
    
    if (!allFilled) {
        // Destacar campos vazios
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                highlightInput(input, false);
            }
        });
        return false;
    }
    
    return true;
}

// Função para resetar o estado do jogo
function resetGameState() {
    isAutoAdvancing = false;
    const inputs = document.querySelectorAll(".PS-game");
    inputs.forEach(input => {
        input.value = "";
    });
    inputs[0].focus();
}

// Função para resetar o jogo completamente
function resetGame() {
    gameStats.attempts = 0;
    gameStats.currentAttempt = 0;
    resetGameState();
    updateGameStats();
    
    // Limpar resultados anteriores
    const palavraErrada = document.getElementById("palavra_errada");
    if (palavraErrada) {
        palavraErrada.innerHTML = "";
    }
    
    // Esconder a história se estiver visível
    const historyElement = document.getElementById("my-History");
    if (historyElement && !historyElement.classList.contains("collapse")) {
        historyElement.classList.add("collapse");
    }
    
    showToast("Jogo reiniciado! Tente novamente!", "info");
}

// Função para testar a vitória (apenas para debug)
function testVictory() {
    console.log("🧪 Testando vitória...");
    const inputs = document.querySelectorAll(".PS-game");
    const testWord = "SEMENTE";
    
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = testWord[i];
    }
    
    game_termo();
}

// Função para mostrar resultado da tentativa
function showAttemptResult(acertos, erros, posicaoErrada) {
    let message = "";
    let type = "info";
    
    if (acertos === 7) {
        message = "🎉 Parabéns! Você acertou todas as letras!";
        type = "success";
    } else if (acertos > 0 || posicaoErrada > 0) {
        message = `✅ ${acertos} letra(s) correta(s) na posição certa, ${posicaoErrada} letra(s) na posição errada`;
        type = "info";
    } else {
        message = "❌ Nenhuma letra correta. Tente novamente!";
        type = "warning";
    }
    
    showToast(message, type);
}

function showVictoryMessage() {
    showToast("🎉 Parabéns! Você descobriu a palavra!", "success");
    
    // Adicionar confete
    createConfetti();
}

function showGameOverMessage() {
    showToast("😔 Game Over! A palavra era 'SEMENTE'", "error");
}

function updateGameStats() {
    const statsElement = document.getElementById("game-stats");
    if (statsElement) {
        const remainingAttempts = gameStats.maxAttempts - gameStats.attempts;
        statsElement.innerHTML = `Tentativas: ${gameStats.attempts}/${gameStats.maxAttempts} (${remainingAttempts} restantes)`;
        
        // Mudar cor baseado no número de tentativas restantes
        if (remainingAttempts <= 2) {
            statsElement.style.color = "#dc3545"; // Vermelho
        } else if (remainingAttempts <= 4) {
            statsElement.style.color = "#ffc107"; // Amarelo
        } else {
            statsElement.style.color = "var(--purple)"; // Roxo
        }
    }
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.animationDelay = Math.random() * 3 + "s";
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentElement) {
                confetti.remove();
            }
        }, 4000);
    }
}

// Adicionar suporte a tecla Enter e Backspace
document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll(".PS-game");
    
    inputs.forEach((input, index) => {
        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                // Verificar se o campo atual está vazio
                if (this.value.trim() === "") {
                    showToast("Preencha o campo atual!", "warning");
                    highlightInput(this, false);
                    return;
                }
                
                // Verificar se todos os campos estão preenchidos
                if (!validateAllFields()) {
                    showToast("Preencha todos os campos!", "warning");
                    return;
                }
                
                // Se for o último campo ou todos estiverem preenchidos, tentar a palavra
                if (index === inputs.length - 1 || validateAllFields()) {
                    game_termo();
                } else {
                    inputs[index + 1].focus();
                }
            }
        });
        
        // Melhorar navegação com setas e backspace
        input.addEventListener("keydown", function(e) {
            if (e.key === "ArrowLeft" && index > 0) {
                e.preventDefault();
                inputs[index - 1].focus();
            } else if (e.key === "ArrowRight" && index < inputs.length - 1) {
                e.preventDefault();
                // Só permite avançar se o campo atual estiver preenchido
                if (this.value.trim() !== "") {
                    inputs[index + 1].focus();
                } else {
                    showToast("Preencha o campo atual primeiro!", "warning");
                }
            } else if (e.key === "Backspace") {
                // Se o campo está vazio e não é o primeiro, volta para o anterior e limpa
                if (this.value === "" && index > 0) {
                    e.preventDefault();
                    isAutoAdvancing = true; // Previne auto-avanço durante navegação manual
                    inputs[index - 1].value = ""; // Limpa o campo anterior
                    inputs[index - 1].focus();
                    setTimeout(() => {
                        isAutoAdvancing = false;
                    }, 100);
                }
                // Se o campo tem conteúdo, permite apagar normalmente
                // (não faz nada, deixa o comportamento padrão)
            } else if (e.key === "Delete") {
                // Se pressionar Delete em um campo vazio, vai para o próximo
                if (this.value === "" && index < inputs.length - 1) {
                    e.preventDefault();
                    inputs[index + 1].focus();
                }
            }
        });
        
        // Adicionar validação em tempo real
        input.addEventListener("input", function(e) {
            // Converter para maiúscula
            this.value = this.value.toUpperCase();
            
            // Validar se é uma letra válida
            if (this.value.length > 0 && !/^[A-Z]$/.test(this.value)) {
                this.value = "";
                showToast("Digite apenas letras!", "warning");
                highlightInput(this, false);
                return;
            }
            
            // Se digitou uma letra válida, dar feedback visual
            if (this.value.length === 1 && /^[A-Z]$/.test(this.value)) {
                highlightInput(this, true);
                
                // Só avança automaticamente se não for o último campo
                if (index < inputs.length - 1 && !isAutoAdvancing) {
                    isAutoAdvancing = true;
                    setTimeout(() => {
                        inputs[index + 1].focus();
                        isAutoAdvancing = false;
                    }, 200);
                } else if (index === inputs.length - 1) {
                    // Se for o último campo, não avança mas permite continuar
                    showToast("Pressione Enter para tentar!", "info");
                }
            }
        });
        
        // Prevenir colagem de múltiplos caracteres
        input.addEventListener("paste", function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const firstChar = pastedText.charAt(0).toUpperCase();
            
            if (/^[A-Z]$/.test(firstChar)) {
                this.value = firstChar;
                if (index < inputs.length - 1) {
                    setTimeout(() => {
                        inputs[index + 1].focus();
                    }, 50);
                }
            }
        });
    });
});

// Adicionar estilos CSS dinamicamente para as novas funcionalidades
const gameStyles = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--purple), var(--red));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(160, 60, 255, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .toast-success {
        background: linear-gradient(135deg, #28a745, #20c997);
    }
    
    .toast-warning {
        background: linear-gradient(135deg, #ffc107, #fd7e14);
    }
    
    .toast-error {
        background: linear-gradient(135deg, #dc3545, #e83e8c);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulseValid {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        pointer-events: none;
        animation: confettiFall 4s linear forwards;
        z-index: 999;
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    #game-stats {
        text-align: center;
        margin: 1rem 0;
        font-size: 1.1rem;
        color: var(--purple);
        font-weight: bold;
        transition: color 0.3s ease;
    }
    
    .btn-outline-light {
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: var(--white);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    
    .btn-outline-light:hover {
        background: var(--purple);
        border-color: var(--purple);
        color: var(--white);
        transform: translateY(-2px);
    }
`;

// Injetar estilos no head
const styleSheet = document.createElement("style");
styleSheet.textContent = gameStyles;
document.head.appendChild(styleSheet);

// Notas:
// Basicamente HTML/CSS + JS, um navegador Chrome;
// É isolado e não deve conseguir ler arquivos do computador ou rodar comandos do sistema;
// Gerencia a interface e as ações dos botões;

// Variaveis de elementos do html
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modeStopwatchBtn = document.getElementById("mode-stopwatch");
const modeTimerBtn = document.getElementById("mode-timer");
const minutesDisplay = document.getElementById("minutes-display");
const minutesInput = document.getElementById("minutes-input");
const secondsDisplay = document.getElementById("seconds-display");
const secondsInput = document.getElementById("seconds-input");

let currentMode = "stopwatch"; // Modo atual do relógio
let timerDuration = 30 * 60; // Tempo inicial do timer
let timerSeconds = 0; // Contagem atual de segundos
let timerId = null; // Id do timer (Interval)

// Ativa a troca de modos ao clicar nas abas
modeStopwatchBtn.addEventListener("click", () => {
  switchMode("stopwatch");
}); // Se clicar no 'stopwatch', muda para o cronômetro

modeTimerBtn.addEventListener("click", () => {
  switchMode("timer");
}); // Se clicar no 'timer', muda para a contagem regressiva

// Verifica o clique no start-btn
startBtn.addEventListener("click", () => {
  if (timerId) {
    // Se o timer/cronômetro já tiver iniciado (o relógio tava rodando e vai parar)
    startBtn.innerText = "Resume"; // Atualiza o texto do botao start/pause
    updateClockDisplay(timerSeconds); // Pausa o relógio no horário atual
    // Limpa o Interval e apaga o id
    clearInterval(timerId);
    timerId = null;
  } else {
    // Se o timer/cronometro estava parado já (e vai começar a rodar)
    startBtn.innerText = "Pause"; // Atualiza o texto do botao start/pause
    timerId = setInterval(() => {
      // Começa o interval
      // Verifica se tem que aumentar (cronometro) ou diminuir (timer)
      if (currentMode === "stopwatch") {
        timerSeconds++;
      } else if (currentMode === "timer") {
        if (timerSeconds > 0) {
          timerSeconds--;
        } else if (timerSeconds === 0) {
          // Se for timer e chegar a 0, é sinal que terminou! :D
          // Apara o interval e reseta o id do timer
          clearInterval(timerId);
          timerId = null;

          // Envia a notificaçao
          if (window.prodjs && window.prodjs.notifConclusion) {
            window.prodjs.notifConclusion(
              "Foco concluído!",
              "Parabéns! Hora de descansar."
            );
          }

          // Altera o texto do botao start/pause
          startBtn.innerText = "Start";

          // Reseta o tempo do cronômetro
          timerSeconds = timerDuration;
        } else {
          // Se nao for nenhum desses, houve algum erro.
          console.error("Tempo inválido:", timerSeconds);
        }
      }
      // Atualiza o tempo do relógio
      updateClockDisplay(timerSeconds);
    }, 1000);
  }
});

// Verifica o clique no reset-btn
resetBtn.addEventListener("click", () => {
  // Limpa o interval e reseta o id
  clearInterval(timerId);
  timerId = null;

  // Verifica o modo para identificar qual sera o tempo zerado
  if (currentMode === "stopwatch") {
    timerSeconds = 0;
  } else if (currentMode === "timer") {
    timerSeconds = timerDuration;
  } else {
    // Se nao for nenhum desses modos, é um erro.
    console.error("Erro ao resetar relógio do timer. Modo desconhecido:", modo);
  }

  // Ajusta os textos do start-btn e relógio
  startBtn.innerText = "Start";
  updateClockDisplay(timerSeconds);
});

// Transforma os segundos em MM:SS
function formatSecondsToClock(seconds) {
  const clockMins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const clockSecs = String(seconds % 60).padStart(2, "0");

  return clockMins + ":" + clockSecs;
}

function getClockMinutes(seconds) {
  return String(Math.floor(seconds / 60)).padStart(2, "0");
}

function getClockSeconds(seconds) {
  return String(seconds % 60).padStart(2, "0");
}

// Atualiza a exibiçao dos min e segundos no front
function updateClockDisplay(seconds) {
  const clockMins = getClockMinutes(seconds);
  const clockSecs = getClockSeconds(seconds);

  minutesDisplay.innerText = clockMins;
  secondsDisplay.innerText = clockSecs;
}

// Troca os modos (entre 'stopwatch' e 'timer')
function switchMode(mode) {
  // Parar tudo e limpar o relógio
  clearInterval(timerId);
  timerId = null;
  startBtn.innerText = "Start";
  currentMode = mode;

  // Define o tempo baseado no modo
  if (mode === "stopwatch") {
    timerSeconds = 0;
  } else if (mode === "timer") {
    timerSeconds = timerDuration;
  } else {
    console.error("Modo desconhecido:", mode);
  }

  // Atualiza o relógio da tela
  updateClockDisplay(timerSeconds);

  // Atualiza o visual das abas
  const activeClasses = ["bg-white", "text-gray-800", "shadow-sm"];
  const inactiveClasses = ["text-gray-500", "hover:text-gray-700"];

  if (mode === "stopwatch") {
    modeStopwatchBtn.classList.add(...activeClasses);
    modeStopwatchBtn.classList.remove(...inactiveClasses);

    modeTimerBtn.classList.remove(...activeClasses);
    modeTimerBtn.classList.add(...inactiveClasses);
  } else if (mode === "timer") {
    modeTimerBtn.classList.add(...activeClasses);
    modeTimerBtn.classList.remove(...inactiveClasses);

    modeStopwatchBtn.classList.remove(...activeClasses);
    modeStopwatchBtn.classList.add(...inactiveClasses);
  } else {
    console.error("Modo desconhecido:", mode);
  }
}

function editTimer() {
  // Só poderemos editar esse imput se for no modo timer e tiver parado o relogio
  // (sem estar no meio da contagem)
  if (
    !timerId &&
    currentMode === "timer" &&
    (timerSeconds === 0 || timerSeconds === timerDuration)
  ) {
    minutesInput.classList.remove("hidden");
    secondsInput.classList.remove("hidden");

    minutesInput.value = getClockMinutes(timerSeconds);
    secondsInput.value = getClockSeconds(timerSeconds);

    minutesInput.focus();
    secondsInput.focus();
  }
}

minutesDisplay.addEventListener("click", () => {
  editTimer();
});

secondsDisplay.addEventListener("click", () => {
  editTimer();
});

function saveTime() {
  const newMinutes = parseInt(minutesInput.value);
  const newSeconds = parseInt(secondsInput.value);

  if (
    !isNaN(newMinutes) &&
    !isNaN(newSeconds) &&
    newMinutes > 0 &&
    newMinutes < 240 &&
    newSeconds >= 0 &&
    newSeconds < 60
  ) {
    timerDuration = newMinutes * 60 + newSeconds;
    timerSeconds = timerDuration;
    updateClockDisplay(timerSeconds);
  }

  minutesInput.classList.add("hidden");
  secondsInput.classList.add("hidden");
}

minutesInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveTime();
});

secondsInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveTime();
});

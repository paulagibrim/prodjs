// Notas:
// Basicamente HTML/CSS + JS, um navegador Chrome;
// É isolado e não deve conseguir ler arquivos do computador ou rodar comandos do sistema;
// Gerencia a interface e as ações dos botões;

// Variaveis gerais
const startBtn = document.getElementById("start-btn");
const clockTimer = document.getElementById("clock-timer");
const resetBtn = document.getElementById("reset-btn");
const modeStopwatchBtn = document.getElementById("mode-stopwatch");
const modeTimerBtn = document.getElementById("mode-timer");

let currentMode = "stopwatch";

// Variáveis de pomodoro
const TIMER_DURATION = 30 * 60;

// Variáveis de cronômetro
let timerSeconds = 0;
let timerId = null;

// Ativa a troca de modos ao clicar nas abas
modeStopwatchBtn.addEventListener("click", () => {
  switchMode("stopwatch");
});

modeTimerBtn.addEventListener("click", () => {
  switchMode("timer");
});

// Verifica o clique no start-btn
startBtn.addEventListener("click", () => {
  if (timerId) {
    startBtn.innerText = "Resume";
    clockTimer.innerText = formatSecondsToClock(timerSeconds);
    clearInterval(timerId);
    timerId = null;
  } else {
    startBtn.innerText = "Pause";
    timerId = setInterval(() => {
      if (currentMode === "stopwatch") {
        timerSeconds++;
      } else if (currentMode === "timer") {
        if (timerSeconds > 0) {
          timerSeconds--;
        } else if (timerSeconds === 0) {
          clearInterval(timerId);
          timerId = null;

          if (window.prodjs && window.prodjs.notifConclusion) {
            window.prodjs.notifConclusion(
              "Foco concluído!",
              "Parabéns! Hora de descansar."
            );
          }

          startBtn.innerText = "Start";

          timerSeconds = TIMER_DURATION;
          clockTimer.innerText = formatSecondsToClock(timerSeconds);
        } else {
          console.error("Tempo inválido:", timerSeconds);
        }
      }
      clockTimer.innerText = formatSecondsToClock(timerSeconds);
    }, 1000);
  }
});

// Verifica o clique no reset-btn
resetBtn.addEventListener("click", () => {
  // Limpa o interval
  clearInterval(timerId);

  // Ajusta as variáveis
  timerSeconds = 0;
  timerId = null;

  // Ajusta os textos
  startBtn.innerText = "Start";
  clockTimer.innerText = formatSecondsToClock(timerSeconds);
});

// Transforma os segundos em MM:SS
function formatSecondsToClock(seconds) {
  const clockMins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const clockSecs = String(seconds % 60).padStart(2, "0");

  return clockMins + ":" + clockSecs;
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
    timerSeconds = TIMER_DURATION;
  } else {
    console.error("Modo desconhecido:", mode);
  }

  // Atualiza o relógio da tela
  clockTimer.innerText = formatSecondsToClock(timerSeconds);

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

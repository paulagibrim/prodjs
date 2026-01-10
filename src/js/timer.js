// Notas:
// Basicamente HTML/CSS + JS, um navegador Chrome;
// É isolado e não deve conseguir ler arquivos do computador ou rodar comandos do sistema;
// Gerencia a interface e as ações dos botões;

// Variaveis de elementos do html

const Timer = {
  currentMode: "stopwatch", // Modo atual do relógio
  duration: 30 * 60, // Tempo default do timer
  totalSeconds: 0, // Contagem atual de segundos
  id: null, // Id do timer (Interval)
  isEditing: false, // Booleano para identificar se está editando ou nao

  tick: function () {
    if (this.currentMode === "stopwatch") {
      this.totalSeconds++;
    } else if (this.currentMode === "timer") {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
      } else {
        console.error("Contagem de segundos inválida:", this.totalSeconds);
      }
    } else {
      console.error("Modo desconhecido:", this.currentMode);
    }
  },

  stop: function () {
    clearInterval(this.id);
    this.id = null;
  },

  reset: function () {
    if (this.currentMode === "stopwatch") {
      this.totalSeconds = 0;
    } else if (this.currentMode === "timer") {
      this.totalSeconds = this.duration;
    } else {
      console.error("Modo desconhecido:", this.currentMode);
    }
  },

  start: function () {
    this.id = setInterval(() => {
      // Começa o interval
      // Verifica se tem que aumentar (cronometro) ou diminuir (timer)
      this.tick();
      if (this.totalSeconds === 0 && this.currentMode === "timer") {
        // Se for timer e chegar a 0, é sinal que terminou! :D
        // Apara o interval e reseta o id do timer
        this.stop();

        // Envia a notificaçao
        View.pushNotif("Foco concluído!", "Que tal fazer uma pausa?");

        // Altera o texto do botao start/pause
        View.startBtn.innerText = "Iniciar";

        // Reseta o tempo do cronômetro
        this.totalSeconds = this.duration;
      }

      // Atualiza o tempo do relógio
      View.updateClockDisplay(this.totalSeconds);
    }, 1000);
  },
};

const View = {
  startBtn: document.getElementById("start-btn"),
  resetBtn: document.getElementById("reset-btn"),
  modeStopwatchBtn: document.getElementById("mode-stopwatch"),
  modeTimerBtn: document.getElementById("mode-timer"),
  minutesDisplay: document.getElementById("minutes-display"),
  minutesInput: document.getElementById("minutes-input"),
  secondsDisplay: document.getElementById("seconds-display"),
  secondsInput: document.getElementById("seconds-input"),

  updateClockDisplay: function (seconds) {
    this.minutesDisplay.innerText = getClockMinutes(seconds);
    this.secondsDisplay.innerText = getClockSeconds(seconds);
  },

  toggleMode: function (mode) {
    const activeClasses = ["bg-white", "text-gray-800", "shadow-sm"];
    const inactiveClasses = ["text-gray-500", "hover:text-gray-700"];

    if (mode === "stopwatch") {
      this.modeStopwatchBtn.classList.add(...activeClasses);
      this.modeStopwatchBtn.classList.remove(...inactiveClasses);

      this.modeTimerBtn.classList.remove(...activeClasses);
      this.modeTimerBtn.classList.add(...inactiveClasses);
    } else if (mode === "timer") {
      this.modeTimerBtn.classList.add(...activeClasses);
      this.modeTimerBtn.classList.remove(...inactiveClasses);

      this.modeStopwatchBtn.classList.remove(...activeClasses);
      this.modeStopwatchBtn.classList.add(...inactiveClasses);
    } else {
      console.error("Modo desconhecido:", mode);
    }
  },

  pushNotif: function (title, text) {
    if (window.parent.prodjs && window.parent.prodjs.notifConclusion) {
      window.parent.prodjs.notifConclusion(title, text);
    }
  },
};

// Troca os modos (entre 'stopwatch' e 'timer')
function switchMode(mode) {
  Timer.stop();
  Timer.currentMode = mode;
  Timer.reset();

  View.startBtn.innerText = "Iniciar";
  View.updateClockDisplay(Timer.totalSeconds);
  View.toggleMode(Timer.currentMode);
}

// Verifica o clique no start-btn
View.startBtn.addEventListener("click", () => {
  if (Timer.id) {
    Timer.stop();

    View.startBtn.innerText = "Retomar"; // Atualiza o texto do botao start/pause
    View.updateClockDisplay(Timer.totalSeconds); // Pausa o relógio no horário atual
  } else if (!Timer.isEditing) {
    Timer.start();
    View.startBtn.innerText = "Pausar"; // Atualiza o texto do botao start/pause
  } else {
    console.error("Esse botão não funciona no modo de edição.");
  }
});

// Açoes do modo de ediçao do timer
function editTimer(selectedInput) {
  // Só poderemos editar esse input se for no modo timer e tiver parado o relogio
  // (sem estar no meio da contagem)
  if (
    !Timer.id &&
    Timer.currentMode === "timer" &&
    (Timer.totalSeconds === 0 || Timer.totalSeconds === Timer.duration)
  ) {
    // Exibe os inputs
    View.minutesInput.classList.remove("hidden");
    View.secondsInput.classList.remove("hidden");

    // Deixa de valor padrão no input o valor previamente definido
    View.minutesInput.value = getClockMinutes(Timer.totalSeconds);
    View.secondsInput.value = getClockSeconds(Timer.totalSeconds);

    // Deixa o foco (cursor) no input selecionado
    selectedInput.focus();
  }
}

// Ativa o modo ediçao se clicar no relógio
View.minutesDisplay.addEventListener("click", () => {
  if (Timer.currentMode === "timer") {
    Timer.isEditing = true;
    editTimer(View.minutesInput);
  }
}); // Nos minutos

View.secondsDisplay.addEventListener("click", () => {
  if (Timer.currentMode === "timer") {
    Timer.isEditing = true;
    editTimer(View.secondsInput);
  }
}); // Nos segundos

// Salva o tempo digitado
function saveTime() {
  // Recebe os valores digitados como inteiros
  const newMinutes = parseInt(View.minutesInput.value);
  const newSeconds = parseInt(View.secondsInput.value);

  // Se for válido e estiver no intervalo aceito, atualiza os valores
  if (
    !isNaN(newMinutes) &&
    !isNaN(newSeconds) &&
    newMinutes >= 0 &&
    newMinutes < 240 &&
    newSeconds >= 0 &&
    newSeconds < 60
  ) {
    Timer.duration = newMinutes * 60 + newSeconds;
    Timer.totalSeconds = Timer.duration;
    View.updateClockDisplay(Timer.totalSeconds);
  } else {
    console.error("Valor inválido:", newMinutes, ":", newSeconds);
  }

  // Esconde os inputs
  View.minutesInput.classList.add("hidden");
  View.secondsInput.classList.add("hidden");
}

// Recebe o enter e salva o novo tempo
View.minutesInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveTime();
    Timer.isEditing = false;
  }
}); // No input de minutos

View.secondsInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveTime();
    Timer.isEditing = false;
  }
}); // No input de segundos

// Ativa a troca de modos ao clicar nas abas
View.modeStopwatchBtn.addEventListener("click", () => {
  if (!Timer.isEditing) {
    Timer.currentMode = "stopwatch";
    Timer.reset();
    View.toggleMode("stopwatch");
    View.updateClockDisplay(Timer.totalSeconds);
  }
}); // Se clicar no 'stopwatch', muda para o cronômetro

View.modeTimerBtn.addEventListener("click", () => {
  if (!Timer.isEditing) {
    Timer.currentMode = "timer";
    Timer.reset();
    View.toggleMode("timer");
    View.updateClockDisplay(Timer.totalSeconds);
  }
}); // Se clicar no 'timer', muda para a contagem regressiva

// Verifica o clique no reset-btn
View.resetBtn.addEventListener("click", () => {
  // Limpa o interval e reseta o id
  Timer.stop();
  Timer.reset();

  // Verifica o modo para identificar qual sera o tempo zerado
  if (Timer.currentMode === "stopwatch") {
    Timer.totalSeconds = 0;
  } else if (Timer.currentMode === "timer") {
    Timer.totalSeconds = Timer.duration;
  } else {
    // Se nao for nenhum desses modos, é um erro.
    console.error("Erro ao resetar relógio do timer. Modo desconhecido:", modo);
  }

  // Ajusta os textos do start-btn e relógio
  View.startBtn.innerText = "Iniciar";
  View.updateClockDisplay(Timer.totalSeconds);
});

// Retorna a string do valor de minutos a partir dos segundos totais
function getClockMinutes(seconds) {
  return String(Math.floor(seconds / 60)).padStart(2, "0");
}

// Retorna a string do valor de segundos restantes a partir dos segundos totais
function getClockSeconds(seconds) {
  return String(seconds % 60).padStart(2, "0");
}

// Transforma os segundos em MM:SS
function formatSecondsToClock(seconds) {
  return getClockMinutes(seconds) + ":" + getClockSeconds(seconds);
}

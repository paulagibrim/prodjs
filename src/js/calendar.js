let currentDate = new Date();
let currentMonth = getMonth(currentDate);
let currentYear = getYear(currentDate);

const nextMonthBtn = document.getElementById("next-month");
const lastMonthBtn = document.getElementById("last-month");

function getMonth(date) {
  return date.getMonth();
}

function getYear(date) {
  return date.getFullYear();
}

function getWeekDay(date) {
  return date.getDay();
}

function getNextMonth() {
  if (currentMonth >= 0 && currentMonth < 11) return currentMonth + 1;
  else if (currentMonth == 11) return 0;
  else console.error("Mês desconhecido:", currentMonth);
}

function getLastMonth() {
  if (currentMonth > 0 && currentMonth <= 11) return currentMonth - 1;
  else if (currentMonth == 0) return 11;
  else console.error("Mês desconhecido:", currentMonth);
}

function getNextYear() {
  return currentYear + 1;
}

function getLastYear() {
  return currentYear - 1;
}

lastMonthBtn.addEventListener("click", () => {
  let newMonth = getLastMonth();
  if (currentMonth === 0) {
    currentYear -= 1;
  }
  currentMonth = newMonth;

  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  let newMonth = getNextMonth();
  if (currentMonth === 11) {
    currentYear += 1;
  }
  currentMonth = newMonth;

  renderCalendar();
});

function renderCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("current-month");

  // Atualiza o título (mes ANO)
  monthTitle.innerText = new Date(currentYear, currentMonth).toLocaleDateString(
    "default",
    { month: "long", year: "numeric" }
  );

  // Limpa o grid anterior
  calendarGrid.innerHTML = "";

  // Recalcula os dados do mês atual
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDay = firstDayOfMonth.getDay(); // Dia da semana que começa (0-6)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Total de dias

  // Cria divs vazias até chegar no dia da semana que o mês começa
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    calendarGrid.appendChild(emptyDay);
  }
  // 5. Loop dos Dias do Mês
  for (let day = 1; day <= daysInMonth; day++) {
    const dayButton = document.createElement("button");
    dayButton.innerText = day;

    dayButton.addEventListener("click", () => {
      // 1. Procura se já tem alguém selecionado pela classe 'selected-day'
      const selecionadoAnterior = document.querySelector(".selected-day");

      // Se achou, remove a borda azul e a etiqueta
      if (selecionadoAnterior) {
        selecionadoAnterior.classList.remove(
          "ring-2",
          "ring-blue-600",
          "selected-day"
        );
      }

      // 2. Adiciona a borda azul e a etiqueta no botão clicado agora
      dayButton.classList.add("ring-2", "ring-blue-600", "selected-day");
    });

    // Adiciona as classes do Tailwind (mesmo visual do HTML estático)
    dayButton.className =
      "h-10 w-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-blue-100 hover:text-[#007AFF] transition-all text-sm";

    // Verifica se é o dia de "Hoje" para destacar
    const today = new Date();
    if (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      dayButton.classList.add(
        "bg-[#007AFF]",
        "text-white",
        "shadow-md",
        "shadow-blue-500/30",
        "font-bold"
      );
      // Remove as classes de hover padrão para não conflitar
      dayButton.classList.remove("text-gray-700", "hover:bg-blue-100");
    }

    calendarGrid.appendChild(dayButton);
  }
}

renderCalendar();

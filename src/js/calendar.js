// Importar as funçoes de tasks
// import { openSideBar, closeSideBar } from "./tasks.js";

let currentDate = new Date();
let currentMonth = getMonth(currentDate);
let currentYear = getYear(currentDate);

let isSideBarOpen = false;
let selectedDay = currentDate.getDay();

const nextMonthBtn = document.getElementById("next-month");
const lastMonthBtn = document.getElementById("last-month");
const closeSideBarBtn = document.getElementById("close-sidebar");
const taskSideBar = document.getElementById("task-sidebar");

function openSideBar() {
  taskSideBar.classList.remove("translate-x-full");
}

function closeSideBar() {
  taskSideBar.classList.add("translate-x-full");
}
closeSideBarBtn.addEventListener("click", () => {
  closeSideBar();
  isSideBarOpen = false;
});

// Funçoes para obter informaçoes da data
function getMonth(date) {
  return date.getMonth();
} // Pegar o mês

function getYear(date) {
  return date.getFullYear();
} // Pegar o ano

function getWeekDay(date) {
  return date.getDay();
} // Pegar o dia da semana (0-6)

function getNextMonth() {
  if (currentMonth >= 0 && currentMonth < 11) return currentMonth + 1;
  else if (currentMonth == 11) return 0;
  else console.error("Mês desconhecido:", currentMonth);
} // Descobrir qual o próximo mês

function getLastMonth() {
  if (currentMonth > 0 && currentMonth <= 11) return currentMonth - 1;
  else if (currentMonth == 0) return 11;
  else console.error("Mês desconhecido:", currentMonth);
} // Descobrir o mês anterior

function getNextYear() {
  return currentYear + 1;
} // Descobrir o próximo ano

function getLastYear() {
  return currentYear - 1;
} // Descobrir o ano anterior

// Verifica clique de navegacao entre meses
lastMonthBtn.addEventListener("click", () => {
  let newMonth = getLastMonth();
  if (currentMonth === 0) {
    currentYear -= 1;
  }
  currentMonth = newMonth;

  renderCalendar();
}); // Mes anterior

nextMonthBtn.addEventListener("click", () => {
  let newMonth = getNextMonth();
  if (currentMonth === 11) {
    currentYear += 1;
  }
  currentMonth = newMonth;

  renderCalendar();
}); // Mês seguinte

// Funçao para desenhar o calendário
function renderCalendar() {
  // Pega os elementos de grid e título do calendário
  const calendarGrid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("current-month");

  // Atualiza o título ('mes' de 'ano')
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

  // Variáveis para garantir sempre o mesmo tamanho do calendário
  const totalSlots = 6 * 7; // 6 semanas (max) x 7 dias
  const usedSlots = startingDay + daysInMonth;
  const remainingSlots = totalSlots - usedSlots; // Quantidade de vazios no final

  // Cria divs vazias até chegar no dia da semana que o mês começa
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    calendarGrid.appendChild(emptyDay);
  }

  // Loop incluindo os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const dayButton = document.createElement("button");
    dayButton.innerText = day;

    dayButton.addEventListener("click", () => {
      // Procura se já tem alguém selecionado pela classe 'selected-day'
      const selecionadoAnterior = document.querySelector(".selected-day");

      // Se achou, remove a borda azul e a etiqueta
      if (selecionadoAnterior) {
        selecionadoAnterior.classList.remove(
          "ring-2",
          "ring-blue-600",
          "selected-day"
        );
      }

      // Adiciona a borda azul e a etiqueta no botão clicado agora
      dayButton.classList.add("ring-2", "ring-blue-600", "selected-day");

      // Abre ou fecha a sidebar
      if (!isSideBarOpen) {
        // Se tiver fechada, abre para o dia que vc clicar
        openSideBar();
        selectedDay = day;
        isSideBarOpen = true;
      } else if (isSideBarOpen && selectedDay !== day) {
        // Se tiver aberta em outro dia, mantém aberta e atualiza o dia
        selectedDay = day;
      } else if (isSideBarOpen && selectedDay === day) {
        // Se tiver aberta no mesmo dia, fecha
        closeSideBar();
        isSideBarOpen = false;
      } else {
        // Verificaçao de segurança
        console.error(
          "Nao era pra chegar aqui... ",
          "day=",
          day,
          " | selectedDay=",
          selectedDay,
          " | isSideBarOpen=",
          isSideBarOpen
        );
      }
    });

    // Adiciona as classes do Tailwind
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

  // Cria divs vazias até chegar no total de dias do calendário.
  for (let i = 0; i < remainingSlots; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "h-10 w-10";
    calendarGrid.appendChild(emptyDay);
  }
}

// Chama a funçao e desenha o calendário
renderCalendar();

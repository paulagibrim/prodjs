const navTimer = document.getElementById("nav-timer");
const navCalendar = document.getElementById("nav-calendar");
const appFrame = document.getElementById("app-frame");

// Função para atualizar o visual dos botões
function updateActiveButton(activeBtn, inactiveBtn) {
  // Estilo Ativo
  activeBtn.classList.remove(
    "text-gray-500",
    "hover:text-gray-900",
    "hover:bg-gray-100"
  );
  activeBtn.classList.add("text-[#007AFF]", "bg-blue-50");

  // Estilo Inativo
  inactiveBtn.classList.remove("text-[#007AFF]", "bg-blue-50");
  inactiveBtn.classList.add(
    "text-gray-500",
    "hover:text-gray-900",
    "hover:bg-gray-100"
  );
}

navCalendar.addEventListener("click", () => {
  // Atualiza a exibiçao principal
  appFrame.src = "calendar.html";

  // Atualiza as cores dos botoes
  updateActiveButton(navCalendar, navTimer);
});

navTimer.addEventListener("click", () => {
  // Atualiza a exibiçao principal
  appFrame.src = "timer.html";

  // Atualiza as cores dos botoes
  updateActiveButton(navTimer, navCalendar);
});

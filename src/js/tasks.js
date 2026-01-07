// export { openSideBar, closeSideBar };

const taskInput = document.getElementById("task-input");
const taskAddBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

taskAddBtn.addEventListener("click", () => {
  // Se o conteúdo nao for vazio, add a task na lista
  if (taskInput.value !== "") {
    taskList.innerHTML += `<li class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer">
    <div class="h-5 w-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors"></div>
    <span class="text-gray-600 flex-1">${taskInput.value}</span>
    <button class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
        🗑️
    </button>
</li>`;
    taskInput.value = "";
  }
});

taskList.addEventListener("click", (event) => {
  if (event.target.innerText === "🗑️") {
    event.target.closest("li").remove();
  } else if (event.target.classList.contains("rounded-full")) {
    // 1. Risca o texto (o vizinho)
    event.target.nextElementSibling.classList.toggle("line-through");

    // 2. Muda a cor da bolinha (o próprio alvo) para azul
    event.target.classList.toggle("bg-blue-500");

    // Opcional: mudar a borda também para ficar bonito
    event.target.classList.toggle("border-blue-500");
  }
});

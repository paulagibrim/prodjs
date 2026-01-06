const taskSideBar = document.getElementById("task-sidebar");

function openSideBar() {
  taskSideBar.classList.remove("translate-x-full");
}

function closeSideBar() {
  taskSideBar.classList.add("translate-x-full");
}

export { openSideBar, closeSideBar };

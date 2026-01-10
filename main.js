// Notas:
// Tem acesso total ao sistema (arquivos, notificações nativas, minimizar/fechar janelas);
// Lugar com informações sensíveis;
// Cria as janelas e gerencia o "ciclo de vida" do sistema;

const { app, BrowserWindow, ipcMain, Notification } = require("electron");
// ipcMain recebe as mensagens do ipcRenderer (que foi chamado no preload.js)

const path = require("path");

// Função de criação de janela
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: "src/preload.js",
    },
  });

  // Carrega o html
  win.loadFile("src/html/index.html");
}

// Aqui exibimos as notificacoes
ipcMain.on("notification-timer", (event, title, body) => {
  const notif = new Notification({ title: title, body: body });
  notif.show();
});

app.whenReady().then(() => {
  createWindow();
});

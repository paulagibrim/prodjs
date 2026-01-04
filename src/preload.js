// Notas:
// É a ponte segura: conecta o html+css+js ao main.js;
// Tem acesso a algumas coisas no Node.js e pode injetar funções específicas na janela global do navegador;
// `Inter-Process Communication` (IPC) é a linguagem que eles usam para se comunicar -- o renderizador (html+css+js) envia uma mensagem IPC e o principal (main.js) escuta;
// No preload.js, diremos algo como: "A interface só tem permissão para usar estas 3 funções: enviarNotificacao, salvarTarefa, lerConfiguracoes".

const { contextBridge, ipcRenderer } = require("electron");
// O contextBridge é a ponte que conecta tudo
// ipcRenderer é o o mensageiro que envia os eventos do preload para o main

contextBridge.exposeInMainWorld("prodjs", {
  // Aqui definimos as funções que o index.html poderá chamar
  notifConclusion: (title, body) =>
    ipcRenderer.send("notification-timer", title, body),
});

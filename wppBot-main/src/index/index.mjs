import qrcode from "qrcode-terminal";
import { messagesGetter } from './../../src/Helpers/GetMessage.mjs';

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

const sessionName = ''; // nome da sessão desejado
const sessionDir = './sessions'; 
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: sessionName,
    dataPath: sessionDir // passando o caminho completo para a opção folderName
  }),
  puppeteer: {
    ffmpeg: "./ffmpeg.exe",
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: [
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-component-extensions-with-background-pages',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-features=TranslateUI,BlinkGenPropertyTrees',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-sync',
      '--force-color-profile=srgb',
      '--hide-scrollbars',
      '--ignore-certificate-errors',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      '--start-maximized',
      '--use-gl=swiftshader',
      '--disable-gpu',
      '--disable-software-rasterizer', // Desabilita o uso do software rasterizador
      '--enable-features=NetworkService,NetworkServiceInProcess', // Ativa o serviço de rede e o serviço de rede no processo
      '--disable-background-fetch-throttling', // Desabilita a limitação de fetches em segundo plano
      '--disable-client-side-phishing-detection', // Desabilita a detecção de phishing do lado do cliente
      '--disable-default-apps', // Desabilita os aplicativos padrão
      '--disable-gpu-sandbox', // Desabilita o ambiente sandbox da GPU
      '--disable-infobars', // Remove a barra de informações do Chromium
      '--disable-low-res-tiling', // Desabilita a renderização em baixa resolução
      '--disable-offer-store-unmasked-wallet-cards', // Desabilita a oferta de armazenar cartões de carteira desmascarados
      '--disable-site-isolation-trials', // Desabilita o isolamento do site
      '--disable-web-security', // Desabilita a segurança da web
      '--enable-automation', // Ativa a automação do Chromium
      '--ignore-gpu-blocklist', // Ignora a lista de bloqueio da GPU
      '--no-startup-window', // Não abre uma janela de inicialização
      '--enable-blink-features=IdleDetection', // Ativa a detecção de inatividade do Blink
      "--disable-canvas-aa",
      "--disable-2d-canvas-clip-aa",
      "--use-gl=swiftshader",
      "--enable-webgl",
      "--hide-scrollbars",
      "--mute-audio",
      "--disable-infobars",
      "--disable-breakpad",
      "--window-size=1280,720",
      "--disable-gl-drawing-for-tests",
      "--aggressive-cache-discard",
      "--aggressive-tab-discard",
      "--disable-accelerated-2d-canvas",
      "--disable-application-cache",
      "--disable-cache",
      "--disable-gpu",
      "--disable-offline-load-stale-cache",
      "--disk-cache-size=0",
      "--ignore-certificate-errors",
      "--no-zygote",
      "--no-first-run",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--disable-site-isolation-trials",
      "--renderer-process-limit=2",
      "--enable-low-end-device-mode"
  ]
  },
});

client.initialize();

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("Authentication complete");
});

client.on("ready", () => {
  console.log("Ready to accept messages");
});

client.on("message_create", async message => {
  const { chat, from, broadcast } = message || {};
  const isBroadcast = broadcast || false;
  var sender = from;

  if (from !== "status@broadcast" && !isBroadcast) {
    const chat = await message.getChat();
    if (chat.isGroup) {
      sender = message.id.participant;
    }
    await messagesGetter(sender, message, message.type);  
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

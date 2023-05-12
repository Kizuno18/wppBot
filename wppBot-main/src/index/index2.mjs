import qrcode from "qrcode-terminal";
import { messagesGetter } from './../../src/Helpers/GetMessage.mjs';

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
const sessionName = '2'; // nome da sessão desejado
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
    qrTimeout: 0,
    authTimeout: 0,
    skipUpdateCheck: true,
    multiDevice: true,
    cachedPatch: true,
    cacheEnabled: false,
    useChrome: true,
    stickerServerEndpoint: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: true,
    args: []
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

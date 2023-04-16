import qrcode from "qrcode-terminal";
import { messagesGetter } from './src/Helpers/GetMessage.mjs';

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { chromium } from 'playwright-chromium';
import ffmpeg from 'fluent-ffmpeg';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: chromium.executablePath?.(),
    headless: true
  },
  ffmpegPath: ffmpeg
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
  const sender = from;

  if (from !== "status@broadcast" && !isBroadcast) {
    messagesGetter(sender, message, message.type);  
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

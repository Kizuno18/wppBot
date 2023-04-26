import { getWalletBalance } from '../Modules/getWalletBalance/index.mjs';
import Offend from '../Modules/Offend/index.mjs';
import OpenIA from '../Modules/OpenIA/index.mjs';
import MidJourneiIA from "../Modules/MidJourneyIA/index.mjs";
import { exec } from 'child_process';

// IMPORTING MODULES
import db from '../../lib/database.js';
import bot from '../../lib/bot.js';
const { botInfo, botVerificarExpiracaoLimite } = bot;
import util from '../../lib/util.js';
const { criarTexto } = util;
import msgs_texto from '../../lib/msgs.js';
import { StickerCreate } from '../Modules/StickerBot/StickerBot.mjs';

const offendKeywords = [
  '!offend', '!ofenda', '!ofende', '!offenda', '!offende', '!ofender', '!offender',
  'offend', 'ofenda', 'ofende', 'offenda', 'offende', 'ofender', 'offender', '!xingar'
];

const cmdMsg = `
  !menu
  to see the entire menu.

  Extra commands:

  # <message>
  to talk with Chat GPT.

  !sticker <attach video or img>
  to create a sticker.

  !offend <mention contact>
  to offend someone else.

  !imagine <keyword>
  to generate an IA creative image.
`;

const msgSticker = `
  Você pode criar stickers automaticamente,
  enviando uma imagem, video ou gif no meu privado.

  Para stickers personalizados👇
  Digite: *!menu 1*
  _para saber os comandos de sticker._
`;

const registerMsg = (pushname, msg) => console.log(`${pushname} asked:\n${msg}\n`);
const infoMsg = async (message, msg) => message.reply(msg);

const checkLimit = async (sender, message, pushname) => {
  const ultrapassou = await db.ultrapassouLimite(sender);
  if (ultrapassou) {
    await infoMsg(message, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, pushname));
    return true;
  }
  return false;
};

const restart = async (message, body) => {
  const serviceName = body.replace('!restart', '');
  await infoMsg(message, `Restarting: ${serviceName}`);
  exec(`pm2 restart ${serviceName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error while executing the command: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};

const handleChatMessage = async (sender, message, pushname) => {
  if (await checkLimit(sender, message, pushname)) {
    return;
  }
  await OpenIA(message);
  await db.addContagemDiaria(sender);
};

const handleCommandMessage = async (sender, message, pushname, body, type) => {
  switch (true) {
  case body.toLowerCase().startsWith('#') && type === 'chat':
    if (await checkLimit(sender, message, pushname)) {
      return
    }
  await handleChatMessage(sender, message, pushname);
  break;

  case body.toLowerCase().startsWith('!restart') && type === 'chat' && pushname === 'aBigLeo':
    await restart(message, body);
    break;
  
  case body.toLowerCase() === '!sticker':
    if (await checkLimit(sender, message, pushname)) {
      return
    }
    await StickerCreate(message);
    break;
  
  case offendKeywords.some((keyword) => body.toLowerCase().startsWith(keyword)):
    if (await checkLimit(sender, message, pushname)) {
      return
    }
    registerMsg(pushname, body);
    await Offend(message);
    await db.addContagemDiaria(sender);
    break;
  
  case body.toLowerCase().startsWith('!imagine'):
    registerMsg(pushname, body);
    await MidJourneiIA(message);
    break;
  
  case body === '!credits' || body === '!creditos':
    registerMsg(pushname, body);
    await infoMsg(message, 'type !info');
    break;
  
  case body === '!commands' || body === '!comandos':
    registerMsg(pushname, body);
    await infoMsg(message, cmdMsg);
    break;
  }
  await db.addContagemTotal(sender);
  };
  
  export const messagesGetter = async (sender, message, type) => {
  try {
  const { body, caption } = message;
  var { pushname } = await message.getContact() || { pushname: '[Sem Nome]' };
  const chat = await message.getChat();
  
  if (await botInfo().limite_diario.status) {
    await botVerificarExpiracaoLimite();
  }
  
  // SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
  var registrado = await db.verificarRegistro(sender);
  if (!registrado) {
    if (pushname.toLowerCase().indexOf("cmds:") === -1) {
      pushname += " cmds: 0";
      console.log("Usuario Registrado: " + pushname);
    }
    await db.registrarUsuario(sender, pushname);
  }
  
  if (!chat.isGroup && !body.toLowerCase().startsWith('!') && !body.toLowerCase().startsWith('#') && type === 'chat' && !message.fromMe) {
    await handleChatMessage(sender, message, pushname);
  } else {
    await handleCommandMessage(sender, message, pushname, body, type);
  }
} catch (error) {
  if (error.message.includes("Cannot read properties of null") && error.message.includes("max_comandos_dia")) {
  // specific error you want to suppress
  } else {
  console.error(`An error occurred: ${error}`);
  }
  }
  };  
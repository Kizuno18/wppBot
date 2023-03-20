import { getWalletBalance } from '../Modules/getWalletBalance/index.mjs';
import Offend from '../Modules/Offend/index.mjs';
import OpenIA from '../Modules/OpenIA/index.mjs';

import { exec } from 'child_process';
const needRecharge = false;

const offendKeywords = ['!offend', '!ofenda', '!ofende', '!offenda', '!offende'];
const donateKeywords = [
  '!tokens', 'tokens', '!donate', '!saber', '!doar', '!sabermais', '!about',
  '!sobre', '!doação', '!dar', '!ajuda', '!help', 'donate', 'saber', 'doar',
  'sabermais', 'about', 'sobre', 'doação', 'dar', 'ajuda', 'help'
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

export const messagesGetter = async (message, type) => {
  try {
    const { body, caption, from } = message;
    const { pushname } = await message.getContact();

    switch (true) {
      case body.toLowerCase().startsWith('#') && type === 'chat':
        if (needRecharge) {
          const response = await getWalletBalance();
          if (response) await infoMsg(message, response);
        } else {
          registerMsg(pushname, body.replace('#', ''));
          await OpenIA(message);
        }
        break;

      case body.toLowerCase().startsWith('!letra') && type === 'chat':
        registerMsg(pushname, body.replace('!letra', 'pediu a Letra de: '));
        await OpenIA(message);
        break;

      case body.toLowerCase().startsWith('!restart') && type === 'chat' && pushname === 'oBigLeo':
        await restart(message, body);
        break;

      case caption === '!sticker' || body.toLowerCase() === '!sticker':
        await infoMsg(message, msgSticker);
        break;

      case donateKeywords.some((keyword) => body.toLowerCase().startsWith(keyword)):
        registerMsg(pushname, 'perguntou sobre.');
        const responses = await Promise.all([getWalletBalance()]);
        for (const response of responses) {
          if (response) await infoMsg(message, response);
        }
        break;

      case offendKeywords.some((keyword) => body.toLowerCase().startsWith(keyword)):
        const words = body.toLowerCase().split(' ');
        const lastWord = words[words.length - 1];
        console.log(`${pushname} offended ${lastWord}\n`);
        await Offend(message);
        break;

      case body.toLowerCase().startsWith('!imagine'):
        registerMsg(pushname, body);
        await infoMsg(message, '*imagine in maintenance.*\ntry !img <keyword>');
        break;

      case body === '!credits' || body === '!creditos':
        registerMsg(pushname, body);
       await infoMsg(message, 'type !info');
       break;

      case body === '!commands' || body === '!comandos':
        registerMsg(pushname, body);
        await infoMsg(message, cmdMsg);
        break;      
      case body === '!test' || body === '!teste':
        registerMsg(pushname, body);
        //await infoMsg(message, client.getContacts());
        break;
     }
  } catch(error) {console.error(`An error occurred: ${error}`);}

}
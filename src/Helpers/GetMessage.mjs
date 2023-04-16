import { getWalletBalance } from '../Modules/getWalletBalance/index.mjs';
import Offend from '../Modules/Offend/index.mjs';
import OpenIA from '../Modules/OpenIA/index.mjs';
import MidJourneiIA from "../Modules/MidJourneyIA/index.mjs";
import { exec } from 'child_process';


// IMPORTANDO MÓDULOS
import db from '../../lib/database.js';
import bot from '../../lib/bot.js';
const { botInfo, botVerificarExpiracaoLimite } = bot;
import util from '../../lib/util.js';
const { criarTexto } = util;
import msgs_texto from '../../lib/msgs.js';

const needRecharge = false;

const offendKeywords = ['!offend', '!ofenda', '!ofende', '!offenda',
 '!offende','!ofender', '!offender', 'offend', 'ofenda', 'ofende',
  'offenda', 'offende','ofender', 'offender', '!xingar'];

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

export const messagesGetter = async (sender, message, type) => {
  try {
    const { body, caption } = message;
    const { pushname } = await message.getContact() || { pushname: '[Sem Nome]' };

    if(await botInfo().limite_diario.status){
      await botVerificarExpiracaoLimite()
      let ultrapassou = await db.ultrapassouLimite(sender)
      if(ultrapassou) return await infoMsg(message, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite))
      

    switch (true) {
      case body.toLowerCase().startsWith('#') && type === 'chat':
        if (needRecharge) {
          const response = await getWalletBalance();
          if (response) await infoMsg(message, response);
        } else {
          registerMsg(pushname, body.replace('#', ''));
          await OpenIA(message);
          await db.addContagemDiaria(sender);          
          
        }
        break;

      case body.toLowerCase().startsWith('!letra') && type === 'chat':
        registerMsg(pushname, body.replace('!letra', 'pediu a Letra de: '));
        await OpenIA(message);
        await db.addContagemDiaria(sender); 
        
        break;

      case body.toLowerCase().startsWith('!restart') && type === 'chat' && pushname === 'oBigLeo':
        await restart(message, body);      
        
        break;

      case caption === '!sticker' || body.toLowerCase() === '!sticker':
        await infoMsg(message, msgSticker);      
        
        break;

      //case donateKeywords.some((keyword) => body.toLowerCase().startsWith(keyword)):
      //  registerMsg(pushname, 'perguntou sobre.');
      //  const responses = await Promise.all([getWalletBalance()]);
      //  for (const response of responses) {
      //    if (response) {
      //    await infoMsg(message, response);      
      //    
      //    }
      //  }
      //  break;

      case offendKeywords.some((keyword) => body.toLowerCase().startsWith(keyword)):
        const words = body.toLowerCase().split(' ');
        const lastWord = words[words.length - 1];
        console.log(`${pushname} offended ${lastWord}\n`);
        await Offend(message);
        await db.addContagemDiaria(sender);         
        
        break;

      case body.toLowerCase().startsWith('!imagine'):
        registerMsg(pushname, body);
        MidJourneiIA(message);
        //await infoMsg(message, '*imagine in maintenance.*\ntry !img <keyword>'); 
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
    } else {    
      await db.addContagemTotal(sender);    
      }
    
  } catch (error) {
    if (error.message.includes("Cannot read properties of null") && error.message.includes("max_comandos_dia")) {
      // erro específico que você deseja suprimir
    } else {
      console.error(`An error occurred: ${error}`);
    }
  }
  

}
import sendToOpenApi from '../../Helpers/api.mjs'
import axios from 'axios';

const helpWords = "\n\no *Kizuno18* precisa de sua ajuda!\nsaiba mais em: *!sobre*\n_status:_ *operacional*";
const errMsg = `Não entendi, tente formular uma frase maior caso queira falar com o ChatGPT.\n\nDigite: !comando para ver os comandos disponiveis.`;

export async function OpenIA(message) {
  try {
    const contact = await message.getContact();
    const pushname = contact ? contact.pushname : undefined;

    let msg = message.body.replace("#", '');
    if (msg) {
      if (msg.trim().split(/\s+/).length < 3) {
        console.log(errMsg);
        message.reply(errMsg);
      } else {
        const response = await sendToOpenApi(msg);
        if (response) {
          console.log(response);
          message.reply(response);
        }
      }
    }
  } catch (error) {
    message.reply(`Ocorreu um erro: 400 or 429\n_tente novamente._\n Caso o erro persistir, digite: *!tokens*\n`);
  }
}

export default OpenIA;
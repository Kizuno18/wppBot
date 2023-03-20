import sendToOpenApi from '../../Helpers/api.mjs'
import axios from 'axios';

const helpWords = "\n\no *Kizuno18* precisa de sua ajuda!\nsaiba mais em: *!sobre*\n_status:_ *aguardando pagamento.*";

const OpenIA = async (message, letra) => {
  try {
    const contact = await message.getContact();
    const pushname = contact ? contact.pushname : undefined;

    if (!letra)
    {
    const response = await sendToOpenApi(message.body.replace("#", ""));
    if (response) {
      console.log(response);
      message.reply(response+helpWords);
    }
  }
  else{ 
    
    const shapeOfYou = "A música 'Shape of You' é uma canção do cantor e compositor britânico Ed Sheeran, lançada em janeiro de 2017 como o primeiro single de seu terceiro álbum de estúdio, '÷' (Divide). A letra da música é a seguinte:\n\n[Estrofe 1]\nThe club isn't the best place to find a lover\nSo the bar is where I go\nMe and my friends at the table doing shots\nDrinking fast and then we talk slow\n\n[Refrão]\nAnd you come over and start up a conversation with just me\nAnd trust me I'll give it a chance now\nTake my hand, stop, put Van the Man on the jukebox\nAnd then we start to dance, and now I'm singing like\n\n[Pré-Refrão]\nGirl, you know I want your love\nYour love was handmade for somebody like me\nCome on now, follow my lead\nI may be crazy, don't mind me\n\n[Estrofe 2]\nSay, boy, let's not talk too much\nGrab on my waist and put that body on me\nCome on now, follow my lead\nCome, come on now, follow my lead (mmmm)\n\n[Refrão]\nAnd you come over and start up a conversation with just me\nAnd trust me I'll give it a chance now\nTake my hand, stop, put Van the Man on the jukebox\nAnd then we start to dance, and now I'm singing like\n\n[Pré-Refrão]\nGirl, you know I want your love\nYour love was handmade for somebody like me\nCome on now, follow my lead\nI may be crazy, don't mind me\n\n[Ponte]\nCome on, be my baby, come on\nCome on, be my baby, come on\nCome on, be my baby, come on\nCome on, be my baby, come on\n\n[Estrofe 3]\nI'm in love with the shape of you\nWe push and pull like a magnet do\nAlthough my heart is falling too\nI'm in love with your body\nAnd last night you were in my room\nAnd now my bed sheets smell like you\nEvery day discovering something brand new\nI'm in love with your body\n\n[Refrão]\nAnd you come over and start up a conversation with just me\nAnd trust me I'll give it a chance now\nTake my hand, stop, put Van the Man on the jukebox\nAnd then we start to dance, and now I'm singing like\n\n[Pré-Refrão]\nGirl, you know I want your love\nYour love was handmade for somebody like me\nCome on now, follow my lead\nI may be crazy, don't mind me\n\n[Ponte]\nSay, boy, let's not talk too much\nCome on now, follow my lead\nCome, come on now, follow my lead\nMmmm\n\nA música foi um grande sucesso internacional, alcançando o topo das paradas em vários países, incluindo os Estados Unidos e o Reino Unido. A letra fala sobre um encontro em um bar, onde o narrador se encanta com a forma física da pessoa com quem está dançando. A música foi escrita por Ed Sheeran em parceria com os produtores Steve Mac e Johnny McDaid.";
    const response1 = exemplo += shapeOfYou + " \n caso a musica não for encontrada, gere uma frase aleatoria semelhante a essa: a Letra não foi encontrada" + "\n exemplo: " + "\n Não encontrei a letra, Desculpe!\n tem certeza que escreveu o nome da musica corretamente?Você também pode tentar adicionar o nome do autor no comando."+"\n excluindo a letra, todas as informações devem ser fornecidas no idioma 'pt-br'"+"\n lembre-se de separar as estrofes, informacoes sobre autor, album e data de lançamento (se houver a historia da musica, pode anexar no final da mensagem.";
    const response2 = response1 +="agora, considerando tudo que falei acima,  Faça uma pesquisa sobre a musica e envie a letra da música separada em estrofes e se tiver informaçoes adicionais como album, autor e data de lançamento pode enviar 2 linhas acima da musica, se não houver letra da música não invente, responda uma frase generica semelhante a: 'a Letra não foi encontrada'\n pesquise a letra e tudo mais sobre a musica:" + message.body.replace("!letra","") + "(caso não encontrar a letra você não deve criar ou inventar, e sim dizer que não encontrou) se voce encontrar a letra da musica: "+ message.body.replace("!letra","")+" sua resposta deve ter no minimo 1200 caracteres, caso contrario já sabe o que deve responder.";
    const autor = "qual é o autor da musica: "+ message.body.replace("!letra", "");
    const album = "\n  a qual album pertence a musica: "+ message.body.replace("!letra", "");
    const datade = "\n  qual foi a data de lançamento da musica: "+ message.body.replace("!letra", "");
    const hist = "\n  se existe alguma historia por tras da musica, conte a historia da musica: "+ message.body.replace("!letra", "");
    response2 = autor + album + datade + hist + "\n responda todas as perguntas acima com resposta completa, e casou não souber justifique que não encontrou o resultado.";
    console.log(response2);
    const response = await sendToOpenApi(response2);
    if (response) {
      console.log(response);
      message.reply(response);
    }
  }
  } catch (error) {
    message.reply(`Ocorreu um erro: 400 or 429\n_tente novamente._\n Caso o erro persistir, digite: *!tokens*\n`);
  }
};

export default OpenIA;
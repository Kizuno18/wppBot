(async () => {
    const midjourney = await import("midjourney-client").then((module) => module.default);
  
    // Your module code goes here
  
  })();
  
import whatsappWeb from "whatsapp-web.js";
const { MessageMedia } = whatsappWeb;

const MidJourneiIA = async (message) => {
    try {
        await message.react("⏱");
    
        const imageJourney = await midjourney(message.body.replace('!imagine ', ''), { width: 1024 })
        const media = await MessageMedia.fromUrl(imageJourney);
        
        await message.reply(media)
        
        await message.react("✅");
    } catch (error) {
        await message.reply(`Ocorreu um erro: ${error} \n tente novamente em alguns minutos, se o erro persistir é porque alcancei o limite de requisições api por ip, não uso a biblioteca MidJourney porque ainda não existe API publica para tal, atualmente as imagens criativas vem do replicate.com`)
    } 
}


export default MidJourneiIA
import axios from "axios";
import midjourney from "midjourney-client";
import httpsProxyAgent from "https-proxy-agent";
import whatsappWeb from "whatsapp-web.js";
const { MessageMedia } = whatsappWeb;

const MidJourneiIA = async (message) => {
    try {
        await message.react("⏱");

        const proxyOptions = {
            host: "geo.iproyal.com",
            port: 12321,
            auth: "gleo12:gleo12"
        };

        const imageJourney = (await midjourney(message.body.replace('!imagine ', '"mdjrny-v4 '), { width: 1024 }));
        const mediaUrl = imageJourney;

       //const response = await axios.get(mediaUrl, {
       //    httpsAgent: new httpsProxyAgent(proxyOptions),
       //    proxy: {
       //        host: proxyOptions.host,
       //        port: proxyOptions.port,
       //        auth: {
       //            username: 'gleo12',
       //            password: 'gleo12'
       //        }
       //    }
       //});
        const buffer = await mediaUrl;
        const media = new MessageMedia('image/jpeg', buffer.toString('base64'), 'image.jpeg');

        await message.reply(media);

        await message.react("✅");
    } catch (error) {      
        await message.react("❌");
        await message.reply(`Ocorreu um erro: $Error 403 \n tente novamente mais tarde.\n enquanto isso use: \n*!img* para buscar uma imagem`);
    } 
};

export default MidJourneiIA;

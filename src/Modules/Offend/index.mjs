import whatsappWeb from "whatsapp-web.js";
const { Contact } = whatsappWeb;

const Offend = async (message) => {
try{
    const mentions = await message.getMentions();
    
    for(let contact of mentions) {
        fetch('http://xinga-me.appspot.com/api')
        .then(r => r.json())
        .then(res => message.reply(`${contact.pushname} ${res.xingamento}`))
        .catch(error => message.reply(`Algo deu errado: ${error}`))
    }
       } catch (error) {
        await message.reply(`Ocorreu um erro: ${error}`)
    } 
    

};

export default Offend;

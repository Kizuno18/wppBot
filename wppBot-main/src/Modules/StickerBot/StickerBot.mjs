import whatsappWeb, { Client } from "whatsapp-web.js";
const { MessageMedia } = whatsappWeb;

export const StickerCreate = async (message, description) => {
  try {
    const chat = await message.getChat();
    const imageMessage = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;
    if (imageMessage.type === "image" || imageMessage.type === "video") {
      const media = await imageMessage.downloadMedia();
      const webpBase64Data = await media?.data;
      const description="@oBigLeo";
      const stickerMedia = new MessageMedia(imageMessage.type === "image" ? "image/jpeg" : "video/mp4",   webpBase64Data,
      { 
        caption: `description: ${description}` 
      });
      await chat.sendMessage(stickerMedia, { sendMediaAsSticker: true, stickerAuthor: "", stickerName: "", stickerDescription: description });
    } else {
      message.reply("Preciso de uma imagem ou vídeo para criar a figurinha");
    }
  } catch (error) {
    await message.reply(`Ocorreu um erro: ${error}`)
  } 
};

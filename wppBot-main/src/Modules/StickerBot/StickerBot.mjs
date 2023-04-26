import whatsappWeb, { Client } from "whatsapp-web.js";
const { MessageMedia } = whatsappWeb;


export async function StickerCreate(message) {
  try {
    const chat = await message.getChat();
    const imageMessage = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    if (imageMessage.type === "image" || imageMessage.type === "video") {
      const media = await imageMessage.downloadMedia();
      const webpBase64Data = await media?.data;
      const stickerMedia = new MessageMedia(imageMessage.type === "image" ? "image/jpeg" : "video/mp4", webpBase64Data);
      await chat.sendMessage(stickerMedia, { sendMediaAsSticker: true });
    } else {
      message.reply("Preciso de uma imagem ou vídeo para criar a figurinha");
    }
  } catch (error) {
    await message.reply(`Ocorreu um erro: ${error}`);
  }
}

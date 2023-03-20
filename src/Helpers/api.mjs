import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function sendToOpenApi(text) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    max_tokens: 2048,
    temperature: 1,
  });
  if (response.status === 200) {
    return response.data.choices[0].text;
  } else {
    return "Houve um erro ao fazer a requisicao para o chat GPT";
  }
}

export default sendToOpenApi
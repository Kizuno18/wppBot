import midjourney from "midjourney-client";
import axios from "axios";
import httpsProxyAgent from "https-proxy-agent";

const MidJourneyIA = async () => {
    const MAX_ATTEMPTS = 100;
    const WAIT_TIME_MS = 5000; // 5 segundos

    let attempt = 1;
    let response;
    while (attempt <= MAX_ATTEMPTS) {
        console.log(`Tentando buscar imagem - tentativa ${attempt}`);
        try {
            const proxyOptions = {
                host: "geo.iproyal.com",
                port: 12321,
                auth: "gleo12:gleo12_country-br_streaming-1"
            };

            const imageJourney = (await midjourney('mdjrny-v4 pinguims dançando')[0]);
            const mediaUrl = imageJourney;

            //console.log(mediaUrl);
            response = await axios.get(mediaUrl, {
                httpsAgent: new httpsProxyAgent(proxyOptions),
                proxy: {
                    host: proxyOptions.host,
                    port: proxyOptions.port,
                    auth: {
                        username: 'gleo12',
                        password: 'gleo12_country-br_streaming-1'
                    }
                }
            });

            break; // se chegou aqui, a solicitação foi bem-sucedida
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log(`Tentativa ${attempt} falhou: erro ${error.response.status}`);
                attempt++;
                await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS)); // espera por um tempo antes de tentar novamente
            } else {
                console.log(`Ocorreu um erro: ${error} \n`);
                return;
            }
        }
    }

    if (attempt > MAX_ATTEMPTS) {
        console.log(`Todas as ${MAX_ATTEMPTS} tentativas falharam.`);
        return;
    }

    const buffer = await response.data;
    console.log(buffer);
};

MidJourneyIA();

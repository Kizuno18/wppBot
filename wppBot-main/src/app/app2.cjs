//REQUERINDO MODULOS
const moment = require("moment-timezone")
moment.tz.setDefault('America/Sao_Paulo')
require('dotenv').config()
const { create, Client } = require('@open-wa/wa-automate')
const {criarArquivosNecessarios, criarTexto, consoleErro, corTexto} = require('./../../lib/util')
const {verificacaoListaNegraGeral} = require(`./../../lib/listaNegra`)
const {atualizarParticipantes} = require("./../../lib/controleParticipantes")
const config = require('./../../config/config2')
const checagemMensagem = require("./../../lib/checagemMensagem")
const chamadaComando = require("./../../lib/chamadaComando")
const msgs_texto = require("./../../lib/msgs")
const recarregarContagem = require("./../../lib/recarregarContagem")
const {botStart} = require('./../../lib/bot')
const { verificarMembros } = require('../../lib/api')
const {verificarEnv} = require('./../../lib/env')
const db = require('../../lib/database')
const path = require('path');
const ownerNumber = process.env.NUMERO_DONO.trim()

const start = async (client = new Client()) => {
    try{
        //VERIFICA SE É NECESSÁRIO CRIAR ALGUM TIPO DE ARQUIVO NECESSÁRIO
        let necessitaCriar = await criarArquivosNecessarios()
        if(necessitaCriar){
            console.log(corTexto(msgs_texto.inicio.arquivos_criados))
            setTimeout(()=>{
                return client.kill()
            },5000)
        } else {
            const eventosGrupo = require('./../../lib/eventosGrupo')
            const antiLink = require('./../../lib/antiLink')
            const antiFlood = require('./../../lib/antiFlood')
            const antiTrava = require('./../../lib/antiTrava')
            const antiPorno = require('./../../lib/antiPorno')
            const cadastrarGrupo = require('./../../lib/cadastrarGrupo')

            //Cadastro de grupos
            console.log(corTexto(await cadastrarGrupo("","inicio",client)))
            //Verificar lista negra dos grupos
            console.log(corTexto(await verificacaoListaNegraGeral(client)))
            //Atualização dos participantes dos grupos
            console.log(corTexto(await atualizarParticipantes(client)))
            //Atualização da contagem de mensagens
            console.log(corTexto(await recarregarContagem(client)))
            //Pegando hora de inicialização do BOT
            console.log(corTexto(await botStart()))
            //Verificando se os campos do .env foram modificados e envia para o console
            verificarEnv()

            await client.clearAllChats()            
            console.log('[CHATS] Limpos!')
            await db.limparTipo("prata")
            await db.limparTipo("ouro")
            await db.limparTipo("vip")            
            console.log('[CARGOS] Usuarios expirados removidos!')
            await verificarMembros()            
            console.log('[CARGOS] Verificados!')
            //INICIO DO SERVIDOR
            console.log('[SERVIDOR] Servidor iniciado!')

            // Forçando para continuar na sessão atual
            client.onStateChanged(state=>{
                console.log('statechanged', state)
                if(state==="CONFLICT" || state==="UNLAUNCHED") client.forceRefocus();
            
                if(state==='UNPAIRED') console.log('LOGGED OUT!!!!')
                client.kill()
              });

            // Ouvindo mensagens
            client.onMessage((async (message) => {
                if(!await antiTrava(client,message)) return
                if(!await antiLink(client,message)) return
                if(!await antiFlood(client,message)) return
                if(!await antiPorno(client, message)) return
                if(!await checagemMensagem(client, message)) return
                await chamadaComando(client, message)

            }), {})

            //Ouvindo entrada/saida de participantes dos grupo
            client.onGlobalParticipantsChanged((async (ev) => {
                await eventosGrupo(client, ev)
            }))
            
            //Ouvindo se a entrada do BOT em grupos
            client.onAddedToGroup((async (chat) => {
                await cadastrarGrupo(chat.id, "added", client)
                let gInfo = await client.getGroupInfo(chat.id)
                await client.sendText(chat.id, criarTexto(msgs_texto.geral.entrada_grupo, gInfo.title))
                await client.sendText(chat.id, criarTexto(msgs_texto.geral.entrada_grupo2, gInfo.title))
            }))

            // Ouvindo ligações recebidas
            client.onIncomingCall(( async (call) => {
                await client.sendText(call.peerJid, msgs_texto.geral.sem_ligacoes).then(async ()=>{
                    //client.contactBlock(call.peerJid)
                })
            }))

            /* PARA FINS DE TESTE
            client.onAnyMessage((async (message) =>{
                if (message.fromMe) await chamadaComando(client, message)
            })) */

        } 
    } catch(err) {
        //Faça algo se der erro em alguma das funções acima
        console.log(err)
        console.error(corTexto("[ERRO FATAL]","#d63e3e"), err.message)
        setTimeout(()=>{
            return process.exit(0)
        },10000)
    }
}

create(config(true, start))
    .then(client => start(client))
    .catch((error) => consoleErro(error, 'OPEN-WA'))

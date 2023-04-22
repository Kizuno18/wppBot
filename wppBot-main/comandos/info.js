//REQUERINDO MÓDULOS
const fs = require('fs-extra')
const menu = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const { version } = require('../package.json')
const {criarTexto, erroComandoMsg, removerNegritoComando, timestampParaData} = require("../lib/util")
const path = require('path')
const db = require('../lib/database')
const { obterPaymentId, obterTransactionSucess } = require('../lib/api')
const {botInfo} = require(path.resolve("lib/bot.js"))

module.exports = info = async(client, message, abrirMenu) => {
    try{
        const {id, chatId, sender, chat, isGroupMsg, caption, body} = message
        const { pushname, verifiedName, formattedName } = sender, username = pushname || verifiedName || formattedName
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const ownerNumber = process.env.NUMERO_DONO.trim()
        if(abrirMenu) command = "!menu"

        switch(command){
            case "!info":
                const botFotoURL = await client.getProfilePicFromServer(botNumber+'@c.us')
                var infoBot = JSON.parse(fs.readFileSync(path.resolve("./../../database/json/bot.json")))
                var botInicializacaoData = timestampParaData(infoBot.iniciado)
                var resposta = criarTexto(msgs_texto.info.info.resposta, process.env.NOME_ADMINISTRADOR.trim(), process.env.NOME_BOT.trim(), botInicializacaoData, infoBot.cmds_executados, ownerNumber, version)
                if(botFotoURL != undefined && botFotoURL != "ERROR: 404"){
                    await client.sendFileFromUrl(chatId, botFotoURL, "botfoto.jpg", resposta, id)
                } else {
                    await client.reply(chatId, resposta, id)
                }
                break
            
            case "!reportar":
                if(args.length == 1) return client.reply(chatId, erroComandoMsg(command) ,id)
                var usuarioMensagem = body.slice(10).trim(), resposta = criarTexto(msgs_texto.info.reportar.resposta, username, sender.id.replace("@c.us",""), usuarioMensagem)
                await client.sendText(ownerNumber+"@c.us", resposta)
                await client.reply(chatId,msgs_texto.info.reportar.sucesso,id)
                break            
                
            case "!desbloquear":                
                var usr = username
                var mesg = sender.id.replace("@c.us","")
                var payId = await obterPaymentId(100,usr,mesg)
                var pixLink = "https://checkout.livepix.gg/"+ payId
                await client.reply(chatId,`Para desbloquear o 🤖 *Kizuno18®* ~\nPIX de 1 Real 👇\n\n ${pixLink}\n_após concluir o PIX você deve digitar:_\n _!verificar_`,id)
                break

            case "!verificar":                
                var usr = username
                var mesg = sender.id.replace("@c.us","")
                var isSucess = await obterTransactionSucess(mesg)
                if (isSucess == true) {
                    var alterou = await db.alterarTipoUsuario(sender.id, "ouro")                    
                    await client.reply(chatId,`${usr}\n${mesg}\nVerificado com sucesso!`,id)
                    if (!alterou) {
                        await client.reply(chatId,`${usr}\n${mesg}\nNão foi possivel alterar o tipo de usuario!\n\n 👇 Entre em contato com o 🤖 *Kizuno18®* ~\n *!reportar*`,id)
                    } else {
                        await client.reply(chatId,`${usr}\n${mesg}\nTipo de usuario alterado para *OURO*!\n\n Agora você tem acesso ao 🤖 *Kizuno18®* ~\n*!menu*\n*!comandos*\n*!entrargrupo link*`,id)
                    }
                } else {
                await client.reply(chatId,`${usr}\n${mesg} Não encontrado!\n\nTalvez você não tenha desbloqueado 👇\n*!desbloquear*\n\nPara desbloquear o 🤖 *Kizuno18®* ~`,id)
                }
                break
            
            case '!meusdados':
                var dadosUsuario = await db.obterUsuario(sender.id), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                tipoUsuario = msgs_texto.tipos[tipoUsuario]
                var nomeUsuario = username , resposta = criarTexto(msgs_texto.info.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                if(botInfo().limite_diario.status) resposta += criarTexto(msgs_texto.info.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                if(isGroupMsg){
                    var dadosGrupo = await db.obterGrupo(groupId)
                    if(dadosGrupo.contador.status){
                        var usuarioAtividade = await db.obterAtividade(groupId,sender.id)
                        resposta += criarTexto(msgs_texto.info.meusdados.resposta_grupo, usuarioAtividade.msg)
                    }   
                }
                await client.reply(chatId, resposta, id)
                break
            
            case '!menu':
            case '!ajuda': 
                var dadosUsuario = await db.obterUsuario(sender.id), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite" 
                tipoUsuario = msgs_texto.tipos[tipoUsuario]
                var dadosResposta = '', nomeUsuario = username
                if(botInfo().limite_diario.status){
                    dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario)
                } else {
                    dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_comum, nomeUsuario, tipoUsuario)
                }
                dadosResposta += `═════════════════\n`

                if(args.length == 1){
                    var menuResposta = menu.menuPrincipal()
                    await client.sendText(chatId, dadosResposta+menuResposta)
                } else {
                    var usuarioOpcao = args[1]
                    var menuResposta = menu.menuPrincipal()
                    switch(usuarioOpcao){
                        case "0":
                            menuResposta = menu.menuInfoSuporte()
                            break
                        case "1":
                            menuResposta = menu.menuFigurinhas()
                            break
                        case "2":
                            menuResposta = menu.menuUtilidades()
                            break
                        case "3":
                            menuResposta = menu.menuDownload()
                            break
                        case "4":
                            if(isGroupMsg) menuResposta = menu.menuGrupo(isGroupAdmins)
                            else return await client.reply(chatId, msgs_texto.permissao.grupo, id)
                            break
                        case "5":
                            menuResposta = menu.menuDiversao(isGroupMsg)
                            break
                        case "6":
                            menuResposta = menu.menuCreditos()
                            break
                    }
                    await client.sendText(chatId, dadosResposta+menuResposta)
                }
                break
        }
    } catch(err){
        throw err
    }
    

}
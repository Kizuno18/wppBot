//REQUERINDO MODULOS
const fs = require('fs-extra')
const path = require("path")
const cadastrarGrupo = require('./cadastrarGrupo')
const db = require('./database')
const {botInfoUpdate, botLimitarComando, botInfo, botVerificarExpiracaoLimite,botLimitarMensagensPv} = require("./bot")
const {verificarBloqueioGlobal, verificarBloqueioGrupo} = require("./bloqueioComandos")
const { criarTexto, removerNegritoComando, consoleErro} = require('./util')
const msgs_texto = require('./msgs')
const lista_comandos = JSON.parse(fs.readFileSync(path.resolve('comandos/comandos.json')))

module.exports = checagemMensagem = async (client, message) => {
    try {
        if (!message || !message.id || !message.sender || !message.sender.id) return false;

        var groupMain = "120363142529983568@g.us"
        const {t, sender, isGroupMsg, chat, type, caption, id, chatId, body} = message;
        let {formattedTitle} = chat, { pushname, verifiedName, formattedName } = sender || {}, username = pushname || verifiedName || formattedName
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const ownerNumber = process.env.NUMERO_DONO.trim()
        const isOwner = ownerNumber == sender.id.replace(/@c.us/g, '')
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const grupoInfo = isGroupMsg ? await db.obterGrupo(groupId) : ''
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await client.getBlockedIds()
        const isBlocked = blockedNumbers.includes(sender.id)
        const comandoExiste = (
            lista_comandos.utilidades.includes(command) ||
            lista_comandos.grupo.includes(command) || 
            lista_comandos.diversao.includes(command) ||
            lista_comandos.admin.includes(command) ||
            lista_comandos.info.includes(command) ||
            lista_comandos.figurinhas.includes(command) ||
            lista_comandos.downloads.includes(command)
        )

        //SE O PV DO BOT NÃO ESTIVER LIBERADO
        if(!isGroupMsg && !isOwner && !botInfo().pvliberado) return false

        //SE O GRUPO NÃO FOR CADASTRADO
        if(isGroupMsg && !grupoInfo) await cadastrarGrupo(message,"msg",client)

        //SE NÃO FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
        if (!isGroupMsg && isBlocked) return false

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, VERIFICA SE O USUARIO EXISTE NO CONTADOR , REGISTRA ELE E ADICIONA A CONTAGEM
    
        if(isGroupMsg && grupoInfo && grupoInfo.contador.status) {
            await db.existeUsuarioContador(groupId,sender.id)
            await db.addContagem(groupId,sender.id,type)
        }
        
        //SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
        var registrado = await db.verificarRegistro(sender.id)
        if(!registrado) {
            if(isOwner) {
                await db.verificarDonoAtual(sender.id)                
                await db.registrarDono(sender.id, username)
            }
            else {
                const usuario = await db.obterUsuario(sender.id), cmds_total = usuario?.comandos_total || 0
                if (!username.includes("cmds:")) { // verifica se o nome do contato contém "cmd" (case-insensitive) e se o objeto usuario não é nulo
                    let usernamer = usuario + " cmds:" + cmds_total; // adiciona "cmds: 0" ao nome do contato
                    //console.log("Usuario Registrado: " + usernamer);                    
                    await db.registrarUsuario(sender.id, usernamer)
                } else await db.registrarUsuario(sender.id, username)
            }
        } else {
            let usuario = await db.obterUsuario(sender.id)
            if (usuario && isOwner) await db.verificarDonoAtual(sender.id)       
        }        

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //ATUALIZE NOME DO USUÁRIO 
            
            let usernamer;
            const usuario = await db.obterUsuario(sender.id), cmds_total = usuario?.comandos_total || 0
            if (usuario) {
                if (!usuario.nome)usuario.nome = ""
                if (usuario.nome.toLowerCase().includes("cmds:")) {
                    await db.atualizarNome(sender.id, username);
                } else {
                    usernamer = usuario.nome  + " cmds:" + cmds_total;
                    await db.atualizarNome(sender.id, usernamer);
                }
            }
            

            //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
            if (isGroupMsg && isBlocked) return false

            //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
            if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return false

            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfo().limitecomandos.status){
                let usuario = await db.obterUsuario(sender.id)
                let limiteComando = await botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await client.reply(chatId, limiteComando.msg, id)
                    return false
                }
            }

            //LIMITACAO DE isOnGroup()
            
            async function botVerificarIsOnGroup(sender, groupMain) {
                var isOnGroup = await db.isOnGroup(client, sender.id, groupMain)
                var isVerified = await db.isVerified(sender.id)
                if (!isOnGroup && !isVerified && command !== "!verificar" && command !== "!desbloquear") {
                    await client.reply(chatId, criarTexto(msgs_texto.grupo.isntOnGroup, username), id)
                    return false
                }
                else
                    return true        
            }
            var verifica = await botVerificarIsOnGroup(sender, groupMain);
            if (!verifica)
              return false
            

            
            //LIMITACAO DE isOnGroupSeen()
            
          //  async function botVerificarIsOnGroupSeen(group) {               
          //      var isOnGroupSeen = await db.isOnGroupSeen(client, group)
          //      if (!isOnGroupSeen) {
          //          await client.reply(chatId, criarTexto(msgs_texto.grupo.isntOnGroupSeen, username), id)
          //          return false
          //  }
          //      else
          //          return true        
          //  }
          //  
          //  if (isGroupMsg) {
          //  var verificaSeen = await botVerificarIsOnGroupSeen(groupId);
          //  if (!verificaSeen)
          //  return false
          //  }
           
            
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await verificarBloqueioGlobal(command) && !isOwner){
                await client.reply(chatId, criarTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, command), id)
                return false
            }
            
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && await verificarBloqueioGrupo(command, groupId) && !isGroupAdmins) {
                await client.reply(chatId,criarTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, command), id)
                return false
            }

            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfo().limite_diario.status){
                if(!lista_comandos.excecoes_contagem.includes(command) && !lista_comandos.admin.includes(command) && !lista_comandos.grupo.includes(command) && !lista_comandos.info.includes(command) && !msgGuia){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender.id)
                    if(!ultrapassou) {
                        await db.addContagemDiaria(sender.id) 
                    } else {
                        await client.reply(chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                        return false
                    }   
                } else {
                    await db.addContagemTotal(sender.id)
                    await botVerificarExpiracaoLimite()
                }
            } else {
                await db.addContagemTotal(sender.id)
            }
          
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await botInfoUpdate()

        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfo().limitarmensagens.status){
                let u = await db.obterUsuario(sender.id)
                let tipo_usuario_pv = u ? u.tipo : "bronze"
                let limitarMensagens = await botLimitarMensagensPv(sender.id, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    await client.sendText(sender.id, limitarMensagens.msg)
                    return false
                }
            }
    }
        return true
    } catch (err) {
        consoleErro(err, 'checagemMensagem')
    }
}

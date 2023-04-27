module.exports = config = (headless, start) =>  {
    return {
        sessionId: 'session',
        sessionDataPath: "./sessions",        
        headless,
        qrTimeout: 0,
        authTimeout: 0,
        skipUpdateCheck: true,
        multiDevice: true,
        cachedPatch: true,
        cacheEnabled: false,
        useChrome: true,
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        stickerServerEndpoint: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: true,
        args: [
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-component-extensions-with-background-pages',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-features=TranslateUI,BlinkGenPropertyTrees',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-sync',
            '--force-color-profile=srgb',
            '--hide-scrollbars',
            '--ignore-certificate-errors',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process',
            '--start-maximized',
            '--use-gl=swiftshader',
            '--disable-gpu',
            '--disable-software-rasterizer', // Desabilita o uso do software rasterizador
            '--enable-features=NetworkService,NetworkServiceInProcess', // Ativa o serviço de rede e o serviço de rede no processo
            '--disable-background-fetch-throttling', // Desabilita a limitação de fetches em segundo plano
            '--disable-client-side-phishing-detection', // Desabilita a detecção de phishing do lado do cliente
            '--disable-default-apps', // Desabilita os aplicativos padrão
            '--disable-gpu-sandbox', // Desabilita o ambiente sandbox da GPU
            '--disable-infobars', // Remove a barra de informações do Chromium
            '--disable-low-res-tiling', // Desabilita a renderização em baixa resolução
            '--disable-offer-store-unmasked-wallet-cards', // Desabilita a oferta de armazenar cartões de carteira desmascarados
            '--disable-site-isolation-trials', // Desabilita o isolamento do site
            '--disable-web-security', // Desabilita a segurança da web
            '--enable-automation', // Ativa a automação do Chromium
            '--ignore-gpu-blocklist', // Ignora a lista de bloqueio da GPU
            '--no-startup-window', // Não abre uma janela de inicialização
            '--enable-blink-features=IdleDetection' // Ativa a detecção de inatividade do Blink
        ]
    }
}

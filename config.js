module.exports = config = (headless, start) =>  {
    return{
        sessionId: 'session',
        headless,
        qrTimeout: 0,
        authTimeout: 0,
        skipUpdateCheck: true,
        multiDevice: true,
        cachedPatch: true,
        cacheEnabled: true,
        restartOnCrash: start,
        useChrome: true,
        stickerServerEndpoint: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: false,
        chromiumArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
}


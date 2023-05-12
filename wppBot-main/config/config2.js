module.exports = config = (headless, start) =>  {
    return {
        sessionId: 'session2',
        sessionDataPath: "./sessions", 
        headless,
        qrTimeout: 0,
        authTimeout: 0,
        skipUpdateCheck: true,
        multiDevice: true,
        cachedPatch: true,
        cacheEnabled: false,
        useChrome: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        stickerServerEndpoint: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: true,
            args: []
    }
}

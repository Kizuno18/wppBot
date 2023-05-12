const { exec } = require('child_process');
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function restart(serviceName) {
  console.log(`Restarting: ${serviceName}`);
  switch (serviceName) {
    case "all":
    case "run":
      try {
        await execCmd(`pm2 delete all`);
        console.log("all processes deleted.");
      }   
      catch {
        console.log("all processes deleted.");
      } 
      await startOrRestartApps([
        "app",
        "app2",
        "app3",
        "index",
        "index2",
        "index3"
      ]);
      break;
    case "indexes":
      await startOrRestartApps([
        "index",
        "index2",
        "index3"
      ], true);
      break;
    case "apps":
      await startOrRestartApps([
        "app",
        "app2",
        "app3"
      ], true);
      break;
    default:
      await execCmd(`pm2 restart ${serviceName}`);
      break;
  }
}

async function execCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error while executing the command: ${error}`);
        reject(error);
      } else {
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve();
      }
    });
  });
}

async function startOrRestartApps(apps, restart = false) {
  const action = restart ? "Restarting" : "Starting";
  const cmdName = restart ? "pm2 restart" : "npm run";
  for (const app of apps) {
    try{
    const cmd = `cd C:/Users/Administrator/Desktop/wpp && ${cmdName} ${app}`;
    console.log(`${action}: ${app}`);
    await execCmd(cmd);
    console.log(`${action} complete: ${app}`);
    await sleep(20000); // wait 20 seconds between starting apps
    }
    catch {
      console.log(`${action} complete: ${app}`);
      await sleep(20000); // wait 20 seconds between starting apps}
  }
}
}


module.exports = { restart };

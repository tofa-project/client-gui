const Daemon = require('../daemon/daemon.js')
const WSConn = require('../wsconn/wsconn.js')

const Crypto = require('crypto')
const path = require('path')
const ps = require('ps-node')

const {spawn} = require('child_process')



// Checks if daemon is already running
const daemonIsAlreadyRunning = ()=>{
  return new Promise((accept, reject)=>{
    ps.lookup({
      command: "tofa-daemon.bin",
      psargs: "ux",
    }, (err, res)=>{
      if(err) reject("Could not check")
      else if (res.length < 1) reject("Not running")
      else accept(res)
    })
  })
}

/*
*   dedicated code for registering "startDaemon" IPC event as it's too spaghetti to fit in start-daemon.js
*/
module.exports = (ipcMain, mainWindow)=>{
  // start daemon with ws connection and register related events
  ipcMain.on('startDaemon', async (event, ...args)=>{
    // checks if daemon is already running
    try {
      await daemonIsAlreadyRunning()
      mainWindow.webContents.send("startDaemon_RES", "Daemon already running!")
      return
    } catch( e ) {
      if(e === "Could not check"){
        mainWindow.webContents.send("startDaemon_RES", "Error occurred amid starting daemon!")
        return
      }
    }

    let wsToken = Crypto.randomBytes(32).toString('hex')
    let pass = args[0]
    let prevLog = ""

    if(Daemon.get() === null)
      Daemon.set(spawn(`${path.join(__dirname, `..`, `bin`, 'tofa-daemon.bin')}`, [
        `-tor-bin=${path.join(__dirname, `..`, `bin`, 'tor.bin')}`
      ] ))
    else {
      mainWindow.webContents.send("startDaemon_RES", true)
      return
    }

    // receive daemon data from stderr
    Daemon.get().stderr.on("data", (data)=>{
      let str = data.toString()

      if(str.includes("Input db key")) Daemon.get().stdin.write(`${pass}\n`)      
      if(str.includes("Input wsrpc key")) Daemon.get().stdin.write(`${wsToken}\n`) 

      if (str.includes('OK') && prevLog.includes('Starting websocket RPC server')){
        WSConn.startWS(wsToken, mainWindow)

        WSConn.get().on('open', ()=>{
          mainWindow.webContents.send("startDaemon_RES", true)
        })    
      }

      if(str.includes('cipher: message authentication failed')) {
        Daemon.set(null)
        WSConn.set(null)
        mainWindow.webContents.send("daemon_wrongPassword", true)
      }

      if( str.includes("Apps broadcasted")) mainWindow.webContents.send("daemon_appsBroadcasted", true)

      if( (str.includes('panic:') || str.includes("FAIL"))  && 
        !str.includes('cipher: message authentication failed')) 
        mainWindow.webContents.send("daemon_ERROR", str)

      prevLog = data.toString()

      // avoids 'object has been destroyed error'
      if(!mainWindow.isDestroyed())
        mainWindow.webContents.send("stdLog", data.toString())

      console.log(data.toString())
    })
  })
}

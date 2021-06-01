const Daemon = require('../daemon/daemon.js')
const WSConn = require('../wsconn/wsconn.js')

const { Notification } = require('electron');

/*
*   Registers all IPC events
*/
module.exports = (ipcMain, mainWindow)=>{

  // start daemon event
  require('./start-daemon.js')(ipcMain, mainWindow)

  // checks if daemon is started
  ipcMain.on('daemonIsStarted', (event, ...args)=>{
    mainWindow.webContents.send('daemonIsStarted_RES', Daemon.get() !== null)
  })

  // request apps retrieval from GUI
  ipcMain.on('getApps', (event, ...args)=>{
    WSConn.sendViaPipe({
      "type": "comm",
      "comm": "get-apps",
    }).then(res=>{
      mainWindow.webContents.send("getApps_RES", res.apps) 
    }).catch(err=>{
      console.log(err)
      mainWindow.webContents.send("getApps_RES", err.message) 
    })
  })

  // request app creation
  ipcMain.on('makeService', (event, ...args)=>{
    WSConn.sendViaPipe({
      "type": "comm",
      "comm": "make-app",
      "appName": args[0],
    }, 1000*10).then(res=>{
      mainWindow.webContents.send("makeService_RES", res) 
    }).catch(err=>{
      mainWindow.webContents.send("stdLog", `GUI: ${err.message}`)
      mainWindow.webContents.send("makeService_RES", undefined) 
    })
  })

  // delete app by id
  ipcMain.on('delApp', (e, ...args)=>{
    WSConn.sendViaPipe({
      "type": "comm",
      "comm": "del-app",
      "appID": args[0],
    }, 1000*2).then(res=>{
      mainWindow.webContents.send("delApp_RES", res) 
    }).catch(err=>{
      mainWindow.webContents.send("stdLog", `GUI: ${err.message}`)
      mainWindow.webContents.send("delApp_RES", undefined) 
    })
  })

  // get apps
  ipcMain.on('getApp', (e, ...args)=>{
    WSConn.sendViaPipe({
      "type": "comm",
      "comm": "get-app",
      "appID": args[0],
    }, 1000*2).then(res=>{
      mainWindow.webContents.send("getApp_RES", res) 
    }).catch(err=>{
      mainWindow.webContents.send("stdLog", `GUI: ${err.message}`)
      mainWindow.webContents.send("getApp_RES", undefined) 
    })
  })

  // send raw to daemon
  ipcMain.on('wsSend', (e,...args)=>{
    if(!WSConn) return

    WSConn.send(args[0])
    .then(res=> mainWindow.webContents.send("wsSend_END", res))
    .catch(err=>{
      console.log(err)
      mainWindow.webContents.send("stdLog", `GUI: ${err.message}`)
      mainWindow.webContents.send("wsSend_END", `GUI: ${err.message}`)
    })
  })

  // fires a notification via Electron
  ipcMain.on('fireNotif', (e, ...args)=>{
    new Notification({
      title: args[0],
      body: args[1],
    }).show()
  })
}
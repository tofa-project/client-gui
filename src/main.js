// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
//require('electron-reload')(__dirname, {forceHardReset: true});

const path = require('path')
const Daemon = require('./daemon/daemon')
const fkill = require('fkill');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(
    path.join(__dirname, 'html', 'index.html')
  )

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.removeMenu()

  // register GUI<->IPC events and utils
  require('./ipc-events/register-events.js')(ipcMain, mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async function () {

  let d = Daemon.get()

  if (d){
    d.kill("SIGINT")   

    if(process.platform === 'win32')
      await fkill('tor.bin', {
        force: true
      })
  }

  if (process.platform !== 'darwin') {
    app.quit()
  }    
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const main = require('electron-reload');

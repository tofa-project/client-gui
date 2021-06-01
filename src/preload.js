const { contextBridge, ipcRenderer } = require("electron");

// Sends events via IPC and returns promise
const send = function(ch, data, timeOut = 1000){
    let P = new Promise((accept, reject)=>{
        let accepted = false

        ipcRenderer.once(ch+'_RES', (e, ...args)=>{
            accept(...args)
            accepted = true
        })

        // Timeout handler
        // IPC latency is very slow. 1000ms usually means event name is undefined
        setTimeout(()=>{
            if(!accepted) reject('timeout')
        }, timeOut)
    })

    ipcRenderer.send(ch, data)

    return P
}

// receiving events
const receive = function(ch, callback, once = false){
    if (once)
        ipcRenderer.once(ch, (e, ...args)=>callback(...args))
    else 
        ipcRenderer.on(ch, (e, ...args)=>callback(...args))

}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld( "api", {
    send, receive
});


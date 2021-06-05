const WS = require('ws')

// Holds ws connection instance
const Conn = {
  _instance: null,
  _pipes: {},

  get(){
    return this._instance
  },

  set(obj){
    this._instance = obj
  },

  send(data){
    return new Promise((accept, reject)=>{
      if(!this._instance) {
        reject('[ws] WSConn null')
        return
      }
      
      this._instance.send(Buffer.from(JSON.stringify(data)), err=>{
          if(err) eject(err)
          else accept(true)
      })      
    })
  },

  sendViaPipe(data, timeout = 1000){
    return new Promise((accept, reject)=>{
      if(!this._instance) {
        reject('[ws] WSConn null')
        return
      }
        
      let pipeID = + new Date()

      // register callback first
      this._pipes[`${pipeID}`] = (incoming)=>{
        if(incoming.type === "res" && incoming.pipeID === pipeID){
          delete this._pipes[pipeID]

          accept(incoming)
        }
      }

      // then send command
      this._instance.send(Buffer.from(
        JSON.stringify({...data, ...{pipeID}} )
      ) , err=> {
        if(err) {
          delete this._pipes[pipeID]
          reject('[ws] '+err.message)
          return
        }

        setTimeout(()=>{
          delete this._pipes[pipeID]
          reject('[ws] timeout')
        }, timeout)
      })
    })
  },

  // starts websocket server and register appropriate events
  startWS(wsToken, mainWindow){
    if(this._instance) return 

    // connect
    try {
      this._instance = new WS("ws://127.0.0.1:50750", {
        headers: {  Authorization: `Bearer ${wsToken}`},
      })
    } catch(e) {
      console.log(e)
    }

    // events
    //
    this._instance.on("message", (data)=>{
      data = JSON.parse(data)

      // events are treated separately
      if(data.type === 'event')
        mainWindow.webContents.send(data.eventName, data)
      else {
        for(key in this._pipes)
          this._pipes[key](data)              
      }
    })
  }
}

module.exports = Conn

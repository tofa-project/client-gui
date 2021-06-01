// Holds Tofa daemon instance
const Daemon = {
    _instance: null,

    get(){
        return this._instance
    },

    set (obj){
        this._instance = obj
    },
}

module.exports = Daemon

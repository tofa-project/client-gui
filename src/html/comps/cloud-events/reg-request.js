const RegRequestComp = Vue.component('reg-request', {
    data(){
        return {
            modalID: randId(),
            Modal: null,

            countDown: 60,
            data: {},
        }
    },

    methods:{
        fire(incoming){
            this.data = incoming
            this.Modal.open()
            api.send('fireNotif', "Action pending!", "Action pending!")

        },

        async _doYes(){
            api.send("wsSend", {
                type: "res",
                pipeID: this.data.pipeID,
                allow: true,
            })

            this.$parent
                .apps
                .find(item=>item.name === this.data.localAppName)
                .state = "1"



            this.Modal.close()

            toast ("Done! changes will go in force shortly...")
        },

        _doNo(){
            api.send("wsSend", {
                type: "res",
                pipeID: this.data.pipeID,
                allow: false,
            })

            this.Modal.close()
        },

        _updateCountdown(){
            setTimeout(()=>{
                if (this.countDown > 0) {
                    this.countDown--
                    this._updateCountdown()
                }

            }, 1000)
        }
    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID), {
                onOpenStart: ()=>{
                    // _(this.modalID).style.height = '230px'
                    // _(this.modalID).style.width = '350px'
                    // _(this.modalID).style.top = '20%'
                    this.countDown = 45
                    this._updateCountdown()
                },

                onCloseEnd: ()=>{
                    this.data = {}
                    this.countDown = 0
                }
            })
        })
    },

    watch:{
        countDown(_, o){
            if(o === 1) this._doNo()
        }
    },

    template: `
    <div :id="modalID" class="modal">
        <div class="modal-content left-align">
            <h4>Incoming registration!</h4>
            <div class="divider"></div>

            <p>An external service wants to register with one of your apps: <b>{{ data.localAppName }}</b></p>

            <p>Service name: <b>{{ data.remoteServiceName }}</b></p>
            <p>Service description: <b>{{ data.remoteServiceDescription }}</b></p>
            
            <p>After registration, service will be able to contact your Tofa client amid 2FA related actions.
                Do you wish allow this registration? Choose wisely! </p>

            <p class="red-text">A default "NO" will be chosen automatically after: <b><span v-html="countDown"></span>s</b></p>

            <br>
            <div class="center-align">
                <div class="btn waves-effect btn-flat" style="font-size: 20px" @click="_doYes()">Yes</div>&nbsp;&nbsp;&nbsp;
                <div class="btn waves-effect btn-flat" style="font-size: 20px" @click="_doNo()">No</div>            
            </div>
        </div>
    </div>
    `,
    
})

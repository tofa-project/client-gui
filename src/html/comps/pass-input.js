const PassInputComp = Vue.component('pass-input', {
    data(){
        return {
            modalID: randId(),
            Modal: null,

            password: '',
        }
    },

    methods:{
        fire(){
            this.Modal.open()
        },

        async attemptDaemonStart(){
            if (this.password.length > 0) {
                showDimmer()

                res = await api.send('startDaemon', this.password, 5000)
                if (res !== true) {
                    hideDimmer()
                    toast ('Could not start! '+res)
                    return
                }

                api.receive('daemon_appsBroadcasted', ()=>{
                    this.$parent.appsArePublished= true
                    this.$parent.getApps()
                }, true)

                this.Modal.close()

                hideDimmer()
            } else {
                toast("Please input valid password!")
            }
        },
    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID), {
                onCloseEnd: ()=>{ 
                    this.password = ''
                }
            })
        })
    },

    template: `
    <div :id="modalID" class="modal">
    <div class="modal-content">
        <div class="left-align">
            <b>Please input your database password. </b>
            <br>
            <br>
            If this is the first time you're using Tofa use a strong password consisting in at least 8 characters containing 
            letters and numbers.
            <br>
            <br>
            Write the password down to a paper and keep it safe. If you loose it you won't be able to recover your database, thus
            the ownership of your 2FA linked accounts!
        </div>
        <div class="row">
            <div class="input-field col s9">
                <input id="inputPasswordInputModal" v-model="password" type="password" v-on:keyup.enter="attemptDaemonStart()">
                <label for="inputPasswordInputModal">Password</label>
            </div>
            <div class="col">
                <br>
                <div class="btn green waves-effect" @click="attemptDaemonStart()">Access</div>
            </div>
        </div>        
    </div>
    <div class="modal-footer">
        <a  href="#!" 
            onclick="window.close()" 
            class="modal-close waves-effect waves-green btn-flat"
        >Exit</a>
    </div>
</div>
    `,
    
})

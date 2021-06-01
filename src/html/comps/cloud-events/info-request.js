const InfoRequestComp = Vue.component('info-request', {
    data(){
        return {
            modalID: randId(),
            Modal: null,

            data: {},
        }
    },

    methods:{
        fire(incoming){
            this.data = incoming
            this.Modal.open()
            api.send('fireNotif', "Action pending!", "Action pending!")

        },
    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID), {
                onOpenStart: ()=>{
                    // _(this.modalID).style.height = '230px'
                    // _(this.modalID).style.width = '350px'
                    // _(this.modalID).style.top = '20%'
                },

                onCloseEnd: ()=>{
                    this.data = {}
                }
            })
        })
    },

    template: `
    <div :id="modalID" class="modal">
        <div class="modal-content left-align">
            <h4>{{ data.appName }} - Notification</h4>
            <div class="divider"></div>

            <p><b>{{ data.appName }}</b> has pushed a notification to you.</p>

            <p>Content: <b>{{ data.infoDescription }}</b></p>
            
            <br>
            <div class="center-align">
                <div class="btn waves-effect btn-flat" style="font-size: 20px" @click="Modal.close()">Ok</div>    
            </div>
        </div>
    </div>
    `,
    
})

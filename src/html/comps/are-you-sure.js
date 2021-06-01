const AreYouSureComp = Vue.component('are-you-sure', {
    data(){
        return {
            modalID: randId(),
            Modal: null,

            nfo: null,
            callback: null,
        }
    },

    methods:{
        fire(callback, nfo = null){
            this.callback = callback
            this.nfo = nfo

            this.Modal.open()
        },

        async _doYes(){
            await this.callback()
            this._doNo()
        },

        _doNo(){
            this.Modal.close()
        },
    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID), {
                onOpenStart: ()=>{
                    // _(this.modalID).style.height = '300px'
                    // _(this.modalID).style.width = '400px'
                    _(this.modalID).style.top = '20%'
                }
            })
        })
    },

    template: `
    <div :id="modalID" class="modal">
        <div class="modal-content center-align">
            <h4  >Are you sure?</h4>
            <div class="divider"></div>

            <p v-if="nfo" v-html="nfo"></p>
            <br v-if="!nfo">
            <br>
            <div class="btn waves-effect btn-flat" style="font-size: 20px" @click="_doYes">Yes</div>&nbsp;&nbsp;&nbsp;
            <div class="btn waves-effect btn-flat" style="font-size: 20px" @click="_doNo">No</div>

        </div>
    </div>
    `,
    
})

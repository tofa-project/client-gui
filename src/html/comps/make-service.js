const MakeServiceComp = Vue.component('make-service', {
    data(){
        return {
            modalID: randId(),
            Modal: null,

            service_name: '',
        }
    },

    methods:{
        fire(){
            this.Modal.open()
        },

        async makeService(){
            showDimmer()
            let result = await api.send('makeService', this.service_name, 1000*10)

            if(result === undefined)
                toast("Unknown error occurred!")

            if(result.error)
                toast(result.error)

            if(result.success)
            {
                this.$parent.getApps()
                toast(result.success)
                this.Modal.close()
            }

            hideDimmer()
        }

    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID), {
                onCloseEnd: ()=>{
                    this.service_name = ''
                }
            })
        })
    },

    template: `
    <div :id="modalID" class="modal">
    <div class="modal-content left-align">
        <p class="flow-text">Create a new app</p>
        <div class="row">
            <div class="input-field col s9">
                <input id="inputMakeService" v-model="service_name" type="text" v-on:keyup.enter="makeService()">
                <label for="inputMakeService">App's name. Min 3 chars. Max 256 chars. Should be unique</label>
            </div>
            <div class="input-field col">
                <div class="btn green waves-effect" @click="makeService()">Make</div>
            </div>
        </div>

    </div>
    <div class="modal-footer">
        <a  href="#!" @click="Modal.close()" class="waves-effect waves-green btn-flat"
        >Exit</a>
    </div>
</div>
    `,
    
})

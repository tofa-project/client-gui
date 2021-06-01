const ViewAppComp = Vue.component('view-app', {
    data(){
        return {
            modalID: randId(),
            Modal: null,

            app: {}
        }
    },

    methods:{
        fire(app){
            this.getApp(app)
            this.Modal.open()
        },

        async getApp(app){
            let res = await api.send('getApp', app.id)

            if(res.app) this.app = res.app
            else toast('Error occurred!')
        },

        btoa(input){
            return btoa(input)
        },

        copyURI(){
            window.getSelection().selectAllChildren( this.$refs.URICode );
            document.execCommand('copy')
            
            toast('URI copied to clipboard!')
        }
    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID), {
                onOpenStart:()=>{
                    _(this.modalID).style.width = '90%'
                    _(this.modalID).style['min-height'] = '80%'
                    _(this.modalID).style.top = '4%'
                }
            })
        })
    },

    computed:{
        faURI(){
            return this.btoa(
                this.app.version+":"+
                this.app.onion+":"+
                this.app.port+"/"+this.app.path
            )
        }
    },

    template: `
<div :id="modalID" class="modal modal-fixed-footer ">
    <div class="modal-content left-align">
        <h4 class="center-align" style="margin-bottom: 1.2rem" >[{{ app.name }}]</h4>
        <div class="divider"></div>

        <p class="flow-text" style="margin-bottom: .8px">2FA URI (<a href="#!" @click="copyURI()">copy</a>)</p>
        <table>
            <tr>
                <td style="word-break: break-all">
                    <code ref="URICode">{{ faURI }}</code>
                </td>
            </tr>
        </table>

        <p class="flow-text" style="margin-bottom: .8px">General information</p>
        <table>
            <tr v-for="(value, key) in app">
                <td>{{ key }}:</td>
                <td><code>{{ value }}</code></td>
            </tr>
        </table>
    
    </div>
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat" @click="Modal.close()" >Back</a>
    </div>
</div>
    `,
    
})

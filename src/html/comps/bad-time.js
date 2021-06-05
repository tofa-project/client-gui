const BadTimeComp = Vue.component('bad-time', {
    data(){
        return {
            modalID: randId(),
            Modal: null,
        }
    },

    methods:{
        fire(){
            this.Modal.open()
        },
    },

    mounted(){
        this.$nextTick(()=>{
            this.Modal = M.Modal.init(document.getElementById(this.modalID))
        })
    },

    template: `
    <div :id="modalID" class="modal">
    <div class="modal-content flow-text">Your date/time is incorrect. Tor needs correct date/time to ensure circuits stability.</div>
    <div class="modal-footer">
        <a  href="#!" 
            onclick="window.close()" 
            class="modal-close waves-effect waves-green btn-flat"
        >Exit</a>
    </div>
</div>
    `,
    
})

const NoInternetComp = Vue.component('no-internet', {
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
    <div class="modal-content flow-text"> You need an active internet connection to use Tofa!</div>
    <div class="modal-footer">
        <a  href="#!" 
            onclick="window.close()" 
            class="modal-close waves-effect waves-green btn-flat"
        >Exit</a>
    </div>
</div>
    `,
    
})

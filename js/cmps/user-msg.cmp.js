import { eventBus } from "../service/event-bus.service.js"

export default {
    props: [],
    template: `
        <section :class="msg.type" class="user-msg" v-if="msg.txt">
            <button @click="removeUserMsg">x</button>
            <h1>{{msg.txt}}</h1>
        </section>
    `,
    data() {
        return {
            msg: { txt: '', type: 'success' },
            interval: null

        }
    },
    methods: {
        showMsg(payload) {
            this.msg = payload
            this.interval = setTimeout(this.removeUserMsg, 3000)
        },
        removeUserMsg() {
            this.msg.txt = ''
            this.interval = null
        }
    },
    computed: {
    },
    created() {
        eventBus.on('user-msg', this.showMsg)
    }
}
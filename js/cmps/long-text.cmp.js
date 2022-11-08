export default {
    props: ['txt'],
    template: `
        <section class="long-text">
            <p>{{showText}} <span v-if="this.txt.length > 100" 
            @click="expandDesc">{{getSpanTxt}}</span></p>
        </section>
    `,
    data() {
        return {
            isExpanded: false,
        }
    },
    methods: {
        expandDesc() {
            this.isExpanded = !this.isExpanded
        }
    },
    computed: {
        showText() {
            let desc = this.txt
            if (this.txt.length >= 100 && !this.isExpanded) {
                desc = desc.substring(0, 100).trim() + '...'
            }
            return desc
        },
        getSpanTxt() {
            return this.isExpanded ? 'Show less' : 'Show more'
        }
    },
}
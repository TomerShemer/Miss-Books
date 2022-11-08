import reviewPreview from "./review-preview.cmp.js"

export default {
    props: ['reviews'],
    template: `
        <section class="reviews-list">
            <h1>Reviews:</h1>
            <ul v-if="reviews">
                <li v-for="review in reviews">
                    <review-preview :review="review" @reviewDeleted="reviewDeleted"/>
                </li>
            </ul>
        </section>
        `,
    data() {
        return {
        }
    },
    methods: {
        reviewDeleted(id) {
            this.$emit('reviewDeleted', id)
        }
    },
    computed: {
    },
    components: {
        reviewPreview
    },
    created() {
        // console.log(this.reviews);
    }
}
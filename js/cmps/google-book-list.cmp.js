import googleBookPreview from "./google-book-preview.cmp.js"

export default {
    props: ['books'],
    template: `
        <section className="google-book-list">
            <ul>
                <li v-for="book in books">
                    <google-book-preview @add="add" :book="book"/>
                </li>
            </ul>
        </section>
    `,
    data() {
        return {
        }
    },
    methods: {
        add(book) {
            this.$emit('addBook', book)
        }
    },
    computed: {
    },
    components: {
        googleBookPreview,
    }
}
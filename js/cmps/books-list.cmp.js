import bookPreview from './book-preview.cmp.js'

export default {
    props: ['books'],
    template: `
    <section class="books-list">
        <ul>
            <li v-for="book in books" :key="book.id">
                <book-preview :book="book" />
                
            </li>
        </ul>
    </section>
`,
    data() {
        return {
        }
    },
    methods: {
        showDetails(book) {
            this.$emit('selected', book)
        }
    },
    computed: {
    },
    components: {
        bookPreview
    },
    created() {
    }
}
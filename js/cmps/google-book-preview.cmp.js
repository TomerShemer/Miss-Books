export default {
    props: ['book'],
    template: `
        <section className="google-book-preview">
            <label>{{book.title}}</label>
            <button @click="addGoogleBook(book)" class="btn-black">+</button>
        </section>
    `,
    data() {
        return {
        }
    },
    methods: {
        addGoogleBook(book) {
            this.$emit('add', book)
        }
    },
    computed: {
    },
}
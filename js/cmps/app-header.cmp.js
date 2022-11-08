export default {
    props: [],
    template: `
    <section class="app-header">
        <h1 @click="refresh">Miss-Books</h1>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/book">Books</router-link>
            <router-link to="/about">About</router-link>
        </nav>
    </section>
`,
    data() {
        return {
        }
    },
    methods: {
        refresh() {
            location.reload()
        }
    },
    computed: {
    },
}
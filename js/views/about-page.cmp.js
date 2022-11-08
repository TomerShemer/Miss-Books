export default {
    props: [],
    template: `
        <section class="about-page">
            <img src="../../imgs/about-page.jpg" alt="" />
            <h1>About us</h1>
            <p>We are a local bookshop in Tel-Aviv, we welcome you to enjoy our ever expanding selection of books.</p>
            <p>In this website you can see which books we carry, and leave reviews for the books you've read.</p>
            <section className="contact-nav">
                <router-link to="/about/team">Team</router-link>
                <router-link to="/about/contact">Contact us</router-link>
            </section>
            <router-view></router-view>
        </section>
`,
    data() {
        return {
        }
    },
    methods: {
    },
    computed: {
    },
}
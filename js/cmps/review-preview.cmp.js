import { eventBus } from "../service/event-bus.service.js"

export default {
    props: ['review'],
    template: `
        <section class="review-preview">
            <button @click="deleteReview(review.id)" class="btn-black">x</button>
            <h1>{{review.userName}}</h1>
            <h1>Rated: {{ review.rating }}/5</h1>
            <small>Read at: {{formattedDate}}</small>
            <p>"{{review.txt}}"</p>
        </section>
    `,
    methods: {
        deleteReview(id) {
            this.$emit('reviewDeleted', id)
            eventBus.emit('user-msg', { txt: 'Review deleted', type: 'warning' })
        }
    },
    computed: {
        formattedDate() {
            const d = this.review.date.split('-')
            return `${d[2]}/${d[1]}/${d[0]}`
        }
    },
}
import { bookService } from "../service/books-service.js";
import { eventBus } from "../service/event-bus.service.js";

export default {
    props: ['id'],
    template: `
        <section class="review-add">
            <h3>Write a review</h3>
            <form @submit.prevent="submitReview">
                <input v-model="review.userName" ref="name" type="text" required placeholder="Full name"/>
                <label for="rating-input">Rating: 
                    <input v-model="review.rating" id="rating-input" type="range" min="1" max="5" :title="ratingValue"/>
                    <span>{{ratingValue}}</span>
                </label>
                    <label for="read-at">Read at:
                    <input :value="getMaxDate" :max="getMaxDate" type="date" id="read-at" required/>
                </label>
                <textarea v-model="review.txt" cols="30" rows="10" placeholder="Your review" required></textarea>
                <button>Submit</button>
            </form>
        </section>
        `,
    data() {
        return {
            review: {
                userName: 'Book Reader',
                rating: 3,
                date: null,
                txt: ''
            }
        }
    },
    methods: {
        submitReview() {
            bookService.addReview(this.id, this.review)
            this.$emit('addReview', this.review)
            this.review = bookService.getEmptyReview()
            eventBus.emit('user-msg', { txt: 'Review added successfully', type: 'success' })
        }
    },
    computed: {
        ratingValue() {
            return this.review.rating
        },
        getMaxDate() {
            const date = new Date()
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, 0)}-${(date.getDate() + '').padStart(2, 0)}`
            this.review.date = dateStr
            return dateStr
        }
    },
    mounted() {
        this.$refs.name.focus()
    }
}
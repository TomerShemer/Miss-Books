import { bookService } from '../service/books-service.js'

import longText from '../cmps/long-text.cmp.js'
import reviewAdd from '../cmps/review-add.cmp.js'
import reviewsList from '../cmps/reviews-list.cmp.js'

export default {
    props: [],
    template: `
        <section class="book-details-container">
            <section v-if="book" className="book-details">
                <img :src="getUrl" />
                <section class="book-info">
                    <h2>"{{this.book.title}}"</h2>
                    <h3>{{this.book.subtitle}}</h3>
                    <h4>Authors: {{authors}}</h4>
                    <h4>language: {{this.book.language}}</h4>
                    <h4>{{formattedPageCount}} pages, {{pageCount}}</h4>
                    <h4>Published in: {{formattedPublishYear}}</h4>
                    <h4 :class="priceStyle">
                        {{formattedPrice}}
                    </h4>
                    <long-text :txt="book.description"/>
                    <router-link to="/book">Go Back</router-link>
                </section>
            </section>
            <review-add v-if="book" :id="book.id" @addReview="reviewAdded"/>
            <reviews-list v-if="hasReviews" :reviews="book.reviews" @reviewDeleted="deleteReview"/>
        </section>
        `,
    data() {
        return {
            book: null,
            // hasReviews: false
        }
    },
    methods: {
        reviewAdded(review) {
            if (!this.book.reviews) {
                this.book.reviews = [review]
            } else this.book.reviews.unshift(review)

        },
        deleteReview(id) {
            bookService.deleteReview(this.book, id)
            this.reviews = this.book.reviews
        }
    },
    computed: {
        pageCount() {
            const pageCount = this.book.pageCount
            if (pageCount > 500) return 'Long Reading'
            else if (pageCount > 200) return 'Decent Reading'
            else if (pageCount > 100) return 'Light Reading'
            else return 'Very Short'
        },
        formattedPageCount() {
            const pageCount = this.book.pageCount
            return pageCount.toLocaleString('he-IL')
        },
        formattedPublishYear() {
            const publishedYear = this.book.publishedDate
            const currYear = new Date().getFullYear()
            if (currYear - publishedYear > 10) return `${publishedYear} - Veteran Book`
            else if (currYear - publishedYear < 1) return `${publishedYear} - New!`
            else return `${publishedYear}`
        },
        formattedPrice() {
            const priceData = this.book.listPrice
            const price = new Intl.NumberFormat('he-IL', { style: 'currency', currency: `${priceData.currencyCode}` }).format(priceData.amount)
            return price
        },
        priceStyle() {
            const price = this.book.listPrice.amount
            return { low: price < 20, high: price > 150 }
        },
        authors() {
            return this.book.authors.join()
        },
        categories() {
            return this.book.categories.join()
        },
        getUrl() {
            return this.book.thumbnail
        },
        hasReviews() {
            if (!this.book) return false
            if (!this.book.reviews) return false
            if (!this.book.reviews.length) return false
            return true
        }

    },
    components: {
        longText,
        reviewAdd,
        reviewsList
    },
    created() {
        const id = this.$route.params.id
        bookService.get(id)
            .then(book => {
                // console.log(book);
                this.book = book
            })
    },
    mounted() {
    }
}
import { bookService } from '../service/books-service.js'

import longText from '../cmps/long-text.cmp.js'
import reviewAdd from '../cmps/review-add.cmp.js'
import reviewsList from '../cmps/reviews-list.cmp.js'

export default {
    props: [],
    template: `
        <section class="book-details-container">
            <section v-if="book" className="book-details">
                <div className="img-container">
                    <img :src="getUrl" />
                </div>
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
                    <div v-if="book.listPrice.isOnSale" className="sale-img-container">
                        <img src="../../imgs/sale.png" alt="" />
                    </div>
                    <long-text :txt="book.description"/>
                    <router-link to="/book">
                        <button class="btn-black">Go back</button>
                    </router-link>
                </section>
            </section>
            <section v-if="book" className="book-details-nav">
                <router-link :to="'/book/' + prevBookId">
                    <button class="btn-black">Previous book</button>
                </router-link>
                <router-link :to="'/book/' + nextBookId">
                    <button class="btn-black">Next book</button>
                </router-link>
            </section>
            <review-add v-if="book" :id="book.id" @addReview="reviewAdded"/>
            <reviews-list v-if="hasReviews" :reviews="book.reviews" @reviewDeleted="deleteReview"/>
        </section>
        `,
    data() {
        return {
            book: null,
            prevBookId: null,
            nextBookId: null,
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
        },
        loadBook() {
            bookService.get(this.bookId)
                .then(book => {
                    this.book = book
                    bookService.getNextBookId(book.id)
                        .then(nextBookId => this.nextBookId = nextBookId)

                    bookService.getPrevBookId(book.id)
                        .then(prevBookId => this.prevBookId = prevBookId)
                })
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
        },
        bookId() {
            return this.$route.params.id
        }

    },
    components: {
        longText,
        reviewAdd,
        reviewsList
    },
    created() {
        this.loadBook()
    },
    mounted() {
    },
    watch: {
        bookId() {
            this.loadBook()
        }
    }
}
import { bookService } from "../service/books-service.js"

import bookDetails from './book-details.cmp.js'

import booksFilter from '../cmps/books-filter.cmp.js'
import booksList from '../cmps/books-list.cmp.js'
import bookAdd from "./book-add.cmp.js"

export default {
    props: [],
    template: `
        <section class="books-app">
            <books-filter @filtered="setFilter"/>
            <books-list :books="filteredBooks" @selected="selectBook"/>
        </section>
        `,
    data() {
        return {
            books: null,
            selectedBook: null,
            filterBy: {
                txt: '',
                fromPrice: 0,
                toPrice: Infinity
            },
            filteredBooks: null
        }
    },
    methods: {
        selectBook(book) {
            this.selectedBook = book
        },
        setFilter(filter) {
            this.selectedBook = null
            console.log(filter);
            this.filterBy = filter
            this.booksToShow()
            // this.filterBy
        },
        booksToShow() {
            const regex = new RegExp(this.filterBy.txt, 'i')
            this.filteredBooks = this.books.filter(book => {
                return regex.test(book.title) &&
                    book.listPrice.amount >= this.filterBy.fromPrice &&
                    book.listPrice.amount <= this.filterBy.toPrice
            })
        }
    },
    computed: {
        getBookIdx() {
            return this.books.findIndex(book => book.id === this.selectedBook.id)
        }
    },
    created() {
        // this.books = bookService.query()
        bookService.query()
            .then(books => {
                this.books = books
                this.filteredBooks = [...this.books]
                // console.log('this.books', this.books)
            })
    },
    components: {
        booksFilter,
        booksList,
        bookDetails,
        bookAdd
    }
}
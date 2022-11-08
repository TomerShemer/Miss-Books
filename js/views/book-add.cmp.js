import { bookService } from "../service/books-service.js"

import googleBookList from "../cmps/google-book-list.cmp.js"

export default {
    template: `
        <section className="book-add">
            <form @submit.prevent="search">
                <input v-model="searchStr" type="text" placeholder="Search for new books"/>
                <button class="btn-black">Search</button>
            </form>
            <google-book-list @addBook="saveGoogleBook" v-if="books" :books="books"/>
        </section>
        `,
    data() {
        return {
            books: null,
            searchStr: '',
        }
    },
    methods: {
        search() {
            bookService.getGoogleBooks(this.searchStr)
                .then(books => {
                    this.books = books
                })
        },
        saveGoogleBook(book) {
            bookService.addGoogleBook(book)
        }
    },
    components: {
        googleBookList,
    }
}
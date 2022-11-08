import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

import database from '../../books.json' assert {type: 'json'}

export const bookService = {
    query,
    remove,
    get,
    addReview,
    // save,
    deleteReview,
    getEmptyReview
}


const BOOKS_KEY = 'booksDB'
_createBooks()

function query() {
    // return utilService.loadFromStorage(BOOKS_KEY)
    return storageService.query(BOOKS_KEY)
}

function get(bookId) {
    return storageService.get(BOOKS_KEY, bookId)
}

function remove(bookId) {
    // const books = query()
    // const idx = books.findIndex(book => book.id === bookId)
    // books.splice(idx, 1)
    // utilService.saveToStorage(BOOKS_KEY)
    return storageService.remove(BOOKS_KEY, bookId)
}

// function save(book) {
//     if (book.id) {
//         return storageService.put(BOOKS_KEY, book)
//     } else {
//         return storageService.post(BOOKS_KEY, book)
//     }
// }

function addReview(bookId, review) {
    storageService.get(BOOKS_KEY, bookId)
        .then(book => {
            if (!book.reviews) book.reviews = []
            review.id = storageService.makeId(5)
            book.reviews.unshift(review)
            return storageService.put(BOOKS_KEY, book)
        })
        .then(book => {
            console.log(book)
        })
}

function deleteReview(book, reviewId) {
    const idx = book.reviews.findIndex(review => review.id === reviewId)
    book.reviews.splice(idx, 1)
    if (!book.reviews.length) book.reviews = null
    storageService.put(BOOKS_KEY, book)
}

function getEmptyReview() {
    return {
        userName: 'Book Reader',
        rating: 3,
        date: null,
        txt: ''
    }
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOKS_KEY)
    if (!books || !books.length) {
        books = database
        utilService.saveToStorage(BOOKS_KEY, books)
    }
    return books
}



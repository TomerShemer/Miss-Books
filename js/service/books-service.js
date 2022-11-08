import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

import database from '../../books.json' assert {type: 'json'}
import { eventBus } from './event-bus.service.js'

export const bookService = {
    query,
    remove,
    get,
    addReview,
    save,
    deleteReview,
    getEmptyReview,
    addGoogleBook,
    getGoogleBooks,
    getNextBookId,
    getPrevBookId,
}

const SEARCH_KEY = 'searchDB'
const BOOKS_KEY = 'booksDB'
_createBooks()

let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}

function query() {
    return storageService.query(BOOKS_KEY)
}

function get(bookId) {
    return storageService.get(BOOKS_KEY, bookId)
}

function remove(bookId) {
    return storageService.remove(BOOKS_KEY, bookId)
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOKS_KEY, book)
    } else {
        return storageService.post(BOOKS_KEY, book)
    }
}

function addReview(bookId, review) {
    storageService.get(BOOKS_KEY, bookId)
        .then(book => {
            if (!book.reviews) book.reviews = []
            review.id = utilService.makeId(5)
            book.reviews.unshift(review)
            return storageService.put(BOOKS_KEY, book)
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

function getNextBookId(bookId) {
    return storageService.query(BOOKS_KEY)
        .then(books => {
            let idx = books.findIndex(book => book.id === bookId)
            if (idx === books.length - 1) idx = -1
            return books[idx + 1].id
        })
}

function getPrevBookId(bookId) {
    return storageService.query(BOOKS_KEY)
        .then(books => {
            let idx = books.findIndex(book => book.id === bookId)
            if (!idx) idx = books.length
            return books[idx - 1].id
        })
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOKS_KEY)
    if (!books || !books.length) {
        books = database
        utilService.saveToStorage(BOOKS_KEY, books)
    }
    return books
}

// GOOGLE BOOKS 

function getGoogleBooks(searchStr) {
    const keyword = searchStr.toLowerCase()
    if (gSearchCache[keyword]) {
        console.log('Getting from cache');
        return Promise.resolve(gSearchCache[keyword])
    }

    const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=effective%20${keyword}`
    return axios.get(url)
        .then(res => {
            console.log('Getting books from google');
            const books = _prepareGoogleBooksData(res.data)
            gSearchCache[keyword] = books
            utilService.saveToStorage(SEARCH_KEY, gSearchCache)
            return books
        })
        .catch(err => {
            eventBus.emit('user-msg', { txt: 'Failed to get books from google.', type: 'failed' })
        })
}


function addGoogleBook(googleBook) {
    storageService.get(BOOKS_KEY, googleBook.id)
        .then(book => {
            if (!book) {
                eventBus.emit('user-msg', { txt: 'Book added!', type: 'success' })
                storageService.post(BOOKS_KEY, googleBook, false)
            }
            else {
                eventBus.emit('user-msg', { txt: 'Book Already Exists.', type: 'warning' })
            }
        })
        .catch(err => eventBus.emit('user-msg', { txt: 'Problem adding book.', type: 'failed' }))
}

function _prepareGoogleBooksData(googleBooks) {
    // console.log(googleBooks);
    let books = googleBooks.items.map(({ volumeInfo, id }) => {
        let src
        if (!volumeInfo.imageLinks) src = '../../imgs/default-book.jpg'
        else src = volumeInfo.imageLinks.thumbnail
        const price = utilService.getRandomIntInclusive(10, 300)
        const currency = Math.random() > 0.33 ? 'USD' : Math.random() > 0.66 ? 'ILS' : 'EUR'
        const subtitle = (volumeInfo.subtitle) ? volumeInfo.subtitle : 'No subtitle available'
        const publishedDate = (volumeInfo.publishedDate) ? +volumeInfo.publishedDate.slice(0, 4) : 'No publish date found'
        return {
            id,
            authors: volumeInfo.authors || ['No Authors'],
            categories: volumeInfo.categories || ['No Categories'],
            description: volumeInfo.description || 'No description available.',
            language: volumeInfo.language,
            listPrice: { amount: price, currencyCode: currency, isOnSale: Math.random() > 0.5 },
            pageCount: volumeInfo.pageCount || null,
            publishedDate,
            subtitle,
            thumbnail: src,
            title: volumeInfo.title
        }
    })
    // console.log(books);
    return books
}
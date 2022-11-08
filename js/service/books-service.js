import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

import database from '../../books.json' assert {type: 'json'}
import googleDatabase from '../../googleBooks.json' assert {type: 'json'}

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

function _createBooks() {
    let books = utilService.loadFromStorage(BOOKS_KEY)
    if (!books || !books.length) {
        books = database
        utilService.saveToStorage(BOOKS_KEY, books)
    }
    return books
}

// GOOGLE BOOKS 
// console.log('GoogleDb', googleDatabase);

function getGoogleBooks(searchStr) {
    const keyword = searchStr.toLowerCase()
    if (gSearchCache[keyword]) {
        console.log('Getting from cache');
        return Promise.resolve(gSearchCache[keyword])
    }

    const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=effective%20${keyword}`
    return axios.get(url)
        .then(res => {
            console.log('Got books from google');
            const books = _prepareGoogleBooksData(res.data)
            gSearchCache[keyword] = books
            utilService.saveToStorage(SEARCH_KEY, gSearchCache)
            return books
        })
        .catch(err => {
            // TODO add user-msg
            console.log('Problem getting books from google');
        })
}


function addGoogleBook(googleBook) {
    console.log('Trying to add new book');
    console.log(googleBook);
    storageService.get(BOOKS_KEY, googleBook.id)
        .then(book => {
            if (!book) {
                console.log('Saving new book');
                storageService.post(BOOKS_KEY, googleBook, false)
            }
            else {
                //TODO change to user-msg
                console.log('Book Already Exists:')
                console.log(book);
            }
        })
        .catch(err => console.log('Error adding book', err))
}

function _prepareGoogleBooksData(googleBooks) {
    // console.log(googleBooks);
    let books = googleBooks.items.map(({ volumeInfo, id }) => {
        let src
        if (!volumeInfo.imageLinks) src = '../../imgs/default-book.jpg'
        else src = volumeInfo.imageLinks.thumbnail
        const price = utilService.getRandomIntInclusive(10, 300)
        const currency = Math.random() > 0.33 ? 'USD' : Math.random() > 0.66 ? 'ILS' : 'EUR'
        return {
            id,
            authors: volumeInfo.authors || ['No Authors'],
            categories: volumeInfo.categories || ['No Categories'],
            description: volumeInfo.description || 'No description available.',
            language: volumeInfo.language,
            listPrice: { amount: price, currencyCode: currency, isOnSale: Math.random() > 0.5 },
            pageCount: volumeInfo.pageCount,
            publishedDate: +volumeInfo.publishedDate.slice(0, 4),
            subtitle: volumeInfo.subtitle || 'No subtitle available.',
            thumbnail: src,
            title: volumeInfo.title
        }
    })
    // console.log(books);
    return books
}
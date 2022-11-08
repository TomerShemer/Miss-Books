import booksApp from './views/books-app.cmp.js'
import homePage from './views/home-page.cmp.js'
import aboutPage from './views/about-page.cmp.js'
import bookDetails from './views/book-details.cmp.js'
import bookAdd from './views/book-add.cmp.js'
import aboutTeam from './views/about-team.cmp.js'
import aboutContact from './views/about-contact.cmp.js'

const { createRouter, createWebHashHistory } = VueRouter

const routerOptions = {
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: homePage
        },
        {
            path: '/book',
            component: booksApp
        },
        {
            path: '/book/:id',
            component: bookDetails
        },
        {
            path: '/about',
            component: aboutPage,
            children: [
                {
                    path: 'team',
                    component: aboutTeam
                },
                {
                    path: 'contact',
                    component: aboutContact
                },
            ]
        },
        {
            path: '/add-book',
            component: bookAdd
        }
    ]
}

export const router = createRouter(routerOptions)

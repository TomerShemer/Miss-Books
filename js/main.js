const { createApp } = Vue
const { createRouter, createWebHashHistory } = VueRouter

import booksApp from './views/books-app.cmp.js'
import homePage from './views/home-page.cmp.js'
import aboutPage from './views/about-page.cmp.js'
import bookDetails from './views/book-details.cmp.js'

import appHeader from './cmps/app-header.cmp.js'
import appFooter from './cmps/app-footer.cmp.js'
import userMsg from './cmps/user-msg.cmp.js'


//CMPS IMPORTS
const options = {
    template: `
            <app-header />
            <user-msg />
            <router-view />
            <app-footer />
        `,
    data() {
        return {

        }
    },
    methods: {
    },
    computed: {
    },
    components: {
        appHeader,
        appFooter,
        userMsg
    }
}

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
            component: aboutPage
        },
    ]
}

const app = createApp(options)
const router = createRouter(routerOptions)

app.use(router)
app.mount('#app')


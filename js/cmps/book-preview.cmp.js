export default {
    props: ['book'],
    template: `
        <section class="book-preview">
            <h2>{{book.title}}</h2>
            <h3>{{bookPrice}}</h3>
            <router-link :to="'/book/' + book.id">
                <button class="btn-black">Details</button>
            </router-link>
        </section>
    `,
    computed: {
        bookPrice() {
            const priceData = this.book.listPrice
            const price = new Intl.NumberFormat('he-IL', { style: 'currency', currency: `${priceData.currencyCode}` }).format(priceData.amount)
            return price
        }
    },
}
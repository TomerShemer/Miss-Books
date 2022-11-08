export default {
    props: [],
    template: `
        <section className="books-filter">
            <form @click.prevent="">

                <input 
                v-model="filterBy.txt"
                type="text"
                placeholder="Search" />
                
                <input 
                v-model="filterBy.fromPrice"
                type="number"
                placeholder="Min. price" />
                
                <input 
                v-model="filterBy.toPrice"
                type="number"
                placeholder="Max. price" />
            
                <button @click="filter">Filter</button>

                <router-link to="/add-book">
                    <button>Add new book</button>
                </router-link>

            </form>
        </section>
`,
    data() {
        return {
            filterBy: {
                txt: '',
                fromPrice: 0,
                toPrice: Infinity,
            }
        }
    },
    methods: {
        filter() {
            // console.log('this.filterBy', this.filterBy)
            if (!this.filterBy.toPrice) this.filterBy.toPrice = Infinity
            this.$emit('filtered', this.filterBy)
        }
    },
    computed: {
    },
}
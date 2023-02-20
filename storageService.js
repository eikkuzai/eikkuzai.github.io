import page from './pageObjectModel.js'

// initialize elements as null, we will get those later
let defaultExpenses = [
    {name: 'laina', elem: null, value: 519, type: 'static'},
    {name: 'auto', elem: null, value: 590, type: 'static'},
    {name: 'kauppa', elem: null, value: 350, type: 'static'},
    {name: 'netti', elem: null, value: 27, type: 'static'},
    {name: 'muut', elem: null, value: 64, type: 'static'},
    {name: 'viihde', elem: null, value: 26, type: 'static'}
]

let store = {
    state: {},
    isEmptyLocalStorage: () => {
        return Object.keys(localStorage).length === 0
    },
    isEmptyStore: () => {
        return Object.keys(store.state).length === 0
    },
    init: () => {

        // Empty so we need to set defaults
        if (store.isEmptyLocalStorage()) {

            // Reinit defaultExpenses with elem populated (grab from POM by name)
            // Only store the innerHTML of the element reference because we cant store the actual DOM element in there,
            // we can then use th innerHTML to "revive" the elements...
            const defaultExpensesWithElements = defaultExpenses.map(e => {
                return {
                    name: e.name,
                    value: e.value,
                    elemHtml: Object.values(page.texts.staticExpenses).filter(v => v.name == e.name)[0].elem.innerHTML,
                    type: e.type
                }
            })

            // Save final default expenses into localStorage and local store
            defaultExpensesWithElements.forEach(e => {
                store.save(e.name, e)
            })

            console.log("Store defaults populated")
        } else {
            console.log("Load existing")
            // Load localStorage contents into local state
            for (const [key, value] of Object.entries(localStorage)) {
                console.log(key, value);
                store.state[key] = JSON.parse(value)
            }
        }

        console.log("Store initialized:" + JSON.stringify(store.state))
    },
    save: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
        store.state[key] = value
    },
    get: (key) => {
        return JSON.parse(localStorage.getItem(key))
    },
    delete: (key) => {
        localStorage.removeItem(key)
        delete store.state[key]
    },
    clearAll: () => {
        store.state = {}
        localStorage.clear()
    },
    // Shorthand for delete and save
    update: (key, value) => {
        store.delete(key)
        store.save(key, value)
    }
}

export default store
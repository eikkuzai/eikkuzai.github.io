// Util function to create custom expenses
function createCustomExpense(name, value, category) {
    return {
        name: name,
        value: value,
        elem: document.querySelector('#' + name),
        type: 'custom',
        category: category
    }
}

const categoryIconMap = {
    'Laina/Vastike': '🏠',
    'Auto/Bensa': '🚗',
    'Kauppa': '🥩',
    'Netti': '💻',
    'Muut kulut': '😮',
    'Viihde': '📺'
}

const utils = {
    createCustomExpense,
    categoryIconMap
}

export default utils
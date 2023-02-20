"use strict";

const staticExpenseSelectors = ['#laina', '#auto', '#kauppa', '#netti', '#muut', '#viihde']

// Use the predictable format of static expense selectors to programmatically
// generate the easy-access pom objects
function generateStaticExpenseEditHtml() {
    staticExpenseSelectors.forEach(s => {
        let withoutHash = s.split('#')[1];
  
        document.querySelector('div.' + withoutHash + '-edit-container')
        .insertAdjacentHTML('afterbegin',`<span id="${withoutHash}-edit-button">
            <i class="fas fa-edit"></i>
        </span>
        <input class="hide" type="number" pattern="[0-9]*" id="${withoutHash}-edit-input" value="">
        <button class="hide" id="${withoutHash}-edit-save-button">Lisää</button>`)
    })
}

// Store references to elements on the page for easy access 
export const page = {
    init: generate,
    inputs: {
        totalBudget: document.querySelector('#total-budget-input'),
        totalSavings: document.querySelector('#total-savings-input'),
        customExpenseName: document.querySelector('#custom-expense-name-input'),
        customExpenseAmount: document.querySelector('#custom-expense-amount-input'),
        staticExpenseEdit: null
    },
    buttons: {
        totalBudget: document.querySelector('#total-budget-button'),
        totalSavings: document.querySelector('#total-savings-button'),
        customExpense: document.querySelector('#custom-expense-button'),
        clearMonth: document.querySelector('#clearMonth'),
        staticExpensesEdit: null,
        staticExpensesSave: null
    },
    selects: {
        expenseCategory: document.querySelector('#expense-categories-select')
    },
    texts: {
        ongoingBudget: document.querySelector('#budget-amount'),
        ongoingBalance: document.querySelector('#balance-amount'),
        ongoingSavingsAcc: document.querySelector('#saastotili-amount'),
        staticExpenses: null
    },
    lists: {
        expenses: document.querySelector('#expenses-list')
    }
}

function generate() {
    generateStaticExpenseEditHtml()

    // And then map so that the elements actually might exist in DOM
    page.texts.staticExpenses = staticExpenseSelectors.map(s => {
        return {
            name: s.split('#')[1],
            elem: document.querySelector(s)
        }
    })

    page.buttons.staticExpensesEdit = staticExpenseSelectors.map(s => {
        return {
            name: s.split('#')[1],
            elem: document.querySelector(s + '-edit-button')
        }
    })

    page.buttons.staticExpensesSave = staticExpenseSelectors.map(s => {
        return {
            name: s.split('#')[1],
            elem: document.querySelector(s + '-edit-save-button')
        }
    })

    page.inputs.staticExpenseEdit = staticExpenseSelectors.map(s => {
        return {
            name: s.split('#')[1],
            elem: document.querySelector(s + '-edit-input')
        }
    }) 
}



export default page
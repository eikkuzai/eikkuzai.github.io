'use strict';

import page from './pageObjectModel.js'
import store from './storageService.js'
import utils from './utils.js'

window.onload = () => {

    // Initialize POM 
    page.init();

    setTimeout(() => {
        // delay store init a bit so page and POM is done
        store.init();
        populateStaticExpenses();
        populateCustomExpenses();
        populateTexts();
        registerHandlers();
        
        // calc weekly balance if budget exists 
        if (!Number.isNaN(parseInt(store.get('budget')))) {
            updateWeeklyBalance();
        }

    }, 150)
}

function updateWeeklyBalance(expense) {
    
    const budgetTotal = parseInt(store.get('budget'));
    const savings = parseInt(store.get('savings'));

    // Use valueof to copy the budget value from store into new variable
    let netBudget = budgetTotal.valueOf()

    // Grab out the static expense values from the store
    const staticExpenseValues = Object.values(store.state).filter(i => i.type === 'static').map(e => e.value)

    let staticTotal = 0;
    staticExpenseValues.forEach(v => staticTotal += v)

    // Subtract static expenses from the total budget
    netBudget = budgetTotal - staticTotal
    // Subtract savings
    netBudget = netBudget - savings

    // If expense was passed we need to consider it in the calculation
    if (expense && !Number.isNaN(expense)) {
        netBudget = netBudget - expense
    }

    const splitToFourWeeks = netBudget / 4;

    // Update DOM
    page.texts.ongoingBalance.innerText = splitToFourWeeks + ' €'
    refreshDomValues()
}

function refreshDomValues() {
    populateCustomExpenses()
    populateStaticExpenses()
    populateTexts()
}

// Populate static expenses from store
function populateStaticExpenses() {

    const staticExpenses = Object.values(store.state).filter(o => o.type === 'static')

    for (const expense of staticExpenses) {
        const found = page.texts.staticExpenses.find(se => se.name == expense.name)
        found.elem.innerHTML = expense.value
    }
}

// Populate other texts like savings + balance from store
function populateTexts() {
    const budgetValue = store.get('budget')
    const savingsValue = store.get('savings')

    if (budgetValue) page.texts.ongoingBudget.innerText = budgetValue
    if (savingsValue) page.texts.ongoingSavingsAcc.innerText = savingsValue
}

// Populate custom expenses from store
function populateCustomExpenses() {
    // Clear list first
    page.lists.expenses.innerHTML = ""

    const customExpenses = Object.values(store.state).filter(o => o.type === 'custom')
    for (const expense of customExpenses) {

        const list = page.lists.expenses
        const newLi = document.createElement('li')
        const expenseIcon = utils.categoryIconMap[expense.category]
        newLi.innerHTML = expenseIcon + ' ' + expense.name + ': ' + expense.value + '€ '
        list.appendChild(newLi)

        // Add delete button
        const deleteBtn = document.createElement('i')
        deleteBtn.classList.add('fas', 'fa-trash-alt')
        newLi.appendChild(deleteBtn)

        // handle delete click
        deleteBtn.addEventListener('click', () => {
          newLi.remove()
          store.delete(expense.name)
          updateWeeklyBalance()
        })

    }
}

//Register all the click handlers etc..
function registerHandlers() {

    page.buttons.clearMonth.addEventListener('click', (event) => {
        store.clearAll()
        location.reload()
        alert('Luvut nollattu!')
    });

    page.buttons.customExpense.addEventListener('click', (event) => {
        const customExpenseName = page.inputs.customExpenseName.value
        const customExpenseAmount = page.inputs.customExpenseAmount.value
        const customExpenseCategory = page.selects.expenseCategory.options[page.selects.expenseCategory.options.selectedIndex].value

        // Store + populate to DOM and update balance - not very nice because this means all the expenses will be repopulated 
        store.save(customExpenseName, utils.createCustomExpense(customExpenseName, customExpenseAmount, customExpenseCategory))
        populateCustomExpenses()
        updateWeeklyBalance(customExpenseAmount)
    })

    page.buttons.staticExpensesEdit.forEach(se => {
        se.elem.addEventListener('click', (event) => {
            // Need to show the clicked expenses corresponding input/save button and hide the edit
            const prefix = "#" + se.name + "-"
            document.querySelector(prefix + 'edit-input').classList.remove('hide')
            document.querySelector(prefix + 'edit-save-button').classList.remove('hide')
            se.elem.classList.add('hide')
        })
    })

    page.buttons.staticExpensesSave.forEach(se => {
        se.elem.addEventListener('click', (event) => {
            // Now instead we show the edit button and hide edit input/save
            const prefix = "#" + se.name + "-"
            const editInputElem = document.querySelector(prefix + 'edit-input')

            editInputElem.classList.add('hide')
            document.querySelector(prefix + 'edit-save-button').classList.add('hide')
            document.querySelector(prefix + 'edit-button').classList.remove('hide')

            // Do some actual saving
            store.update(se.name, editInputElem.value)
        })
    })

    page.buttons.totalBudget.addEventListener('click', (event) => {
        const input = page.inputs.totalBudget
        const newBudget = input.value
        page.texts.ongoingBudget.innerText = newBudget

        // Use update to overwrite any existing budget
        store.update('budget', newBudget)
        updateWeeklyBalance()
    
        // Cleanup
        input.value = null;
    })

    page.buttons.totalSavings.addEventListener('click', (event) => {
        const input = page.inputs.totalSavings
        const newSavings = input.value
        page.texts.ongoingSavingsAcc.innerText = newSavings

        // Use update to overwrite any existing savings
        store.update('savings', newSavings)
        updateWeeklyBalance()

        // Cleanup
        input.value = null;
    })
}



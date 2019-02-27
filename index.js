
const BOOKS_URL = "http://localhost:3000/books"
const bookListEl = document.querySelector('#list-panel')
const bookShowEl = document.querySelector('#show-panel')
const USER = { "id": 1, "username": "pouros" }

document.addEventListener("DOMContentLoaded", function() {
    displayBookList()
});

function fetchBooks() {
    return fetch(BOOKS_URL)
        .then(res => res.json())
}

function writeBookRow(book) {
    const bookRowEl = document.createElement('li')
    bookRowEl.innerText = book.title
    bookListEl.append(bookRowEl)
    bookRowEl.addEventListener('click', () => {
        showBook(book)
    })
}

function writeBookRows(books) {
    for (const book of books) { writeBookRow(book) }
}

function displayBookList() {
    bookListEl.innerHTML = ''
    fetchBooks()
        .then(writeBookRows)
}

function showBook(book) {
    const bookEl = document.createElement('div')
    bookEl.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.img_url}">
        <p>${book.description}</p>
        <h4>USERS:</h4>
        `
    book.users.forEach(user => {
        bookEl.innerHTML += `<h4>${user.username}</h4>`
    })

    bookEl.innerHTML += `<button type="button">${checkUserSubscribed(book) ? 'Un-read Book' : 'Read Book'}</button>`
    const btnEl = bookEl.querySelector('button')
    btnEl.addEventListener('click', () => {
        subscribe(book)
            .then(showBook)
    })

    bookShowEl.innerHTML = ''
    bookShowEl.append(bookEl)
}

function subscribe(book) {
    if (!checkUserSubscribed(book)) {
        book.users.push(USER)
    } else {
        book.users = book.users.filter(function(value){
            return value.id != USER.id
        })
    }
    const url = (BOOKS_URL + `/${book.id}`)
    const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    }
    return fetch(url, options)
        .then(res => res.json())
}

function checkUserSubscribed(book) {
    return book.users.find(function(user) { 
        return user.id === USER.id 
    })
}
const BASE_URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {
})

function renderRandomWord() {
    let wordDisplay = document.querySelector("#word-display")
    fetch(`${BASE_URL}/words`)
    .then(resp => resp.json())
    .then(words => {
        let randomWord = words[Math.floor(Math.random() * words.length)]
        let wordsHTML =
            `
            <h1>${randomWord.name}</h1>
            `
        wordDisplay.innerHTML = wordsHTML
    })
}

function clearBody() {
    document.querySelector("#word-display").innerHTML = ""
    document.querySelector("#game-display").innerHTML = ""
}

function createUserForm() {
    clearBody()
    let userForm = document.getElementById("user-form")

    userForm.innerHTML += 
    `   <br>
        <form>
            Username: <input type="text" id="username">
            <input type="submit" value="Create User">
        </form>
    `
    userForm.addEventListener("submit", userFormSubmission)
}

function userFormSubmission() {
    event.preventDefault();
    let username = document.getElementById("username").value
    let user = {
        username: username, 
        points: 0
    }

    fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(user => {
        let u = new User(user.id, user.username, user.points)
        u.newUserGreeting()
    })
}

function fetchUsers() {
    clearBody()
    let usersContainer = document.querySelector("#users-container")
    fetch(`${BASE_URL}/users`)
    .then(resp => resp.json())
    .then(users => {
        for (const user of users) {
            let u = new User(user.id, user.username, user.points)
            usersContainer.innerHTML +=
            `
            <ul>
            <li> Username: ${u.username} - Points: ${u.points} </li>
            </ul>
            `
        }
    })
}

function renderWordInput() {
    let gameDisplay = document.querySelector("#game-display")

    gameDisplay.innerHTML += 
    `   <br>
        <form>
            Type your words here: <input type="text" id="word-name">
            <input type="submit" value="Submit Word">
        </form>
    `
}

function createGame() {
    clearBody()
    renderRandomWord()
    renderWordInput()
}

function userWordInput() {
    
}

document.querySelector("#new-game").addEventListener("click", createGame)
document.querySelector("#user-bttn").addEventListener("click", createUserForm)
document.querySelector("#all-users-bttn").addEventListener("click", fetchUsers)

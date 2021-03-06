const BASE_URL = "http://localhost:3090"

document.addEventListener("DOMContentLoaded", () => {
})

function fetchRandomWord() {
    let wordDisplay = document.querySelector("#word-display")

    fetch(`${BASE_URL}/words`)
    .then(resp => resp.json())
    .then(words => {
        const bigWords = []
        for (const word of words) {
            let letters = word.name.split('')
            let letterCount = letters.length
            if (letterCount > 6) {
                bigWords.push(word) 
            }
        }

            let randomWord = bigWords[Math.floor(Math.random() * bigWords.length)]
            let currentGame = document.getElementById("current-game")
            let currentGameId = currentGame.getAttribute('data-id')
            let w = new Word(randomWord.id, randomWord.name, currentGameId)
            w.renderRandomWord()
        })

    }

function clearBody() {
    document.querySelector("#word-display").innerHTML = ""
    document.querySelector("#game-display").innerHTML = ""
    document.querySelector("#user-form-container").innerHTML = ""
}

function createUserForm() {
    clearBody()
    let userForm = document.getElementById("user-form-container")

    userForm.innerHTML += 
    `   
        <br>
        <form id="user-form">
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
        if (user.username != "can't be blank") {
            let u = new User(user.id, user.username, user.points)
            u.newUserGreeting()
        } else {
            alert("Username can't be blank!")
        }
    })
    
    document.getElementById("user-form").reset();
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
    `   <div id="word-form-container">
        <form id="word-form">
            Type your words here: <input type="text" id="word-name" onfocus="this.value=''">
            <input type="submit" value="Submit Word">
        </form>
        </div>
        <div id="user-words-display">

        </div>
    `

    let wordForm = document.querySelector("#word-form-container")
    wordForm.addEventListener("submit", wordFormSubmission)

}
    
function startNewGame() {
    clearBody()
    createGame()
}

function createGame() {
    let currentUser = document.getElementById("current-user")
    let currentUserId = currentUser.getAttribute('data-id')
    fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            game_number: currentUserId,
            user_id: currentUserId
        })
    })
    .then(resp => resp.json())
    .then(game => {
        let g = new Game(game.id, game.game_number, game.user.id)
        g.renderGame()
        fetchRandomWord()
        renderWordInput()
    })

}

function wordFormSubmission() {
    event.preventDefault();
    let name = document.getElementById("word-name").value
    let currentGame = document.getElementById("current-game")
    let currentGameId = currentGame.getAttribute('data-id')
    let word = {
        name: name,
        game_id: currentGameId
    }

    fetch(`${BASE_URL}/words`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(word)
    })
    .then(resp => resp.json())
    .then(word => {
        if (word.id) {
            let w = new Word(word.id, word.name, word.game.id)  
            w.renderNewWord()  
        } else {
            alert("That is not a valid word!")
        }
            
    })

    document.getElementById("word-form").reset();

}

function fetchValidWords() {
    let bigWord = document.getElementById("big-word")
    let bigWordId = bigWord.getAttribute('data-id')
    let bigWordValidWords = []
    fetch(`${BASE_URL}/valid_words`)
    .then(resp => resp.json())
    .then(validWords => {
        for (const validWord of validWords) {
            let vw = new ValidWord(validWord.id, validWord.name, validWord.word.id)
            if (validWord.word.id == bigWordId) {
                bigWordValidWords.push(validWord)
            }
        }
        console.log("valid words in fetch", bigWordValidWords)
    })

    return bigWordValidWords
}

function persistGameData() {
    let currentUser = document.getElementById("current-user")
    let currentUserId = currentUser.getAttribute('data-id')
    let username = document.querySelector("#user-id").innerHTML
    let points = document.querySelector("#user-points").innerHTML

    let user = {
        username: username,
        points: points
    }

    fetch(`${BASE_URL}/users/${currentUserId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(user => user)  
}

function renderInstructions() {
    alert("Welcome to WordFinder!\n\nClick New User, enter a username, then click Create User. Click Start New Game to start a new game.\n\nA word will appear on the page and you enter words, one at a time, that can be formed from that word. You will get points for each valid word that you enter. A word is valid if it is at least 4 letters, is only formed from letters found in the published word, and each letter in the published word is used only once.\n\nScoring:\n4 letter words = 1 point each\n5 letter words = 2 points each\n6 letter words = 3 points each\n\nGuess as many words as you can, then start a new game to get more points.\n\nGood luck!")
}

document.querySelector("#instructions").addEventListener("click", renderInstructions)
document.querySelector("#new-game").addEventListener("click", startNewGame)
document.querySelector("#user-bttn").addEventListener("click", createUserForm)
document.querySelector("#all-users-bttn").addEventListener("click", fetchUsers)

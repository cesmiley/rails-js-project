class Word {
    constructor(id, name, game_id) {
        this.id = id;
        this.name = name;
        this.game_id = game_id;
    }

    renderRandomWord() {
        let wordDisplay = document.querySelector("#word-display")
        let wordsHTML = 
        `
        <div id="big-word" data-id=${this.id}>
        <h1>${this.name}</h1>
        </div>
        `

        wordDisplay.innerHTML += wordsHTML
    }

    renderNewWord() {
        let wordsDisplay = document.querySelector("#user-words-display")
        let bigWordValidWords = fetchValidWords()
        debugger;

        if (bigWordValidWords.includes(this)) {
            wordsDisplay.innerHTML += 
            `
            <ul>
            <li id="${this.game_id}">${this.name}</li>
            </ul>
            `
        } else {
            console.log("error!!!!")
        }
    }
    // game_id is undefined

}
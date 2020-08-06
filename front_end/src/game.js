class Game {
    constructor(id, game_number, user_id) {
        this.id = id;
        this.game_number = game_number;
        this.user_id = user_id;
    }
    
    renderGame() {
        let gameDisplay = document.querySelector("#game-display")
        gameDisplay.innerHTML += 
        `
        <div id="current-game" data-id=${this.id}>
        Game Points: 0 / Total Words: 0
        <p>
        </div>
        `
    }
}
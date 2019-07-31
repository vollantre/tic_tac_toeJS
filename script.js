const Gameboard = (function(){
    let cells = document.querySelectorAll('.cell');

    let addMark = function(cell, char){
        cell.innerText = char;
    }

    let clear = function(){
        cells.forEach((cell) => {
            cell.innerText = '';
            cell.setAttribute('onclick', 'Game.makeMove(this)')
        });
    }

    let isFull = function(){
        return Array.from(cells).every(cell => cell.innerText != '');
    }

    let blockMove = function(){
        cells.forEach((cell) => {
            cell.setAttribute('onclick', 'Game.block()');
        });
    }

    return {addMark, blockMove, clear, isFull}
})();

const Player = function(name, char){
    this.name = name;
    let character = char;

    let positions = [];

    let addPosition = function(pos){
        positions.push(pos);
    }

    let getName = function(){
        return name;
    }

    let getPositions = function(){
        return positions;
    }

    let getChar = function(){
        return character;
    }

    let clearPositions = function(){
        positions = [];
    }

    return {addPosition, clearPositions, getPositions, getChar, getName}
}

const Game = (function(){

    let X;
    let O;

    let message = document.querySelector(".message");

    let currentPlayer = X;

    let switchTurn = function(){
        currentPlayer = (currentPlayer == X ? O : X);
    }

    let winCombos = [[0,1,2],[3,4,5],[6,7,8],
                     [0,3,6],[1,4,7],[2,5,8],
                     [0,4,8],[6,4,2]];

    let checkForLine = function(){
        return winCombos.some((combo) => {
            return combo.every((e) => {
                return currentPlayer.getPositions().includes(e);
            });
        });
    }

    let askName = function(char) {
        let name = prompt(`Who is gonna be ${char}?`)
        while(name == null || name == '') {
            name = prompt(`Who is gonna be ${char}?`)
        }
        return name;
    }

    let endGame = function(){
        Gameboard.blockMove();
        if(checkForLine()){
            message.innerText = `Congratz ${currentPlayer.getName()} you're the winner`;
        }else{
            message.innerText = "It's a tie, there's no winner."
        }
    }

    let makeMove = function(cell){
        if(cell.innerText == ''){
            Gameboard.addMark(cell, currentPlayer.getChar());
            currentPlayer.addPosition(Number(cell.id));
            if(checkForLine() || Gameboard.isFull()){
                endGame();
            }else{
                switchTurn();
                displayTurn();
            }
            
        }else{
            message.innerText = "Select an empty spot";
        }
    }

    let displayTurn = function() {
        message.innerText = `${currentPlayer.getName()}'s turn`;
    }

    let block = function() {
        message.innerText = 'restart the game to play again.'
    }

    let start = function(){
        let namex = askName("X");
        let nameo = askName("O");
        X = Player(namex, "X");
        O = Player(nameo, "O");
        Gameboard.clear();
        currentPlayer = X;
        X.clearPositions();
        O.clearPositions();
        displayTurn();
    }

    return {makeMove, start, block, displayTurn}
})();

Game.start();
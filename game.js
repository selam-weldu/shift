const speedDash = document.querySelector('.speedDash');
const scoreDash = document.querySelector('.scoreDash');
const lifeDash = document.querySelector('.lifeDash');
const container = document.getElementById('container');
const btnStart = document.querySelector('.btnStart');
btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', pressKeyOn);
document.addEventListener('keyup', pressKeyOff);


let animationGame;
let gamePlay = false;
let player;
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

function startGame() {
    console.log(gamePlay);
    btnStart.style.display = 'none';
    let div = document.createElement('div');
    div.setAttribute('class', 'playerCar');
    div.x = 250;
    div.y = 500;
    container.appendChild(div);
    gamePlay = true;
    animationGame = requestAnimationFrame(playGame);
    player = {
        ele: div,
        speed: 9,
        lives: 3,
        gameScore: 0,
        carstoPass: 10,
        score: 0,
        roadwidth: 250
    }
    startBoard();
}

function startBoard() {
    for (let x = 0; x < 13; x++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'road');
        div.style.top = (x * 50) + 'px';
        div.style.width = player.roadwidth + 'px';
        container.appendChild(div);
    }
}

function pressKeyOn(event) {
    event.preventDefault();
    console.log(keys);
    keys[event.key] = true;
}



function pressKeyOff(event) {
    event.preventDefault();
    console.log(keys);
    keys[event.key] = false;
}

function updateDash() {
    //console.log(player);  
    scoreDash.innerHTML = player.score;
    lifeDash.innerHTML = player.lives;
    speedDash.innerHTML = player.speed;
}
function playGame() {
    if (gamePlay) {
        updateDash();
        ///Movement
        if (keys.ArrowUp) {
            player.ele.y -= 1;
            player.speed = player.speed < 20 ? (player.speed + 0.05) : 20;
        }
        if (keys.ArrowDown) {
            player.ele.y += 1;
            player.speed = player.speed > 0 ? (player.speed - 0.2) : 0;
        }
        if (keys.ArrowRight) {
            player.ele.x += (player.speed / 4);
        }
        if (keys.ArrowLeft) {
            player.ele.x -= (player.speed / 4);
        }

        ///move car
        // player.ele.style.top = player.ele.y + 'px';
        // player.ele.style.left = player.ele.x + 'px';
    }
    animationGame = requestAnimationFrame(playGame);
}
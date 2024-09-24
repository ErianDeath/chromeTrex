const dino = document.querySelector('.dino');
const ground = document.querySelector('.ground');
const score = document.getElementById('score');
const game = document.querySelector('.game');
let isJumping = false;
let isGameover = false;
let isGameStarted = false;

function keydown(e) {
    if (e.code === 'Space') {
        if (isGameover) {
            resetGame();
        }
        else if (!isGameStarted) {
            startGame();
        }
        else if (!isJumping) {
           jump();
        }
    }
}

window.addEventListener('keydown', function(e) {
    keydown(e);
    //console.log(e.code);
});

const gameStartText = document.getElementById('game-start');
function startGame() {
    isGameStarted = true;
    gameOverText.style.display = 'none';
    gameStartText.style.display = 'none';
    game.style.animationPlayState = 'running';
    generateCactus();
}

let position = 0;
let count = 0;
function jump() {
    if (isJumping || isGameover || !isGameStarted) return;
    isJumping = true;

    let jumpInterval = setInterval(function() {
        if (isGameover) {
            clearInterval(jumpInterval);
            return;
        }
        
        if (count >= 15) {
            clearInterval(jumpInterval);
            // move down
            let downInterval = setInterval(function() {
                if (isGameover) {
                    clearInterval(downInterval);
                    return;
                }
                
                if (count <= 0 || position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    position = 0;
                    dino.style.bottom = position + 'px';
                } else {
                    position -= 5;
                    position *= 0.9;
                    count--;
                    dino.style.bottom = position + 'px';
                }
            }, 20)
        }
        // move up
        else {
            position += 20;
            position *= 0.9;
            count++;
            dino.style.bottom = position + 'px';
        }
    }, 20)
}

let displayScore = 0;
let cactusTimers = [];

function updateScore() {
    if (!isGameover && isGameStarted) {
        displayScore++;
        score.textContent = displayScore;
    }
}

let lastCactusPosition = 0;
let minDistGap = 300;
function generateCactus() {
    if (isGameover || !isGameStarted) return;

    const gameWidth = game.offsetWidth;
    let cactusPosition = gameWidth;
    let randomTime = Math.random() * 3000 + 1000;

    if (cactusPosition - lastCactusPosition< minDistGap) {
        cactusPosition = lastCactusPosition + minDistGap + gameWidth / 2;
    }

    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    ground.appendChild(cactus);

    cactus.style.left = cactusPosition + 'px';

    let cactusInterval = setInterval(function() {
        if (cactusPosition < -60) {
            clearInterval(cactusInterval);
            ground.removeChild(cactus);
            updateScore();
        }
        else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
            clearInterval(cactusInterval);
            gameOver();
            //document.body.innerHTML = '<h1 class="game-over">Game Over</h1>';
        }
        else {
            cactusPosition -= 10;
            cactus.style.left = cactusPosition + 'px';
            lastCactusPosition = cactusPosition;
        }
    }, 20)

    cactusTimers.push(cactusInterval);

    if (!isGameover) {
        setTimeout(generateCactus, randomTime);
    }
}
generateCactus();

const gameOverText = document.getElementById('game-over');
function gameOver() {
    isGameover = true;
    isGameStarted = false;
    game.style.animationPlayState = 'paused';
    //console.log('Animation state:', document.querySelector('.game').style.animationPlayState); 
    
    gameOverText.style.display = 'block';

    cactusTimers.forEach(timer => clearInterval(timer));
    cactusTimers = [];
}

function resetGame() {
    const cactus = document.querySelectorAll('.cactus');
    cactus.forEach(cacti => cacti.remove());

    isGameover = false;
    isJumping = false;
    isGameStarted = true;

    game.style.animationPlayState = 'running';
    displayScore = 0;
    score.textContent = displayScore;
    position = 0;
    count = 0;
    dino.style.bottom = position + 'px';

    gameOverText.style.display = 'none';

    generateCactus();
}
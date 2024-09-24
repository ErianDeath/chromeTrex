const dino = document.querySelector('.dino');
const ground = document.querySelector('.ground');
const score = document.getElementById('score');
const game = document.querySelector('.game');
let isJumping = false;
let isGameover = false;

function keydown(e) {
    if (e.code === 'Space') {
        if (!isJumping) {
           jump();
        }
    }
}

window.addEventListener('keydown', function(e) {
    keydown(e);
    //console.log(e.code);
});

let position = 0;
let count = 0;
function jump() {
    if (isJumping || isGameover) return;
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
    if (!isGameover) {
        displayScore++;
        score.textContent = displayScore;
    }
}

function generateCactus() {
    if (isGameover) return;

    const gameWidth = game.offsetWidth;
    let cactusPosition = gameWidth;
    let randomTime = Math.random() * 3000 + 1000;

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
    game.style.animationPlayState = 'paused';
    //console.log('Animation state:', document.querySelector('.game').style.animationPlayState); 
    
    gameOverText.style.display = 'block';

    cactusTimers.forEach(timer => clearInterval(timer));
    cactusTimers = [];
    
    window.addEventListener('keydown', handleReset);
}

function handleReset(e) {
    if (e.code === 'Space' && isGameover) {
        resetGame();
        window.removeEventListener('keydown', handleReset);
    }
}

function resetGame() {
    const cactus = document.querySelectorAll('.cactus');
    cactus.forEach(cacti => cacti.remove());

    isGameover = false;
    isJumping = false;

    game.style.animationPlayState = 'running';
    displayScore = 0;
    score.textContent = displayScore;
    position = 0;
    count = 0;
    dino.style.bottom = position + 'px';

    gameOverText.style.display = 'none';

    generateCactus();
}
let start = true

const canvas = document.getElementById('canvas');
const canvasWidth = canvas.getBoundingClientRect().width;
const canvasHeight = canvas.getBoundingClientRect().height;

const stuff_width = document.getElementById('stuff').getBoundingClientRect().width
const butt_width = document.getElementById('pause').getBoundingClientRect().width

const MenuContent = document.getElementById('MenuContent');
const instructions = document.getElementById('instruction');

const menu = document.getElementById('menu');
menu.style.transform = `translate(${canvasWidth / 2 - 100}px, ${canvasHeight / 2 - 150}px)`
menu.style.position = "absolute";

const score = document.getElementById('score');
const level = document.getElementById('level');
scoreCount = 0;
levelCount = 1;
// level.textContent = `Level: ${levelCount}`;


let myTimer = 0;
let timerInterval;
const Timer = document.getElementById('timer')
function startTimer() {
    myTimer++
    Timer.textContent = `Time: ${Math.floor(myTimer / 60)}s`;
}

function resetTimer() {
    myTimer = 0;
    Timer.textContent = `Time: ${myTimer}s`;
}

// Ship setup
const ship = document.getElementById('ship');
const shipObject = {
    x: canvasWidth / 2 - ship.offsetWidth / 2,
    y: canvasHeight - ship.offsetHeight,
    width: ship.offsetWidth,
    height: ship.offsetHeight,
    dx: AdapteVitesse(canvasWidth, 6, 'ship'),
    draw: function () {
        ship.style.transform = `translate(${this.x}px, ${this.y}px)`;
        ship.style.width = `${this.width}px`;
        ship.style.height = `${this.height}px`;
        ship.style.position = "absolute";
    },
    moveLeft: function () {
        this.x = Math.max(this.x - this.dx, butt_width + 50);
        this.draw();
    },
    moveRight: function () {
        this.x = Math.min(this.x + this.dx, canvasWidth - this.width - stuff_width - 50);
        this.draw();
    }
};


// Enemies setup
const enemies = document.getElementById('Enemies');
let enemiesArray = [];
const enemyWidth = 50;
const enemyHeight = 50;
let enemyRowCount = 3;
let enemyColumnCount = AdapteEnemyNumber();

const Enemies_Container = {
    x: butt_width,
    y: 0,
    width: enemyColumnCount * enemyWidth,
    height: enemyRowCount * enemyHeight,
    dx: AdapteVitesse(canvasWidth, 2, 'enemies'),
    draw: function () {
        enemies.style.width = `${this.width}px`;
        enemies.style.height = `${this.height}px`;
        enemies.style.position = "absolute";
        enemies.style.transform = `translate(${this.x}px, ${this.y}px)`;
    },
};

function AdapteEnemyNumber() {
    if (canvasWidth <= 320) {
        return 4
    } else if (canvasWidth < 769) {
        return 5
    }
    return 10
}

function AdapteVitesse(canvasWidth, vitess, content) {
    if (canvasWidth < 769) {
        if (content == 'enemies') {
            return 1
        }
    }
    return vitess
}

const Win_Win = document.getElementById('win_win')
Win_Win.style.transform = `translate(${canvasWidth / 2 - 100}px, ${canvasHeight / 2 - 150}px)`
function Win() {
    Win_Win.style.display = 'flex'
    start = false
    resetGame()
}

function createEnemies() {
    enemiesArray.length = 0;
    enemies.innerHTML = '';

    for (let row = 0; row < enemyRowCount; row++) {
        for (let col = 0; col < enemyColumnCount; col++) {
            const enemy = document.createElement('img');
            enemy.src = "enemy.png";
            enemy.alt = "enemy";
            enemy.className = "alien";
            enemy.style.position = 'absolute';
            enemy.style.width = `${enemyWidth}px`;
            enemy.style.height = `${enemyHeight}px`;
            enemy.style.left = `${col * enemyWidth}px`;
            enemy.style.top = `${row * enemyHeight}px`;

            enemiesArray.push({
                element: enemy,
                x: col * enemyWidth - 50,
                y: row * enemyHeight,
                width: enemyWidth,
                height: enemyHeight,
                destroyed: false,
            });

            enemies.appendChild(enemy);
        }
    }
}

//move the enemies;
function moveEnemies() {
    Enemies_Container.x += Enemies_Container.dx;

    if (Enemies_Container.x > canvasWidth - Enemies_Container.width - stuff_width || Enemies_Container.x < butt_width) {
        Enemies_Container.dx *= -1;
        Enemies_Container.y += AdapteVitesse(canvasWidth, 50, 'enemies');
    }

    Enemies_Container.draw();
}

// Bullet setup
let bullets = [];
function createBullet() {
    if (start) {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.position = 'absolute';
        bullet.style.width = '2px';
        bullet.style.height = '10px';
        bullet.style.background = 'blue';
        bullet.style.border = '1px solid black';
        bullet.style.borderRadius = '5px';
        bullet.className = 'bullet'
        canvas.appendChild(bullet);

        bullets.push({
            element: bullet,
            x: shipObject.x + shipObject.width / 2 - 2,
            y: shipObject.y - 10,
            width: 5,
            height: 10,
            dy: -10,
        });
    }
}

function GameLost() {
    const lost1 = enemiesArray.some(enemy => enemy.y + Enemies_Container.y + enemy.height >= canvasHeight);
    const lost2 = enemiesArray.some(enemy =>
        enemy.x + Enemies_Container.x < shipObject.x + shipObject.width &&
        enemy.x + Enemies_Container.x + enemy.width > shipObject.x &&
        enemy.y + Enemies_Container.y < shipObject.y + shipObject.height &&
        enemy.y + Enemies_Container.y + enemy.height > shipObject.y
    );
    return lost1 || lost2;
}

function Clear() {
    bullets.forEach((bullet) => {
        if (bullet.element) {
            bullet.element.remove();
        }
    });
    bullets.length = 0;
    enemiesArray.forEach((enemy) => {
        enemy.element.remove();
    });
    enemiesArray.length = 0;
}


function moveBullets() {
    const containerX = Enemies_Container.x + butt_width;
    const containerY = Enemies_Container.y;

    const bulletsToRemove = [];
    const enemiesToRemove = new Set();

    bullets.forEach((bullet, bulletIndex) => {
        if (!bullet.element) return;

        bullet.y += bullet.dy;
        bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;

        if (bullet.y <= 0) {
            bulletsToRemove.push(bulletIndex);
            return;
        }

        enemiesArray.forEach((enemy, enemyIndex) => {
            if (enemy.destroyed) return;

            const enemyX = enemy.x + containerX;
            const enemyY = enemy.y + containerY;

            if (
                bullet.x < enemyX + enemy.width &&
                bullet.x + bullet.width > enemyX &&
                bullet.y < enemyY + enemy.height &&
                bullet.y + bullet.height > enemyY
            ) {
                bulletsToRemove.push(bulletIndex);
                enemiesToRemove.add(enemyIndex);

                scoreCount += 10;
                score.textContent = `Score: ${scoreCount}`;
            }
        });
    });

    // Remove bullets
    bullets = bullets.filter((bullet, index) => {
        if (bulletsToRemove.includes(index)) {
            if (bullet && bullet.element) {
                bullet.element.remove();
            }
            return false; // Exclude this bullet
        }
        return true; // Keep this bullet
    });

    enemiesArray = enemiesArray.filter((enemy, index) => {
        if (enemiesToRemove.has(index)) {
            enemy.destroyed = true;
            if (enemy.element) enemy.element.remove();
            return false; // Exclude from the array
        }
        return true; // Keep in the array
    });

    if (enemiesArray.length === 0) {
        enemyRowCount += 1;
        levelCount += 1;

        if (levelCount === 3) {
            Win();
        } else {
            level.textContent = `Level: ${levelCount}`;
            Enemies_Container.dx *= 2.1;
            Enemies_Container.y = 0;
            Enemies_Container.height = enemies.style.height = `${enemyRowCount * enemyHeight}px`;
            createEnemies();
        }
    }

    if (GameLost()) {
        Lives();
    }
}

//Lives
const LivesContainer = document.getElementById('lives')
const N = document.getElementById('num')
let Num = 3
function Lives() {
    Enemies_Container.x = butt_width
    Enemies_Container.y = 0
    if (Num === 1) {
        start = false;
        Clear();
        gameOver.style.display = 'flex';
    }
    Num--
    N.textContent = `${Num}`
}


// function ResetLives() {
//     LivesContainer.textContent = ''
//     for (let i = 0; i < 3; i++) {
//         const newLife = document.createElement('img');
//         newLife.src = "lives.png";
//         newLife.alt = "lives";
//         newLife.id = "heart";
//         LivesContainer.appendChild(newLife);
//     }
// }

//throttle
function throttle(func, delay) {
    let isWaiting = false;
    return function executedFunction(...args) {
        if (!isWaiting) {
            func.apply(this, args);
            isWaiting = true;
            setTimeout(() => {
                isWaiting = false;
            }, delay);
        }
    };
}
const shoot = throttle(createBullet, 300);


keys = {
    ArrowLeft: false,
    ArrowRight: false,
}


//try again button
const gameOver = document.getElementById('gameOver');
gameOver.style.transform = `translate(${canvasWidth / 2 - 100}px, ${canvasHeight / 2 - 150}px)`


function Events() {
    // Move ship with Arrows
    document.addEventListener('keydown', (e) => {
        if (start) {
            if (start) {
                if (e.key == "ArrowLeft") {
                    keys[e.key] = true
                } else if (e.key == "ArrowRight") {
                    keys[e.key] = true
                } else if (e.key === " ") {
                    shoot();

                }
            }
        }
        if (e.key == 'p') {
            if (!start) {
                menu.style.display = "none";
                start = true
            } else {
                menu.style.display = "table";
                start = false;
            }
        } else if (e.key == 'r') {
            resetGame();
            createEnemies();
            // ResetLives()
            menu.style.display = "none";
            gameOver.style.display = 'none'
            Win_Win.style.display = 'none'
            start = true;
        }
    });
    document.addEventListener('keyup', (e) => {
        if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
            keys[e.key] = false
        }
    })
    menu.addEventListener("click", (e) => {
        const button = document.getElementById(`${e.target.id}`);
        if (button.id === "instructions") {
            if (instructions.classList.contains("instruction")) {
                instructions.classList.remove("instruction");
                instructions.classList.add("instructionsBar");

            } else {
                instructions.classList.remove("instructionsBar");
                instructions.classList.add("instruction");

            }
        }
    })
}
Events();


//reset game
function resetGame() {
    Clear();
    scoreCount = 0;
    levelCount = 1;
    Num = 3
    // N.textContent = `${Num}`
    // score.textContent = `Score: ${scoreCount}`;
    // level.textContent = `Level: ${levelCount}`;
    enemyRowCount = 3;
    enemyColumnCount = AdapteEnemyNumber();
    Enemies_Container.x = butt_width;
    Enemies_Container.y = 0;
    Enemies_Container.dx = AdapteVitesse(canvasWidth, 2, 'enemies');
    Enemies_Container.height = enemies.style.height = `${enemyRowCount * enemyHeight}px`;
    resetTimer();
}

window.addEventListener('resize', () => {
    location.reload()
})
const v = document.getElementById('var')
let c = 1
// Game loop
let t = 0

function loop() {
    requestAnimationFrame(loop)
    if (start) {
        startTimer();

        if (keys.ArrowLeft) {
            shipObject.moveLeft()
        }
        if (keys.ArrowRight) {
            shipObject.moveRight()
        }
        moveBullets();
        moveEnemies();
    }

}

function Initialize() {
    createEnemies();
    shipObject.draw();
    requestAnimationFrame(loop)
}

Initialize()



const state = {
    Level: 1,
    gameActive: false,
    score: 0
};

document.addEventListener('DOMContentLoaded', () => {
    UpdateLives(0, state);
    Game(state.Level, state);
});

// Fix the Game function
export function Game(Level, state) {
    state.gameActive = true;
    document.getElementById('Level').innerHTML = `Level = ${Level}`;
    document.getElementById('score').innerHTML = `Score = ${state.score}`

    const game = document.getElementById('game');
    const game_width = game.getBoundingClientRect().width;
    const villans = document.getElementById('villans');
    const hero = document.getElementById('hero');

    // Clear previous game state
    villans.innerHTML = '';
    hero.innerHTML = '';

    // Initialize game elements
    CreateAliens(villans);
    CreateHero(hero);
    hero.style.transform = `translateX(${game_width / 2}px) translateY(${0}px)`;

    // Add event listener
    document.addEventListener('keydown', (e) => {
        MoveHero(e, game_width, hero, game, state);
    });

    // Start alien movement
    MoveAliens(hero, game_width, villans, state);
}

// Create The Aliens
export function CreateAliens(villans) {
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < 10; j++) {
            const alien = document.createElement('img');
            alien.classList.add('alien');
            alien.src = 'alien.png';
            alien.dataset.black = 'white'
            row.appendChild(alien);
        }
        villans.appendChild(row);
    }
}

// Move The Aliens
export function MoveAliens(hero, game_width, villans, state) {
    let alien_position_x = 0;
    let alien_position_y = 0;
    let Check = 0;
    const steep_x = 5 * state.Level;
    const steep_y = 10 * state.Level;
    let direction = 1;
    const rightedge = game_width - villans.getBoundingClientRect().width;

    function Move() {
        const hearts = Array.from(document.querySelectorAll('.hearts'));
        console.log("heart_lenght_after_reduce => ", hearts.length);
        if (!state.gameActive) return;

        if (alien_position_x >= rightedge) {
            direction = -1;
            Check++;
        } else if (alien_position_x <= 0) {
            direction = 1;
        }

        alien_position_x += direction * steep_x;

        if (Check == 3) {
            alien_position_y += steep_y;
            Check = 0;
        }

        villans.style.transform = `translateX(${alien_position_x}px) translateY(${alien_position_y}px)`;

        const alienBottom = villans.getBoundingClientRect().bottom;
        const heroTop = hero.getBoundingClientRect().top;

        if (alienBottom >= heroTop) {
            Pause(state)
            return;
        }

        requestAnimationFrame(Move);
    }

    Move();
}
//Pause
export function Pause(state) {
    state.gameActive = false 
    document.querySelector('#buttons').style.display = 'flex'
            const butts = document.querySelectorAll('button')
            butts.forEach((butt) => {
                butt.addEventListener('click', (e) => {
                    const choice = e.target.getAttribute('data-choice')
                    if (choice == 'C') {
                        console.log("Ana hna 1");
                        
                        UpdateLives(-1, state);
                    }else if (choice == 'R') {
                        console.log("Ana Hna 2");
                        
                        state.score = 0
                        UpdateLives(0, state);
                        state.Level = 1
                    }
                    document.querySelector('#buttons').style.display = 'none'
                    Game(state.Level, state)
                })
            })
}
// Create The Hero
export function CreateHero(hero) {
    const space_ship = document.createElement('img');
    space_ship.src = 'ship.png';
    space_ship.classList.add('hero');
    hero.appendChild(space_ship);
}

// Move The Hero
export function MoveHero(e, game_width, hero, game, state) {
    const space_ship = hero.querySelector('.hero');
    let hero_position_x = space_ship.getBoundingClientRect().left;
    const Infos_width = document.getElementById('Infos').getBoundingClientRect().width;
    const steep = 10;

    if (e.key === 'ArrowRight') {
        if (hero_position_x < game_width - space_ship.getBoundingClientRect().width) {
            hero_position_x += steep;
            hero.style.transform = `translateX(${hero_position_x}px)`;
        }
    } else if (e.key === 'ArrowLeft') {
        if (hero_position_x > Infos_width) {
            hero_position_x -= steep;
            hero.style.transform = `translateX(${hero_position_x}px)`;
        }
    } else if (e.key === ' ') {
        CreateLaser(hero, hero_position_x, game, state);
        return;
    }
}

// Create Laser
export function CreateLaser(hero, hero_position_x, game, state) {
    const laser = document.createElement('img');
    laser.src = 'laser.png';
    laser.classList.add('laser');

    const initialBottom = hero.getBoundingClientRect().top;
    laser.style.transform = `translateX(${hero_position_x}px) translateY(${initialBottom}px)`;

    game.appendChild(laser);

    MoveLaser(laser, hero, hero_position_x, state);
}

// Move Laser and Destroy The Aliens
export function MoveLaser(laser, hero, laser_position_x, state) {
    let laser_position_y = hero.getBoundingClientRect().top;

    function Move() {
        if (!state.gameActive) {
            laser.remove();
            return;
        }

        if (laser_position_y <= 0) {
            laser.remove();
            return;
        }

        const aliens = Array.from(document.querySelectorAll('.alien'));
        const laserRect = laser.getBoundingClientRect();

        for (let i = 0; i < aliens.length; i++) {
            // console.log(i);
            
            if (!aliens[i].isConnected || aliens[i].dataset.black == 'black') continue;

            const alienRect = aliens[i].getBoundingClientRect();
            if (
                laserRect.top <= alienRect.bottom &&
                laserRect.bottom >= alienRect.top &&
                laserRect.left <= alienRect.right &&
                laserRect.right >= alienRect.left
            ) {
                console.log(aliens[i],i);
                laser.remove();
                aliens[i].src = 'black.png'
                aliens[i].dataset.black = 'black'
                state.score += (10 * state.Level)
                document.getElementById('score').innerHTML = `Score = ${state.score}`

                if (document.querySelectorAll('.alien').length === 0) {
                    levelComplete(state);
                }
                return;
            }
        }

        laser_position_y -= 7;
        laser.style.transform = `translate(${laser_position_x}px, ${laser_position_y}px)`;
        requestAnimationFrame(Move);
    }

    Move();
}

// Level Complete
function levelComplete(state) {
    state.Level++;
    Game(state.Level, state);
    document.getElementById('Level').innerHTML = `Level = ${state.Level}`;
}

// Update Lives
export function UpdateLives(index, state) {
    const Lives = document.getElementById('lives');
    
    if (index === 0) {
        Lives.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('img');
            heart.src = 'lives.png';
            heart.className = 'hearts';
            Lives.appendChild(heart);
        }
    } else if (index < 0) {
        const hearts = Array.from(Lives.querySelectorAll('.hearts'));
        console.log("heart_lenght_before_reduce => ", hearts.length);

        if (hearts.length > 0) {
            console.log("update");
            
            hearts[0].remove();

        } else {
            console.log("game over");
            
            GameOver(state);
        }

    }

}

// Game Over
export function GameOver(state) {
    state.gameActive = false;
    state.Level = 1;
    const game_container = document.getElementById('game');
    game_container.innerHTML = `
        <div class="game_over">
            <p>Game Over</p>
            <button onclick="location.reload()">Try Again</button>
        </div>`;
    game_container.style.backgroundColor = 'white';
}

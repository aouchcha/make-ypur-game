//Variables
document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const game_width = document.getElementById('game').getBoundingClientRect().width;
   
    const villans = document.getElementById('villans');

    const hero = document.getElementById('hero');
    CreateAliens(villans);
    CreateHero(hero);
    hero.style.transform = `translateX(${game_width/2}px) translateY(${0}px)`

    
    
    MoveAliens(hero, game_width, villans);

    
    // const laser = hero.querySelector('.laser');
    document.addEventListener('keydown', (e) => {
        MoveHero(e, game_width, hero, game);
    });
});



//Create The Aliens
export function CreateAliens(villans) {
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < 15; j++) {
            const alien = document.createElement('img');
            alien.classList.add('alien');
            alien.src = 'alien.png';
            row.appendChild(alien);
        }
        villans.appendChild(row);
    }
}

//Move The Aliens
export function MoveAliens(hero, game_width, villans) {
    let alien_position_x = villans.getBoundingClientRect().left;
    let alien_position_y = villans.getBoundingClientRect().top;
    let hero_position_y = hero.getBoundingClientRect().top;
    let Check = 0
    const steep_x = 5;
    const steep_y = 10;
    let direction = 1;
    const rightedge = game_width-villans.getBoundingClientRect().width;
    function Move() {
        if (alien_position_x >= rightedge) {
           direction = -1
           Check ++
        }else if (alien_position_x <= 0) {
            direction = 1
        }

        alien_position_x += (direction * steep_x)
        
        if( Check == 3) {
            alien_position_y += steep_y
            Check = 0
        }
        
        villans.style.transform = `translateX(${alien_position_x}px) translateY(${alien_position_y}px)`

        if (villans.getBoundingClientRect().bottom  <= hero_position_y) {
            requestAnimationFrame(Move)
            
        }else {
            alert("Game Over")
        }
    }
    Move()
}

//Create The Hero
export function CreateHero(hero) {
    const space_ship = document.createElement('img');
    space_ship.src = 'ship.png'; 
    space_ship.classList.add('hero');
    hero.appendChild(space_ship);
}

//Move The Hero
export function MoveHero(e, game_width, hero, game) {
    const space_ship = hero.querySelector('.hero');
    let hero_position_x = space_ship.getBoundingClientRect().left;
    hero.style.bottom = `0px`
    const steep = 10;
    if (e.key === 'ArrowRight') {
        if (hero_position_x < game_width - space_ship.getBoundingClientRect().width) {
            hero_position_x += steep;
            hero.style.transform = `translateX(${hero_position_x}px)`
        }
    } else if (e.key === 'ArrowLeft') {
        if (hero_position_x > 0) {
            hero_position_x -= steep;
            hero.style.transform = `translateX(${hero_position_x}px)`
        }
    }else if (e.key == ' ') {
        CreateLaser(hero, hero_position_x, game)
        return
        // MoveLaser(hero)
    }
}

// Create Laser
export function CreateLaser(hero, hero_position_x, game) {
    const laser = document.createElement('img');
    laser.src = 'laser.png'; 
    laser.classList.add('laser');

    const initialBottom = hero.getBoundingClientRect().top; 
    console.log("laser_y", initialBottom);
    console.log("laser_x",hero_position_x)
    
    laser.style.transform = `translateX(${hero_position_x}px) translateY(${initialBottom})`;

    game.appendChild(laser);

    MoveLaser(laser, hero,hero_position_x);
}

// Move Laser
export function MoveLaser(laser, hero, laser_position_x) {
    let laser_position_y = hero.getBoundingClientRect().top;

    function Move() {
        if (laser_position_y >= window.innerHeight) {
            laser.remove(); 
            return;
        }

        laser_position_y -= 5
        
        laser.style.transform = `translateY(${laser_position_y}px) translateX(${laser_position_x}px)`;

        requestAnimationFrame(Move);
    }

    Move();
}


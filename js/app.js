'use strict';
 /**
* @description Enemy Character
* @param {}  - x - y coordinates and sprite
* @returns {} - methods update and render enemy position and speed
*/

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png';
    }
    //randomize enemies' y coordinate and speed every time they return to screen
    update(dt) {
        if (this.x > 505) {
            this.x = -101;
            this.y = enemyPositionY[Math.floor(Math.random() * enemyPositionY.length)];
            this.speed = enemySpeeds[Math.floor(Math.random() * enemySpeeds.length)];
        }
        else {
            this.x += Math.floor(101 * dt * this.speed);
        }
    }
    render() {  // render enemy
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
} // end enemy class

 /**
* @description Player character
* @param {}  - x - y coordinates, sprite, set lives, 
* @returns {} - methods update, render, reset positon, and set score for wins and gem collisions
*/

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lives = 3; //lives starting out with
        this.sprite = 'images/char-cat-girl.png';
    }
    update() {
        this.checkCollision();
        if (this.y <= 0) { // win game when player reaches water
            win();
        }
        //game over modal and update
        if (this.lives === 0) {
            gameOver(),
            gameOverModal(score);             
        }
    }
    gemScore() {
        score += 20;
        scoreText.textContent = 'SCORE: ' + score;
    }
    //collision method, reset Player coordinates, number of lives, and gem collision stats
    checkCollision() {
        //collisions with enemies
        for (var i = 0; i < allEnemies.length; i++) {
            if (this.x < allEnemies[i].x + 70 && this.x + 70 > allEnemies[i].x &&
                this.y < allEnemies[i].y + 70 && this.y + 70 > allEnemies[i].y) {
                this.resetPosition(); // send player back to start
                looseLife(); //reduce number of lives
                
            }
        } // end collisions with enemies
        //collisions with gems
        for (i = 0; i < allGems.length; i++) {
			// If player is on the same square as a gem, player collects the gem
			if (Math.abs(allGems[i].x - this.x) < 50 && Math.abs(allGems[i].y - this.y) < 50) {
				// Remove collected gem and put a new gem on the field
				allGems[i].reset();
				// Add gem to player score
				this.gemScore();
			} // end gem collision
		} 
    } // end check collision
    resetPosition() {
        this.x = 202;
        this.y = 380;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // controls Player's movement via keybord input
    handleInput(key) {
        if (key === 'right' && this.x < 404) {
            this.x += 101;
        }
        if (key === 'left' && this.x > 0) {
            this.x -= 101;
        }
        if (key === 'up' && this.y > 0) {
            this.y -= 80;
        }
        if (key === 'down' && this.y < 380) {
            this.y += 80;
        }
    }
} // end player class

 /**
* @description Lives Counter 
* @param {}  - x - y coordinates for extra lives
* @returns {} - methods update, render, and check collision of with enemy to reduce lives
*/
class Life {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-cat-girl-life.png';
    }
    update() {
        this.checkCollision();
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    checkCollision() {
        if (this.x < player.x + 20 && this.x + 20 > player.x &&
            this.y < player.y + 20 && this.y + 20 > player.y) {
        }
    }
} // end life class
 /**
* @description Gem class
* @param {}  - x - y coordinates, sprite
* @returns {} - methods render, reset positon, and set score for wins and gem collisions
*/

class Gem {
	constructor() {
		// Get random color
		this.sprite = gemOptions[Math.floor(Math.random() * gemOptions.length)];
		// Get random vertical position (line up on tiles within field)
		this.randomPosition();
    }
    randomPosition() {
		this.y = gemRandomPosition();
		this.x = gemRandomPosition();
    }
	// Regenerate new gem when gem is collected
	reset() {
		this.sprite = gemOptions[Math.floor(Math.random() * gemOptions.length)];
		this.y = gemRandomPosition();
		this.x = gemRandomPosition();
	}
	// Draw the gem the screen
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

// Options for gem colors
let gemOptions = [
	'images/gem-blue-small.png',
	'images/gem-green-small.png',
	'images/gem-orange-small.png'
];

let score = 0;
let scoreText = document.querySelector('#score');

let numOfEnemies = 3;
let enemyPositionY = [60, 145, 225];//coordinates to randomize position
let enemySpeeds = [2, 3, 4, 5]; //ramdomize speed
let allEnemies = []; // Enemies Array
let allGems = [];  // Gems array
let numGems = 3;

//instantiate Enemies
for (var i = 0; i < numOfEnemies; i++) {
    allEnemies[i] = new Enemy(0, enemyPositionY[Math.floor(Math.random() * enemyPositionY.length)], enemySpeeds[Math.floor(Math.random() * enemySpeeds.length)]);
}
//Instatiate Player and lives 
let player = new Player(202, 380);
let life = new Life(-101, 0);  // 

//instantiate gems
for ( i = 0; i < numGems; i++) {
	allGems[ i ] = new Gem();
}

// functions

function win() {
    score += 100;
    scoreText.textContent = 'SCORE: ' + score;
    player.resetPosition();
    swal({
        title: 'Successful Crossing!',
        text: '100 more points! Keep going!',
        imageUrl: 'images/start-img.png',
        imageWidth: 300,
        imageHeight: 200,
        imageAlt: 'game image',
        confirmButtonText: 'Continue Game',
        animation: false
      })
}

function gemRandomPosition() {
    var position = Math.floor(Math.random() *4) *100;
    return position;
}

function looseLife() {
    player.lives--;
    lifeCount.firstElementChild.remove();
}

function gameOver() {
    allEnemies = [];
    player.x = 202;
    life.x = -101;
    allGems = [];
}

function gameOverModal(score) {
    swal({
        position: 'top-end',
        title: 'Game Over',
        text: 'You scored ' + score + ' points!',
        showConfirmButton: true, 
        confirmButtonText: 'Play again'  
      }).then(function(isConfirm){
          location.reload();
      })
}

//event listener for key presses sent to handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

class mainClass {
  constructor() {
    // The menu section
    this.menu = document.querySelector('.menu-section');
    // The Instructions section
    this.instructions = document.querySelector('.instructions-section');
    // The wining section
    this.winSection = document.querySelector('.win-section');
    // The Winner section
    this.winner = document.querySelector('.winner');

    // Drawing Area
    this.canvas = document.querySelector('#canvas');
    // Get context
    this.ctx = canvas.getContext('2d');

    // Used to determine if the game has statred(if the spce button is pressed)
    this.gameStarted = false;
    /* Used to check for the first collision with the paddle after the
    space button is pressed */
    this.firstCollision = false;
    /* In vs computer this is used to determine when to start moving the
    paddle */
    this.moveTopPaddle = false;
    // Used to to check for multiplayer
    this.multiplayer = false;
    // The miliseconds after which the screen is refershed
    this.miliSeconds = 7;

    // Ball Info
    this.ball = {
      X: this.canvas.width / 2, // X Positon of the Ball
      Y: this.canvas.height / 2, // Y Positon of the Ball
      R: 8, // Radius of the Ball
      dx: 2,
      dy: 2,
    };

    // Paddle-1 Info
    this.paddle1 = {
      X: this.canvas.width / 2 - 32, // X Position of the Paddle
      Y: this.canvas.height - 20, // Y Positon of the Paddle
      W: 60, // Paddle Width
      H: 10, // Paddle Height
    };

    // Paddle-1 Info
    this.paddle2 = {
      X: this.canvas.width / 2 - 32, // X Position of the Paddle
      Y: 10, // Y Positon of the Paddle
      W: 60, // Paddle Width
      H: 10, // Paddle Height
    };

    // Used Save the value of the setInterval function so that we can clear it
    this.timeInterval;

    // Used to store the distance between the X position of each Dash
    this.diff;

    // Used to save the score
    this.score1 = 0;
    this.score2 = 0;

    // Used to check button press
    this.rightPressed = false;
    this.leftPressed = false;
    this.aPressed = false;
    this.dPressed = false;
  }

  // Used to draw the ball
  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.X, this.ball.Y, this.ball.R, 0, Math.PI * 2);
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Used to draw the Paddle 1
  drawPaddle1() {
    this.ctx.beginPath();
    this.ctx.rect(
      this.paddle1.X,
      this.paddle1.Y,
      this.paddle1.W,
      this.paddle1.H
    );
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Used to draw the Paddle 2
  drawPaddle2() {
    this.ctx.beginPath();
    this.ctx.rect(
      this.paddle2.X,
      this.paddle2.Y,
      this.paddle2.W,
      this.paddle2.H
    );
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Used to draw Dashes in the center of the Canvas
  drawDashes() {
    this.diff = 0;
    for (let i = 0; i < 8; i++) {
      this.ctx.beginPath();
      this.ctx.rect(this.diff, this.canvas.height / 2, 40, 8);
      this.ctx.fillStyle = '#333';
      this.ctx.fill();
      this.ctx.closePath();
      this.diff += 60;
    }
  }

  // Used to display the score
  displayScore() {
    this.ctx.font = '40px Arial';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(`${this.score1}`, 10, 340);

    this.ctx.font = '40px Arial';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(`${this.score2}`, 10, 440);
  }

  // Used to move the ball
  moveBall() {
    if (!this.firstCollision) {
      this.ball.Y += this.ball.dy;
    } else {
      this.ball.X += this.ball.dx;
      this.ball.Y += this.ball.dy;
    }
  }

  // Used to check ball collision with the walls and paddles
  checkBallCollision() {
    // Top Wall Check
    if (this.ball.Y - this.ball.R === 1) {
      this.ball.dy = 2;
      this.score2 += 5;
    }
    // Bottom Wall Check
    if (this.ball.Y - this.ball.R === 739) {
      this.ball.dy = -2;
      this.score1 += 5;
    }
    // Right Wall Check
    if (this.ball.X - this.ball.R === 452) {
      this.ball.dx = -2;
    }
    // Left Wall Check
    if (this.ball.X - this.ball.R === 2) {
      this.ball.dx = 2;
    }

    if (this.ball.Y === 731) {
      // If the ball is in the area of the paddle
      if (
        this.ball.X > this.paddle1.X &&
        this.ball.X < this.paddle1.X + this.paddle1.W
      ) {
        this.ball.dy = -2;
        /* If space is pressed and the first collison has happened after
        pressing the spce then stop moving the ball up and down and start
        moving it in random directions */
        if (this.gameStarted) {
          this.firstCollision = true;

          // If multiplayer is not being played then start moving the top paddle
          if (!this.multiplayer) {
            this.moveTopPaddle = true;
          }
        }
      }
    }

    if (this.ball.Y === 27) {
      // If the ball is in the area of the paddle
      if (
        this.ball.X >= this.paddle2.X &&
        this.ball.X <= this.paddle2.X + this.paddle2.W
      ) {
        this.ball.dy = 2;
        /* Same as above only multiplayer is not here because this paddle is
        moved by the 1st player */
        if (this.gameStarted) {
          this.firstCollision = true;
        }
      }
    }
  }

  // Used to move the Paddles
  movePaddle() {
    if (this.rightPressed) {
      this.paddle1.X += 3;
    } else if (this.leftPressed) {
      this.paddle1.X -= 3;
    }

    /* If multiplayer is not being player and moveTopPaddle is true
    then start moving the top paddle */
    if (!this.multiplayer) {
      if (this.moveTopPaddle) {
        if (this.ball.dx === -2 && this.ball.dy === -2) {
          this.paddle2.X -= 1.7;
        }

        if (this.ball.dx === 2 && this.ball.dy === -2) {
          this.paddle2.X += 1.7;
        }
      }

      /* If multiplayer is being player then let the second player control the
      second paddle */
    } else {
      if (this.aPressed) {
        this.paddle2.X -= 3;
      } else if (this.dPressed) {
        this.paddle2.X += 3;
      }
    }
  }

  // Used check paddle Collision
  checkPaddleCollision() {
    // Left wall check
    if (this.paddle1.X + this.paddle1.W > this.canvas.width) {
      this.paddle1.X = this.canvas.width - this.paddle1.W;
    } else if (this.paddle1.X < 0) {
      this.paddle1.X = 0;
    }

    // Right Wall Check
    if (this.paddle2.X + this.paddle2.W > this.canvas.width) {
      this.paddle2.X = this.canvas.width - this.paddle2.W;
    } else if (this.paddle2.X < 0) {
      this.paddle2.X = 0;
    }
  }

  // Used to check if someone won or not
  checkWin() {
    // If computer or player 2 wins
    if (this.score1 >= 50) {
      // Clear the interval
      clearInterval(this.timeInterval);
      // Change the page state to the winning state
      this.changeState('win');
      // If multiplyer is not being played then computer wins
      if (!this.multiplayer) {
        // Display computer won
        this.winner.textContent = 'Computer Wins!';

        // Else player 2 wins
      } else {
        // Display player 2 won
        this.winner.textContent = 'Player 2 Wins!';
      }

      // If computer or player 2 wins
    } else if (this.score2 >= 50) {
      // Clear the interval
      clearInterval(this.timeInterval);
      // Change the page state to the winning state
      this.changeState('win');
      // Display player 1 won
      this.winner.textContent = 'Player 1 Wins!';
    }
  }

  // Used to reset everything
  reset() {
    this.gameStarted = false;
    this.moveTopPaddle = false;
    this.firstCollision = false;

    // if (!this.multiplayer) {
    //   this.multiplayer = false;
    // }

    this.score1 = this.score2 = 0;
    this.ball.X = this.canvas.width / 2;
    this.ball.Y = this.canvas.height / 2;
    this.ball.dx = 2;
    this.ball.dy = 2;
    this.paddle1.X = this.paddle2.X = this.canvas.width / 2 - 32;
  }

  // Used to change the state of the document/page
  changeState(state) {
    // Game State
    if (state === 'game') {
      this.menu.style.display = 'none';
      this.canvas.style.display = 'block';

      // Instructions state
    } else if (state === 'instructions') {
      this.menu.style.display = 'none';
      this.instructions.style.display = 'block';

      // Menu state
    } else if (state === 'menu') {
      this.instructions.style.display = 'none';
      this.canvas.style.display = 'none';
      this.menu.style.display = 'block';

      // Winning State
    } else if (state === 'win') {
      this.canvas.style.display = 'none';
      this.winSection.style.display = 'block';

      // Not a state but displays the game state again
    } else if ('.play-again') {
      this.winSection.style.display = 'none';
      this.canvas.style.display = 'block';
    }
  }

  // Used to draw Everything
  draw() {
    // Clear the Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Check Win
    this.checkWin();
    // Draw the dashes in the center
    this.drawDashes();
    // Draw the Ball
    this.drawBall();
    // Draw the Paddle 1
    this.drawPaddle1();
    // Draw the Paddle 2
    this.drawPaddle2();
    // Move the ball
    this.moveBall();
    // Check Ball Collision
    this.checkBallCollision();
    // Display the score
    this.displayScore();
    // Move the paddles
    this.movePaddle();
    // Check Paddle Collision
    this.checkPaddleCollision();
  }
}

// Object of the class
const gameClass = new mainClass();

// Event listener on the first menu item(Play multiplayer)
document.querySelector('.item-1').addEventListener('click', () => {
  gameClass.changeState('game');
  gameClass.multiplayer = true;
  setInterval(() => {
    gameClass.draw();
  }, gameClass.miliSeconds);
});

// Event listener on the second menu item(Play Vs Computer)
document.querySelector('.item-2').addEventListener('click', () => {
  gameClass.changeState('game');
  gameClass.timeInterval = setInterval(() => {
    gameClass.draw();
  }, 7);
});

// Event listener on the thrid menu item(Instructions)
document.querySelector('.item-3').addEventListener('click', () => {
  // Change the page state to instructions
  gameClass.changeState('instructions');
});

// Event listener on the go back button
document.querySelector('.btn-go-back').addEventListener('click', () => {
  // Change the page state to menu
  gameClass.changeState('menu');
});

// Event listener on the menu button
document.querySelector('.btn-main-menu').addEventListener('click', () => {
  // Reload the window
  window.location.reload();
});

// Event listener on the play again button
document.querySelector('.btn-play-again').addEventListener('click', () => {
  // Change the page state to the game state
  gameClass.changeState('play-again');
  // Reset everything
  gameClass.reset();
  /* For some reason when play again would be pressed in multiplyer mode after
  a player won then 7 miliseconds would be two fast. Before winning it would 
  be just fine but after winning i.e after clicking the play again button 7
  miliseconds would be to fast of a refresh rate. So here we are checking if 
  we are clicking the play again button in multiplayer mode if yes then set then
  set the miliseconds to 55 else it should be 7 i.e when we are not in
  multiplayer mode */
  gameClass.miliSeconds = gameClass.multiplayer ? 55 : 7;
  // Start a new interval
  gameClass.timeInterval = setInterval(() => {
    gameClass.draw();
  }, gameClass.miliSeconds);
});

// Event listener for keyup and keydown
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Executed when the key is down
function keyDownHandler(e) {
  /* Game will be stated when space is pressed i.e the ball will start moving
  different directions insted of just moving up and down */
  if (e.keyCode === 32) {
    gameClass.gameStarted = true;
  }
  // If right arrow key is pressed
  if (e.keyCode === 39) {
    gameClass.rightPressed = true;
    // If left arrow key is pressed
  } else if (e.keyCode === 37) {
    gameClass.leftPressed = true;
  }

  // If a key is pressed
  if (e.keyCode === 65) {
    gameClass.aPressed = true;
    // If d key is pressed
  } else if (e.keyCode === 68) {
    gameClass.dPressed = true;
  }
}

// Executed when the key is up
function keyUpHandler(e) {
  // If right arrow key is pressed
  if (e.keyCode === 39) {
    gameClass.rightPressed = false;
    // If left arrow key is pressed
  } else if (e.keyCode === 37) {
    gameClass.leftPressed = false;
  }

  // If 'a' key is pressed
  if (e.keyCode === 65) {
    gameClass.aPressed = false;
    // If 'd key is pressed
  } else if (e.keyCode === 68) {
    gameClass.dPressed = false;
  }
}

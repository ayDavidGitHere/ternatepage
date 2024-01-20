class CntGame {
    constructor(container) {
      this.container = container;
      this.ball = null;
      this.blocks = [];

      this.init();
    }

    init() {
      this.addGameStyles();

      this.containerWidth = this.container.clientWidth;
      this.containerHeight = this.container.clientHeight;

      this.createBall();
      this.createBlocks();

      setTimeout(()=>{
        this.initBall();
        this.initBlocks();
        //this.startGameLoop();

      }, 2000);
    }

    createBall() {
      this.ball = document.createElement('div');
      this.ball.classList.add('ball');
      this.container.appendChild(this.ball);
      this.ball.outerHTML = `<div class="ball"></div>`;
    }

    createBlocks() {
      for (let i = 0; i < 5; i++) {
        const block = document.createElement('div');
        block.classList.add('block');

        this.container.appendChild(block);
        this.blocks.push(block); 
      }
    }

    initBall() { 
      const ballRect = this.ball.getBoundingClientRect();
      this.ballClientHeight = this.ball.clientHeight > 0 ? this.ball.clientHeight : 1;
      this.ballClientWidth = this.ball.clientWidth > 0 ? this.ball.clientWidth : 1;
      this.ball.style.top = this.containerHeight/2 - this.ballClientHeight/2;
      this.ball.style.left = this.containerWidth/2 - this.ballClientWidth/2;
      console.log("\nthis.ball.getBoundingClientRect() ", this.ball.getBoundingClientRect(), "_");
      console.log("this.ball.style.top ", this.ball.style.top, "[", this.containerHeight, this.ball.clientHeight, "]");
      console.log("this.ball.style.left ", this.ball.style.left, "[", this.containerWidth, this.ball.clientWidth, "]");
    }

    initBlocks() {
      for (let i = 0; i < this.blocks.length; i++) {
        let block = this.blocks[i];
        const blockRect = block.getBoundingClientRect();
        block.style.top = this.containerHeight/2 + block.clientHeight/2 - 100 + Math.random() * 200;
        block.style.left = this.containerWidth/2 + block.clientWidth/2 - 100 + Math.random() * 200;

        console.log("\nblock.getBoundingClientRect() ", block.getBoundingClientRect(), "_");
        console.log("\nblock.style.top ", block.style.top, this.containerHeight, block.clientWidth, "]");
        console.log("block.style.left ", block.style.left, this.containerWidth, block.clientHeight, "]");
      }
    }

    startGameLoop() {
      setInterval(() => {
        this.moveBall();
        this.checkCollision();
      }, 16); // Adjust the interval based on the desired frame rate
    }

    moveBall() {
      const ballRect = this.ball.getBoundingClientRect();

      // Adjust these values based on the desired ball speed
      const speedX = 2;
      const speedY = 2;

      this.ball.style.left = `${ballRect.left + speedX}px`;
      this.ball.style.top = `${ballRect.top + speedY}px`;
    }

    checkCollision() {
      const ballRect = this.ball.getBoundingClientRect();

      this.blocks.forEach(block => {
        const blockRect = block.getBoundingClientRect();

        if (
          ballRect.right > blockRect.left &&
          ballRect.left < blockRect.right &&
          ballRect.bottom > blockRect.top &&
          ballRect.top < blockRect.bottom
        ) {
          // Reverse the ball direction on collision
          this.reverseBallDirection();
        }
      });
    }

    reverseBallDirection() {
      // Reverse the direction of the ball
      const speedX = -2; // Change the direction in the X-axis
      const speedY = -2; // Change the direction in the Y-axis

      this.ball.style.left = `${parseFloat(this.ball.style.left) + speedX}px`;
      this.ball.style.top = `${parseFloat(this.ball.style.top) + speedY}px`;
    }


    addGameStyles() {
      const styles = document.createElement('style');
      styles.textContent = `
        game-cnt .ball {
          position: absolute;
          width: 50px;
          height: 50px;
          background-color: #3498db;
          border-radius: 50%;
        }
  
        game-cnt .block {
          position: absolute;
          width: 80px;
          height: 30px;
          background-color: #e74c3c;
        }
      `;
      document.head.appendChild(styles);
    }
}

export default CntGame;

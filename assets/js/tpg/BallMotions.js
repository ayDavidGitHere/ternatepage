class BallMotions{  

    constructor(ball, cylindersMotions, main, game) {
        this.ball = ball;
        this.cylindersMotions = cylindersMotions; 
        this.main = main;  
        this.game = game;
    }
    
    constant() { 
        this.ball.speedY = this.ball.speedY ?? 2; 
        this.ball.position.y -= this.ball.speedY;
    
        // Check if the ball has reached a certain height, reverse the direction if needed
        if (this.ball.position.y - this.ball.width > 30 || this.ball.position.y - this.ball.width < 0) {
            if(
                this.game.startupRunning() 
             || this.ball.speedY < 0 // GOING UP
             || this.ballLandOnClosestZCylinder()
            ) {
                this.ball.speedY *= -1; // Reverse the direction of the ball
                this.game.increaseScore();
                if( this.ball.speedY > 0 ) { // LANDED
                    this.cylindersMotions.recordBallLandedCylinder(this.closestZCylinder ?? null);
                    this.closestZCylinder = this.getClosestZCylinder();
                    this.ball.speedY = this.calculateBallSpeedY(); 
                } 
            } else {
                this.recordBallLandFail();
            }
        }
 

        this.ball.speedX = this.ball.speedX ?? + 2/10; 
        this.ball.position.x += this.ball.speedX;
        if (this.ball.position.x < -20 || this.ball.position.x > 20) {
            this.ball.position.x -= this.ball.speedX;
            this.ball.speedX = 0;   
        }

        let ballHex =  this.ball.speedY > 0 ? 0xff00aa : 0xaa00ff ;
        this.ball.material.color.setHex( ballHex );
    }

    
    calculateBallSpeedY() {
        let cylinderToTargetDistance = Math.abs(this.closestZCylinder.position.z - this.ball.position.z - this.ball.width);
        let cylinderToTargetTime = cylinderToTargetDistance /  this.cylindersMotions.cylindersSpeedX;

        let ballSpeedY =  60 / cylinderToTargetTime;
        return ballSpeedY; 
    }

    getClosestZCylinder() {
        let closestZ = - Infinity;
        let closest = null;
    
        // Iterate through all cylinders to find the closest z position
        this.cylindersMotions.cylinders.forEach(cylinder => {
            const cylinderZ = cylinder.position.z;
    
            // Check if the current cylinder is closer than the current closestZ
            if ( (cylinderZ - this.ball.position.z > closestZ - this.ball.position.z) && cylinderZ - this.ball.position.z < 0 ) {
                closest = cylinder;
                closestZ = cylinderZ;
            }
        }); 
        return closest;
    } 

    ballLandOnClosestZCylinder() {
        if(!this.closestZCylinder) {
            return true;
        }
        if(this.ball.position.x < 0 && this.closestZCylinder.position.x < 0) {
            return true;
        }
        if(this.ball.position.x > 0 && this.closestZCylinder.position.x > 0) {
            return true;
        }
        return false;
    }

    recordBallLandFail(){

    }

    moveLeft() {
        this.ball.speedX = -2/.75;  
    }

    moveRight() {
        this.ball.speedX = +2/.75;  
    }
    
}
export default BallMotions;
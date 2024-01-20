class CylindersMotions{ 

    constructor(cylinders, main) {
        this.cylinders = cylinders; 
        this.main = main;
    }

    constant() {
        // Check if the closest cylinder is greater than 50
        const closestCylinder = this.cylinders[0];
        if (closestCylinder && closestCylinder.position.z < this.main.camera.position.z - 50 ) {
            this.cylindersSpeedX = 20;
        } else {
            // Move existing cylinders towards the third-person camera
            this.cylindersSpeedX = 1 * 2;
        }

        this.cylinders.forEach(cylinder => {
            cylinder.position.z += this.cylindersSpeedX;
    
            // Check if a cylinder has moved past the view of the camera, delete it
            if (cylinder.position.z > this.main.camera.position.z + 500) {
                this.main.scene.remove(cylinder);
                this.cylinders.splice(this.cylinders.indexOf(cylinder), 1);
            }
        });
    
        // Check if the furthest cylinder is closer than 750, create another moving cylinder behind it
        const furthestCylinder = this.cylinders[this.cylinders.length - 1];
        if (!furthestCylinder || furthestCylinder.position.z > this.main.camera.position.z - 750 ) {
            const newCylinder = this.main.createCylinder();
            newCylinder.position.z = this.main.camera.position.z - 750 - 50; // Adjust the initial position as needed

            // Randomly set the x position to the left or right of the existing cylinder
            newCylinder.posxstate = 0 + (Math.random() > 0.5 ? 1 : -1);
            newCylinder.position.x = newCylinder.posxstate * 20;
            this.cylinders.push(newCylinder);
        }
    }    

    
    recordBallLandedCylinder(cylinder) {
        if ( cylinder == null ) return; {
            cylinder.material.color.setHex( 0x000044 );
            cylinder.material.opacity = .5;
        }
        //posxstate
    }
}


export default CylindersMotions
class Controls {
    constructor(ballMotions) {
        this.ballMotions = ballMotions;
        this.initListeners();
    }

    initListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.ballMotions.moveLeft();
                break;
            case 'ArrowRight':
                this.ballMotions.moveRight();
                break;
            // Add more cases for other keys if needed
        }
    }

    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
    }

    handleTouchEnd(event) {
        const touchEndX = event.changedTouches[0].clientX;
        const swipeDistance = touchEndX - this.touchStartX;

        if (swipeDistance > 0) {
            this.ballMotions.moveRight();
        } else if (swipeDistance < 0) {
            this.ballMotions.moveLeft();
        }
    }


    rotateCameraAbout(THREE, camera, geometry, renderer, radius, sensitivity) {
        const onMouseMove = (event) => {
            const target =  geometry.position;

            const { clientX, clientY } = event;

            const deltaX = clientX - this.previousClientX;
            const deltaY = clientY - this.previousClientY;

            const theta = deltaX * sensitivity;
            const phi = deltaY * sensitivity;

            const thetaRadians = THREE.MathUtils.degToRad(theta);
            const phiRadians = THREE.MathUtils.degToRad(phi);

            const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));
            spherical.theta += thetaRadians;
            spherical.phi += phiRadians;

            spherical.phi = Math.max(0, Math.min(Math.PI, spherical.phi)); // Restrict vertical rotation

            const position = new THREE.Vector3().setFromSpherical(spherical).add(target);

            camera.position.copy(position);
            camera.lookAt(target);

            this.previousClientX = clientX;
            this.previousClientY = clientY;
            console.log("onMouseMove");
        };

        const onMouseDown = (event) => {
            event.preventDefault();

            this.previousClientX = event.clientX;
            this.previousClientY = event.clientY;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            console.log("onMouseDown");
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            console.log("onMouseUp");
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
    }

}

export default Controls;

class FTRenderAnims {
    constructor(camera, text3d_1) {
        this.camera = camera;
        this.text3d_1 = text3d_1;
    }

    getTargetPositions() {
        // Get initial camera position and lookAt from the provided camera object
        const initialCameraPosition = this.camera.position.clone();
        const initialLookAt = this.camera.getWorldDirection(new THREE.Vector3()).add(this.camera.position);

        // Get final camera position and lookAt based on text3d_1's bounding box
        this.text3d_1.geometry.computeBoundingBox();
        const finalCameraPosition = new THREE.Vector3(
            0,
            this.text3d_1.position.y + this.text3d_1.geometry.boundingBox.max.y,
            this.text3d_1.position.z + 500
        );
        const finalLookAt = this.text3d_1.position.clone();

        return { initialCameraPosition, initialLookAt, finalCameraPosition, finalLookAt };
    }

    panToTargetPositions() {
        const { initialCameraPosition, initialLookAt, finalCameraPosition, finalLookAt } = this.getTargetPositions();

        // Duration of the animation in milliseconds
        const animationDuration = 5000; // Adjust as needed

        // Start time of the animation
        const startTime = Date.now();

        // Animation function
        const animateCamera = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / animationDuration);

            // Interpolate between initial and final positions
            const newPosition = initialCameraPosition.clone().lerp(finalCameraPosition, progress);
            const newLookAt = initialLookAt.clone().lerp(finalLookAt, progress);

            // Update the camera position and lookAt
            this.camera.position.copy(newPosition);
            this.camera.lookAt(newLookAt);

            // Render the scene
            renderer.render(scene, this.camera);

            // Request the next animation frame if the animation is not finished
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        // Start the animation
        animateCamera();
    }
}

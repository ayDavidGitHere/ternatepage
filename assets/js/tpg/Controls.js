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
}

export default Controls;

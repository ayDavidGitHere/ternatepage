import * as THREE from 'three';
import Controls from "./controls.js";
import BallMotions from "./BallMotions.js";
import CylindersMotions from "./CylindersMotions.js";

class Render {
    constructor(container) {
        this.container = container;
        this.setupScene();
        this.initGame();

        this.load();
        this.render();
    }

    async load() {
        await this.loadAssets();
    }

    async loadAssets() {
        //await this.loadBallTexture();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.container.style = `width:100%; height: 100%; margin: 0; padding:0; border: 1px solid green;`
        this.renderer.domElement.style = `margin: 0; padding:0; border: 1px solid red;`;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 200, 250);
        this.camera.lookAt(new THREE.Vector3(0, 20, -100));
        window.addEventListener('resize', () => { this.onWindowResized(this) }, false);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.setupBackground();
    }

    setupBackground() {
        this.setupBackground_room();
    }

    setupBackground_room() {
        // Implement your room background setup here if needed
    }

    setupLights() {
        // Point Light (for reflections)
        const pointLight = new THREE.PointLight("white", 1);
        pointLight.position.set(0, 200, 0);
        //this.scene.add(pointLight);

        // Directional Light
        const directionalLight = new THREE.DirectionalLight("white", 1/2-1/4);
        directionalLight.position.set(0, 50, 50);
        directionalLight.target.position.set(0, -50, -50);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.visible = true;
        {
            const d = 200;
            directionalLight.shadow.camera.left = -d;
            directionalLight.shadow.camera.right = d;
            directionalLight.shadow.camera.top = d;
            directionalLight.shadow.camera.bottom = -d;
            directionalLight.shadow.camera.far = 100;
            directionalLight.shadow.camera.fov *= 1;
            directionalLight.shadow.camera.near = 0;
            directionalLight.shadow.mapSize.width = 2 * 512;
            directionalLight.shadow.mapSize.height = 2 * 512;
            directionalLight.shadow.darkness = 1;
        }
        this.scene.add(directionalLight, directionalLight.target);

        // Hemisphere Light
        const hemisphereLight = new THREE.HemisphereLight("white", "white", 1-1/2);
        this.scene.add(hemisphereLight);

        const ambientLight = new THREE.AmbientLight("white", 1/4);
        this.scene.add(ambientLight);

        return { pointLight, directionalLight, hemisphereLight };
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.run();
        this.renderer.render(this.scene, this.camera);
    }

    createBall() {
        const ballWidth =  10;
        const ballGeometry = new THREE.SphereGeometry(ballWidth, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(0, 20, 0); // Set the initial position of the ball 
        ball.width = ballWidth;
        this.scene.add(ball); 

        return ball;
    }

    createCylinder() {
        const cylinderGeometry = new THREE.CylinderGeometry(20, 20, 50, 32);

        // Generate a random hexadecimal color code
        const randomColor = Math.floor(Math.random()*16777215).toString(16); 

        // Vertex shader
        const vertexShader = `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `;

        // Fragment shader
        const fragmentShader = `
        varying vec2 vUv;

        void main() {
            vec3 color = vec3(
            0.5 + 0.5 * sin(vUv.x * 10.0),
            0.5 + 0.5 * cos(vUv.y * 10.0),
            0.5 + 0.5 * sin(vUv.x * vUv.y * 10.0)
            );

            gl_FragColor = vec4(color, 1.0);
        }
        `;

        // Create ShaderMaterial
        const cylinderMaterialA = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        });

        const cylinderMaterial = new THREE.MeshPhongMaterial({ 
            color: parseInt(randomColor, 16) 
        });

        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        
        cylinder.position.set(0, 0-25, this.camera.position.z - 750 ); // Set the initial position of the cylinder
        this.scene.add(cylinder);
        
        return cylinder;        
    }

    initGame() {
        this.startupCount = 0; 
        this.displayStartupBoard();

        this.scoreCount = 0;
        //this.displayScoreBoard();
 
        this.displayGameButtons();

        this.ball = this.createBall();
        this.cylinders = [ this.createCylinder() ]; 
        this.cylindersMotions = new CylindersMotions(this.cylinders, { 
            camera: this.camera,
            scene: this.scene,
            createCylinder: this.createCylinder,
            startupRunning: this.startupRunning
        });
        this.ballMotions = new BallMotions(this.ball, this.cylindersMotions, { 
            startupRunning: this.startupRunning
        }, this);
        this.controls = new Controls(this.ballMotions);
    }

    run() {
        
        this.ballMotions.constant(); 

        this.cylindersMotions.constant();

        this.camera_anim();
 
        this.startupCount++;
        this.updateStartupBoard();

        this.updateScoreBoard();
    } 
    
    increaseScore() {
        if(!this.startupRunning())
            this.scoreCount++;
    }

    startupRunning(){ 
        return (this.startupCount < 300)
    }

    displayStartupBoard() { 
        this.startupBoard  = document.createElement("div");
        let startupBoard = this.startupBoard;
        startupBoard.style = `
            position:  absolute;
            width: 100%;
            height: 100%;
            background-color: #00083744;
            color: #000837;
            text-align: center; 
            vertical-align: middle;
            line-height: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 7rem;
            font-family: leaguespartanbold;
        `
        this.container.appendChild(startupBoard)  
        
        startupBoard.innerHTML = "<span> </span>";
    }

    updateStartupBoard() {
        if(this.startupBoardRemoved) return;

        let startupBoard = this.startupBoard;
        if(this.startupRunning()) { 
            let startupText = startupBoard.querySelector("span");
            startupText.innerText = `${Math.ceil((300 - this.startupCount)/100)}`;
        }else {
            this.startupBoardRemoved = true;

            startupBoard.innerHTML = "";
            startupBoard.parentNode.removeChild(startupBoard);

            this.displayScoreBoard();
        }
    }


    displayScoreBoard() { 
        this.scoreBoard  = document.createElement("div");
        let scoreBoard = this.scoreBoard;
        scoreBoard.style = `
            position:  absolute;
            width: 5rem;
            height: 5rem;
            background-color: #37378733;
            color: white;
            text-align: center;
            vertical-align: middle;
            line-height: 5rem;
            top: 0%;
            left: 50%;
            transform: translate(-50%, 0);
            font-size: 1.6rem; 
            font-family: leaguespartanbold;
            border-radius: .45rem;
            border: 2px solid #373787;
        `
        this.container.appendChild(scoreBoard)  
        
        scoreBoard.innerHTML = "<span> </span>";
    }
    
    updateScoreBoard() {
        if(!this.scoreBoard) return;

        let scoreBoard = this.scoreBoard; 
        let scoreText = scoreBoard.querySelector("span");
        scoreText.innerText =  `${this.scoreCount}  `;
    }


    displayGameButtons() { 
        this.playbackBtnCtn  = document.createElement("div");
        let playbackBtnCtn = this.playbackBtnCtn;
        playbackBtnCtn.style = `
            position:  absolute;
            width: 5rem;
            height: 2.5rem;
            background-color: #37378733;
            color: white;
            text-align: center;
            vertical-align: middle;
            line-height: 2.5rem;
            top: calc( 0% + 1rem );
            left: calc( 0% + 1rem );
            transform: translate(0, 0);
            font-size: 1.6rem; 
            font-family: leaguespartanbold;
            border-radius: .45rem;
            border: 2px solid #373787;

            display: flex; padding: 0px;
            flex-flow: row wrap;
            justify-content: center;
        `
        this.container.appendChild(playbackBtnCtn)  
        
        playbackBtnCtn.innerHTML = "";


        this.pauseBtn  = document.createElement("div");
        let pauseBtn = this.pauseBtn;
        pauseBtn.style = ` 
            width: 45%;
            height: 100%; 
            border-right: 1px solid #373787;
        `
        playbackBtnCtn.appendChild(pauseBtn);
        pauseBtn.setAttribute("app-icon", "pause");


        this.reloadBtn  = document.createElement("div");
        let reloadBtn = this.reloadBtn;
        reloadBtn.style = ` 
            width: 45%;
            height: 100%; 
            border-left: 1px solid #373787;
        `
        playbackBtnCtn.appendChild(reloadBtn);
        reloadBtn.setAttribute("app-icon", "reload");

    }

    camera_anim() {

        this.camera.position.x =  75;
        this.camera.position.y =  75; 
        return;

        this.camera.speed = this.camera.speed ?? 5; 
        this.camera.position.x -= this.camera.speed;
    
        if (this.camera.position.x > 120) this.camera.speed = 0; 
        return;

        // Check if the camera has reached a certain height, reverse the direction if needed
        if (this.camera.position.x > 200 || this.camera.position.x < -200) {
            this.camera.speed *= -1; // Reverse the direction of the camera
        }
    }

    render() {
        this.animate();
    }


    onWindowResized(ctx) {
        ctx.renderer.setSize(window.innerWidth, window.innerHeight);
        ctx.camera.aspect = window.innerWidth / window.innerHeight;
        ctx.camera.updateProjectionMatrix();
    }
}

export default Render;

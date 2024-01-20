import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'; 
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'; 
import {TextGeometry} from 'three/addons/geometries/TextGeometry';

class FtRender {
    constructor(container) { 
        this.container = container;
        this.apiEndpoint = 'YOUR_API_ENDPOINT'; // Replace with the actual API endpoint
        this.setupScene(); 

        this.load();
        this.render();
    }

    async load() {
        await this.loadAssets();
        // await this.loadData();
    }
 
    async loadAssets() {
        //await this.loadStadiumModel();
        await this.drawText();
    }

    async loadData() {
        await this.loadLeaguePositions()
    }
    
    async loadLeaguePositions() {
        // Fetch league positions data from the API
        try {
            const response = await fetch(this.apiEndpoint);
            const data = await response.json();

            // Process the data and position the teams accordingly
            // For example, you can create meshes for each team and position them in the stadium
        } catch (error) {
            console.error('Error fetching league positions:', error);
        }
    }

    async loadStadiumModel() {
        const loader = new GLTFLoader();
        return new Promise((resolve) => {
            loader.load('path/to/stadium-model.gltf', (gltf) => {
                this.stadiumModel = gltf.scene;
                this.scene.add(this.stadiumModel);
                resolve();
            });
        });
    }

    async drawText() {
        const loader = new FontLoader();    
        return new Promise((resolve) => {      
            loader.load( '../../../node_modules/three/examples/fonts/helvetiker_bold.typeface.json', ( font ) => { 
                const geometry = new TextGeometry("It's Matchday".toUpperCase(), {
                    font: font,
                    size: 45,
                    height: 1,
                    curveSegments: 16,
                    bevelEnabled: true,
                    bevelThickness: 13,
                    bevelSize: 1,
                    bevelOffset: 0,
                    bevelSegments: 20,
                });
                
                const material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,//ffffff,
                    /*emissive: 0x000817, // Emissive color to make it brighter
                    specular: 0xffffff, // Specular color
                    shininess: 100 // Shininess parameter
                    */
                });
                
                geometry.center();

                // Calculate the center of the text along the x-axis
                geometry.computeBoundingBox();

                this.text3d_1 = new THREE.Mesh(geometry, material);

                this.text3d_1.textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
                this.text3d_1.textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
                
                this.text3d_1.position.set(0 , 0 + this.text3d_1.textHeight/2, -300); 
                
                this.scene.add(this.text3d_1)
                resolve();
            });
        });
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        //this.renderer.setClearColor(0x000807, 1);
        this.container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
        this.camera.position.set(120, 200, 250);
        this.camera.lookAt(new THREE.Vector3(0, 20, -100));
        window.addEventListener('resize', ()=>{this.onWindowResized(this)}, false);
      
    
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.setupLights(); 
    }

    setupBackground() {
        // Create a dark background color
        //this.scene.background = new THREE.Color(0x000000);
    
        // Create a cube geometry for the skybox
        const skyboxGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
    
        // Vertex shader for the skybox material
        const skyboxVertexShader = `
            varying vec3 vWorldPosition;
    
            void main() {
    
                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                vWorldPosition = worldPosition.xyz;
    
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
            }
        `;
    
        // Fragment shader for the skybox material
        const skyboxFragmentShader = `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
    
            varying vec3 vWorldPosition;
    
            void main() {
    
                float h = normalize( vWorldPosition + offset ).y;
                gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
    
            }
        `;
    
        // Skybox material
        const skyboxMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x000014) },
                bottomColor: { value: new THREE.Color(0x000000) },
                offset: { value: 400 },
                exponent: { value: 0.6 },
            },
            vertexShader: skyboxVertexShader,
            fragmentShader: skyboxFragmentShader,
            side: THREE.BackSide, // Render the inside faces of the cube
        });
    
        // Create the skybox mesh
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    
        // Add the skybox to the scene
        this.scene.add(skybox);

        this.setupBackground_room();
    }

    setupBackground_room() {
        // Create a dark blue material
        const material = new THREE.MeshPhongMaterial({ color: 0xd00086 }); // Dark blue color
    
        // Create a plane geometry with a size of 1000 by 1000
        const geometry = new THREE.PlaneGeometry(2000, 2000);
    
        // Create a mesh with the geometry and material
        this.plane = new THREE.Mesh(geometry, material);
    
        // Position the plane at x -500, y 0, z -500
        this.plane.position.set(0, 0, -500);
    
        // Rotate the plane to be horizontal
        this.plane.rotation.x = -Math.PI / 2;
    
        // Add the plane to the scene
        this.scene.add(this.plane);
    }
    
    
    setupLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    
        // Directional Light
        const directionalLightColor = "white";
        const directionalLight = new THREE.DirectionalLight(directionalLightColor, 0.5);
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
        
        // Hemisphere Light
        const hemisphereLightColor = "white";
        const hemisphereLight = new THREE.HemisphereLight(hemisphereLightColor, 0x080820, 0.5);

        // Point Light (for reflections)
        const pointLight = new THREE.PointLight("white", 1);
        pointLight.position.set(0, 200, -50);
        
        //this.scene.add(ambientLight);
        //this.scene.add(directionalLight, directionalLight.target);
        //this.scene.add(hemisphereLight);
        this.scene.add(pointLight);
    
        return { ambientLight, directionalLight, pointLight };
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.run();
        this.renderer.render(this.scene, this.camera);
    }

    run() {  
        if (this.stadiumModel) {
            this.stadiumModel.rotation.y += 0.005;
        }
        if (this.text3d_1) {   
            //this.text3d_1.rotation.y += 0.5/30; 
            //this.text3d_1.rotation.z += 0.5/60; 
        }
        if (this.plane) {
            //this.plane.rotation.x -= (Math.PI / 2) / 40;
            //this.plane.rotation.z -= (Math.PI / 2) / 30;
        } 
    }

    async render() { 
        this.setupBackground();
        this.animate();
                 
        //
        if(this.text3d_1 && this.camera) { console.log(this.camera, this.text3d_1);
            const ftRenderAnims = new FTRenderAnims(this.camera, this.text3d_1);
            ftRenderAnims.panToTargetPositions();
        }
    }

    onWindowResized(ctx) {  
        ctx.renderer.setSize(window.innerWidth, window.innerHeight);
        ctx.camera.aspect = window.innerWidth / window.innerHeight;
        ctx.camera.updateProjectionMatrix();
    }

}

export default FtRender;
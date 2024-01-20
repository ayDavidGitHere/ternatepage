import * as THREE from 'three';
import { FlatShading } from 'three';
import { GUI } from 'dat.gui';

class Render {
    constructor(container) {
        this.container = container;
        this.setupScene();
        this.initShapes();

        this.load();
        this.render();
    }

    async load() {
        await this.loadAssets();
    }

    async loadAssets() {
        // Add code for loading assets if needed
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 0, +150);
        this.camera.lookAt(new THREE.Vector3(0, 0, -150));
        window.addEventListener('resize', () => { this.onWindowResized(this); }, false);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.lights = this.setupLights();
        this.setupBackground();
    }

    setupBackground() {
        // Create a cube geometry for the skybox
        const skyboxGeometry = new THREE.BoxGeometry(2000/3, 2000/3, 2000/3);
    
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
                topColor: { value: new THREE.Color(0x7F2B0A) },
                bottomColor: { value: new THREE.Color(0x5F2B5A) },
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
        // Implement your room background setup here if needed
    }

    setupLights() {
        // Point Light (for reflections)
        const pointLight = new THREE.PointLight("white", 16/4); 
        pointLight.position.set(0, 0, 0); 
        this.scene.add(pointLight);
        
        // Directional Light
        const ambientLight = new THREE.AmbientLight( 0x404040, 16/8 ); 
        this.scene.add(ambientLight); 
    
        return {
            pointLight,
            ambientLight, 
        };
    }
    
    initShapes() {
        const diamond1 = this.createDiamond(3, 30, 40, 0xee2110, -12*6, +12, -12, 0); //red
        const diamond2 = this.createDiamond(3, 25, 25, 0xcc1188, +12*5, -12*4, -8, 1); //green
        const diamond3 = this.createDiamond(3, 20, 30, 0x11aa66, +12*3, +12*5, 0, 1); //blue

        this.diamonds = [diamond1, diamond2, diamond3];
        this.scene.add(diamond1, diamond2, diamond3);

        this.createPrimeGem();
    }

    getDiamondTexture() {
        if (!this.diamondTexture) {
            this.diamondTexture = new THREE.TextureLoader().load('assets/textures/metal_shine.jpg');
            // dia_text_1.jpg     
            // silver_metal_background_1.jpg
            // metal_shine.jpg
            console.log("this.diamondTexture:", this.diamondTexture)
        }
        return this.diamondTexture;
    }

    createDiamond(sides, width, height, color, positionX, positionY, positionZ, gap = 0) { 
        const topPrismGeometry = new THREE.CylinderGeometry(0, width / 2, height / 2 - gap/2, sides, 1);
        const bottomPrismGeometry = new THREE.CylinderGeometry(width / 2, 0, height / 2 - gap/2, sides, 1);
  
        const material = new THREE.MeshPhysicalMaterial({
            color,      // Base color of the metal
            metalness: 1,         // A value of 1 makes it fully metallic
            roughness: 1/1.5,       // Adjust the roughness for reflections (0 = smooth, 1 = rough)
            emissive: 0x0,//FFD700,   // Emissive color (adjust as needed)
            envMapIntensity: 25,   // Intensity of the environment map reflection
            side: THREE.DoubleSide,   // Make sure the material is visible from both sides
            transparent: true,        // Enable transparency
            opacity: 0.98              // Set opacity for a subtle effect
        });

        // Create a MeshPhongMaterial with metallic and shiny properties
        const materialB = new THREE.MeshPhongMaterial({
          color,      // Base color of the material
          specular:  0xFFD700,   // Color of the specular highlight (white for a metallic look)
          shininess: 100,       // Adjust shininess for the level of reflectivity
          metal: true           // Set to true for a metallic appearance
        });

        
        const texture = this.getDiamondTexture();
        //if (texture) material.map = texture;


        // Vertex shader 
        const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
        `;

        // Fragment shader
        const fragmentShader = `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        // Lighting uniforms
        uniform vec3 lightColor;
        uniform vec3 lightPosition;

        // Sparkle parameters
        uniform float sparkleIntensity;
        uniform float sparkleSize;

        void main() {
            // Calculate reflection vector
            vec3 viewDirection = normalize(vViewPosition);
            vec3 reflection = reflect(viewDirection, vNormal);

            // Lighting calculations
            vec3 lightDir = normalize(lightPosition - gl_FragCoord.xyz);
            float lambertian = max(dot(vNormal, lightDir), 0.0);
            float specular = pow(max(dot(reflection, normalize(-vViewPosition)), 0.0), 16.0);

            // Apply sparkle effect by adding a blur
            float sparkle = smoothstep(0.0, sparkleSize, sin(gl_FragCoord.x * sparkleIntensity) + sin(gl_FragCoord.y * sparkleIntensity));

            // Final color with lighting and sparkle
            vec3 color = (0.5 * lightColor * lambertian) + (specular * vec3(1.0)) + (sparkle * vec3(1.0));

            gl_FragColor = vec4(color, 1.0);
        }
        `;

        // Create ShaderMaterial
        const materialC = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                lightColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
                lightPosition: { value: new THREE.Vector3(0.0, 10.0, 10.0) },
                sparkleIntensity: { value: 0.1 },
                sparkleSize: { value: 0.02 },
            },
        });

        

        const topPrism = new THREE.Mesh(topPrismGeometry, material);
        const bottomPrism = new THREE.Mesh(bottomPrismGeometry, material);

        topPrism.position.set(0, 0+ height / 4 + gap/2, 0);
        bottomPrism.position.set(0, 0 - height / 4 - gap/2, 0);
    
        const diamond = new THREE.Group();
        diamond.add(topPrism, bottomPrism);

        diamond.position.set(positionX, positionY, positionZ);
        return diamond;
    }    

    createPrimeGem() {
        let ctx = this; 
        function createCrystalGem() {
            const geometry = new THREE.DodecahedronGeometry(5, 0);
        
            // Scale the gem along its axes to create unequal sides
            geometry.scale(1, 1.8, 0.8);
        
            // Create gem materials with different colors for each face
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                emissive: 0x0,
                thickness: 3.0,
                roughness: 0.04,
                metalness: 1/10,
                clearcoat: 0.23,
                clearcoatRoughness: 0,
                transmission: 0.89,
                ior: 1.5,
                flatShading: true,
                opacity: .89,
                depthTest: true, 
                envMapIntensity: 25,
            });  
        
            //const texture = new THREE.TextureLoader().load('assets/textures/dia_text_1.jpg')
            //material.map = texture;
        
            // Create gem mesh with the array of materials
            const mesh = new THREE.Mesh(geometry, material);  
            return { mesh };
        } 
        function createPrimeDiamond_v2(size) {

            // Create geometry
            const geometry = new THREE.IcosahedronBufferGeometry(5, 0);
        
            // Scale the gem along its axes to create unequal sides
            geometry.scale(1, 1.8, 0.8);
          
            // Access position attribute
            const positions = geometry.attributes.position.array;
          
            // Create materials
            let materials = [];  
          
            for (let i = 0; i < 18; i+=9) {
        /*for (let i = 0; i < positions.length; i+=9) {
              
              // Get hue based on position index
              const hue = i/(positions.length/3);  
              
              materials.push(new THREE.MeshBasicMaterial({
                color: 0xf74500,//`hsl(${hue * 360}, 100%, 50%)`)
              })); */
              materials.push(new THREE.MeshPhysicalMaterial({
                reflectivity: 1.0,
                transmission: 1.0,
                roughness: 0,
                metalness: 0,
                clearcoat: 0.3,
                clearcoatRoughness: 0.25,
                color: new THREE.Color(`hsl(${1/5 * 360}, 100%, 50%)`),
                ior: 1.5,
              })); 
            }  
            // Assign materials
            geometry.setAttribute('materialIndex', 
              new THREE.Float32BufferAttribute(materials.map(_ => materials.indexOf(_)), 1)
            );    
            // Create mesh
            const mesh = new THREE.Mesh(geometry, materials);
          
            return {mesh};
          
          }

        // Usage
        const crystalGem = createCrystalGem().mesh;
        //const crystalGem = createPrimeDiamond_v2(20).mesh;
        this.scene.add(crystalGem);

        crystalGem.position.x = 0;
        crystalGem.position.y = 0;
        crystalGem.position.z = 0;
        crystalGem.geometry.scale(4, 4, 4);

        this.primeGem = crystalGem;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.run();
        this.renderer.render(this.scene, this.camera);
    }

    run() {
        if( this.diamonds ) {
            this.diamonds.forEach((diamond, diamondIndex) => {
                // Optionally, you can add logic to make the middle diamond rotate faster
                if (diamondIndex === 0) {
                    diamond.rotation.y += 0.01;
                }
                
                // Optionally, you can add logic to make the middle diamond rotate faster
                if (diamondIndex === 1) {
                    diamond.rotation.y += 0.01;
                } 

                // Optionally, you can add logic to make the middle diamond rotate faster
                if (diamondIndex === 2) {           
                    diamond.rotation.y += 0.01;
                }
            });
        }
        if( this.primeGem ) {
            this.primeGem.rotation.y += 0.005
            //this.primeGem.rotation.x += 0.005
        }
    }

    render() {
        this.animate();
    }

    addKeyEvents() {
        // Add keydown event listener to the document
        document.addEventListener('keydown', (event) => {
            // Handle different key presses
            switch (event.key) {
                case 'ArrowLeft':
                    console.log("ArrowLeft");
                    break;
                case 'ArrowRight':
                    console.log("ArrowRight");
                    break;
            }
        });
    }

    onWindowResized(ctx) {
        ctx.renderer.setSize(window.innerWidth, window.innerHeight);
        ctx.camera.aspect = window.innerWidth / window.innerHeight;
        ctx.camera.updateProjectionMatrix();
    }
}

export default Render;
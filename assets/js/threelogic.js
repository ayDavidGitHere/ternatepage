//import * as THREE from 'three';
//import * as THREE from '../../node_modules/three/build/three.js';
import * as THREE from 'three';//'../../node_modules/three/src/Three.js';
import {OBJLoader} from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {GLTFLoader} from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
let colors = {}
colors.bg_secondary = window.getComputedStyle(document.documentElement).getPropertyValue("--bg-secondary");
let assets_url = window.location.origin+"/assets";
console.log(assets_url)


function ThreeLogic(container) {
    let camera, scene, renderer;
    let lights, cubes;
    let cubeAnimation = ()=>{}, particleAniation = ()=>{}
    function LoadAssets(finished) {
        finished()
    }
    function init() {
        renderer = new THREE.WebGLRenderer({
             alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.set(0, 15.0, 100);
        camera.lookAt(new THREE.Vector3(0, 20, -100));
        lights = 
            addLights();
        //cubes = addCubes(scene);
        addParticles();
        window.addEventListener('resize', onWindowResized, false);
    }
    function animate() {
        makeAnimation();
        requestAnimationFrame(animate);
        render();
    }
    function render() {
        renderer.render(scene, camera);
    }
    function onWindowResized() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    function addLights() {
    //mainLight
        let mainLightColor = "white";//"#ffffff"
        let mainLight = new THREE.DirectionalLight( mainLightColor, 0.5);
        mainLight.position.set( 0, 50, 50 );
        mainLight.target.position.set( 0, -50, -50 );
        mainLight.castShadow = true;
        mainLight.shadow.camera.visible = true;
        {
        let d = 200;
        mainLight.shadow.camera.left = - d;
        mainLight.shadow.camera.right = d;
        mainLight.shadow.camera.top = d;
        mainLight.shadow.camera.bottom = -d;
        mainLight.shadow.camera.far = 100;
        mainLight.shadow.camera.fov *= 1;
        mainLight.shadow.camera.near = 0;
        mainLight.shadow.mapSize.width = 2 * 512;
        mainLight.shadow.mapSize.height = 2 * 512;
        mainLight.shadow.darkness = 1;
        }
        scene.add(mainLight, mainLight.target);
    //hemiLight
        let hemiLight = new THREE.HemisphereLight(mainLightColor, mainLightColor, 0.99);
        scene.add(hemiLight);
    //ambientLight
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        //scene.add(ambientLight)
    //spotLight
        let spotLight = new THREE.SpotLight ("red", 5);
        spotLight.position.set(0, 0, 0 );
        spotLight.castShadow = true;
        spotLight.angle = 3*Math.PI/3;
        spotLight.distance = 200; //spotLight.penumbra = 1;
        spotLight.power = 5; //spotLight.decay *= 1.1
        spotLight.lookAt(new THREE.Vector3( 0, 50, 50));
        //scene.add(spotLight);
    //pointLight
        let pointLight = new THREE.PointLight ("crimson", 10);
        pointLight.position.set(0, 0, 0 );
        pointLight.castShadow = true;
        scene.add(pointLight);
        return {mainLight, pointLight};
    }
    function addCubes() {
        function makeCube(position, color) {
            color = (new THREE.Color(color))
            color.setRGB((50+Math.random()*100)/255, (50+Math.random()*100)/255, (50+Math.random()*100)/255);
            let material = new THREE.MeshLambertMaterial({
                color: color,
            });
            let cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
            scene.add(cube);
            cube.position.x = position[0];
            cube.position.y = position[1];
            //cube.position.z = position[2];
            cube.rotspeedx = 0.025+Math.random()*0.05;
            return cube;
        }
        let cubes = [];
        for (let i = 0; 9 > i; i++) {
            cubes.push(makeCube([-150+Math.random()*150, 0+Math.random()*150, 0+Math.random()*50], 0x00BBBB));
        }
        //cubeAnimation
        cubeAnimation = ()=>{
            cubes.map(cube=>{
                cube.rotation.y += cube.rotspeedx;
                cube.rotation.x += cube.rotspeedx;
                cube.rotation.z += cube.rotspeedx;
                if(!cube.destx || Math.random()<0.01){
                    cube.destx = cube.position.x+100-Math.random()*200;
                    cube.desty = cube.position.y+100-Math.random()*200;
                    cube.destz = cube.position.z+100-Math.random()*200;
                }
                if(cube.position.x<cube.destx)cube.position.x += 0.1;
                else cube.position.x -= 0.1;
                if(cube.position.y<cube.desty)cube.position.y += 0.1;
                else cube.position.y -= 0.1;
                if(cube.position.z<cube.desty)cube.position.z += 0.1;
                else cube.position.z -= 0.1;
            });
            camera.position.set(0, 100, 100);
            camera.target = new THREE.Vector3(0, -100, -100);
        }
        return cubes;
    }
    function addModel(){
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '../../node_modules/three/examples/js/libs/draco/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load(
        	//'http://100.115.92.2:1111/canvas//models/model.gltf',
        	assets_url+'/canvas//models/chariot.gltf',
        	function ( gltf ) {
        		scene.add( gltf.scene );
        		gltf.animations; // Array<THREE.AnimationClip>
        		gltf.scene; // THREE.Group
        		gltf.scenes; // Array<THREE.Group>
        		gltf.cameras; // Array<THREE.Camera>
        		gltf.asset; // Object
        		gltf.scene.scale.x *= 20;
        		gltf.scene.scale.y *= 20;
        		gltf.scene.scale.z *= 20;
        		
        	},
        	function ( xhr ) {
        		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        	},
        	function ( error ) {
        		console.log( 'An error happened' );
        	}
        ); 
        console.log("to load model")
    }
    function addParticles(){
        let headparticle = function() {   
            //if ( !Modernizr.webgl ) {alert('Your browser dosent support WebGL');}
            var mouseX = 0, mouseY = 0;
            var p;
            // texture
           var manager = new THREE.LoadingManager();
           manager.onProgress = function ( item, loaded, total ) {
              //console.log('webgl, twice??');
              //console.log( item, loaded, total );
           };
        
        
           // particles
            var p_geom = new THREE.BufferGeometry();
            var p_material = new THREE.PointsMaterial({
              color: new THREE.Color(colors.bg_secondary),
              size: 0.55
            });
            p_material.color.setStyle(colors.bg_secondary);
            var p = new THREE.Points(
              p_geom,
              p_material
            );
            p_geom.verticespoints = [];
            p_geom.vertices = null;


           // model
           var loader = new OBJLoader( manager );
           loader.load('../../assets/canvas/models/head.obj', function ( object ) {
              console.log("head model loaded");
              object.traverse( function ( child ) { 
                 if ( child instanceof THREE.Mesh || child.isMesh ) {
                    var scale = 8;
                    p_geom.vertices = child.geometry.getAttribute("position").array;
                 }
              });
              p_geom.setAttribute('position', new THREE.BufferAttribute( p_geom.vertices, 3 ));
              p_geom.center();
              p.position.set(30, 20, 20);
              p.scale.x = p.scale.y = p.scale.z += 0.75;
              scene.add(p);
              particleAniation = function(){
                function pendulum(sy,py,d0,d1,lim0,lim1){
                    sy = sy==d0&&py>lim0?d0:sy
                    sy = sy==d0&&py<lim0?d1:sy
                    sy = sy==d1&&py<lim1?d1:sy
                    sy = sy==d1&&py>lim1?d0:sy
                    return sy;
                }
                
                py = p.rotation.y;
                sy = pendulum(sy,py,-0.2,+0.2,-1.6,+1.6);
                p.rotation.y += 0.05*sy;/*
                py = p.scale.y;
                sy = pendulum(sy,py,-0.2/10,+0.2/10,2/4+1,+2/4+8);
                p.scale.x = p.scale.y = p.scale.z += sy;*/
              }
              /*
              let sy = -0.2/10, py = null;
              p.scale.x = p.scale.y = p.scale.z += 0.25;*/
              let sy = -0.2, py = null;
              p.rotation.y = 0;
           });
           return p;
        } 
        headparticle();
    }
    function makeAnimation(){
        cubeAnimation();
        particleAniation();
    }
    /////
    LoadAssets(function() {
        init();
        animate();
    });
}


export default ThreeLogic;
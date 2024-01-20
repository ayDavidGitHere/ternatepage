import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'; 
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'; 
import {TextGeometry} from 'three/addons/geometries/TextGeometry';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';  
import {TeapotGeometry} from 'three/addons/geometries/TeapotGeometry.js';
import {LightningGeometry} from 'three/addons/geometries/BoxLineGeometry.js';




let assets_url = window.location.origin+"/assets";
if(window.location.href.includes("ternatepage")) 
assets_url = "https://aydavidgithere.github.io/ternatepage/assets";
let mousePos = {x:.5,y:.5};
document.addEventListener('mousemove', function (event) {
    event.preventDefault(); mousePos = {x:event.clientX/window.innerWidth, y:event.clientY/window.innerHeight};
});
document.addEventListener('touchmove+', function (event) {
    event.preventDefault(); mousePos = {x:event.clientX/window.innerWidth, y:event.clientY/window.innerHeight};
});
let superctx = {preloads:{}, preloaders:{}};












function Start(container, sizing = {}, objectSizingAttrs={objectScale:12, particleScale:1}, objectAnimAttrs={}) {
    let objectScale = objectSizingAttrs.objectScale;
    let particleScale = objectSizingAttrs.particleScale;
    let particleColor = objectSizingAttrs.particleColor;
    let ctx = this;
    let camera, scene, renderer, containersize;
    let lights, cubes, texts;
    let cubeAnimation = ()=>{}, moveSphereAnimation = false, particleAnimation = ()=>{};
    let enterSphereAnimation = false, enterParticleInSphereAnimation, animations = [];
    let particlesList = [];



    function init() {  
        renderer = new THREE.WebGLRenderer({
             alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        containersize = {clientWidth: container.clientWidth, clientHeight: container.clientHeight, ...sizing}; 
        renderer.setSize(containersize.clientWidth, containersize.clientHeight);
        renderer.setClearColor(0x007777, 0);
        container.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, containersize.clientWidth/containersize.clientHeight, 1, 4000);
        camera.position.set(0, 15.0, 100);
        camera.lookAt(new THREE.Vector3(0, 20, -100));
        lights = 
            addLights();
        //cubes = addCubes(scene);
        //texts = addTexts(scene)
        ctx.particleManager = manageParticles();
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
    function addTexts() {
        let material = new THREE.MeshLambertMaterial({
                color: 0x00BBBB,
            });
        let text = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), material);
        scene.add(text);
        text.position.x = 0;
        text.position.y = 100;
        text.position.z = 50;
        return text;
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
    function manageParticles(){
        let p, p_material, p_geom, animopts; 

        function initparticles(){
                // particles
                p_geom = new THREE.BufferGeometry();
                p_material = new THREE.PointsMaterial({size: particleScale*1*containersize.clientWidth/400});
                p = new THREE.Points(
                  p_geom,
                  p_material
                );
                p.animsettings = {... objectAnimAttrs}; 
                //console.log("\nautopendulumscale ", p.animsettings.autopendulumscale, "\nobjectScale ", objectScale, "\np ", p.scale.y);
                
                
                let sy = null, py = null;
                function pendulum(sy,py,d0,d1,lim0,lim1){
                    sy = sy==d0&&py>lim0?d0:sy
                    sy = sy==d0&&py<lim0?d1:sy
                    sy = sy==d1&&py<lim1?d1:sy
                    sy = sy==d1&&py>lim1?d0:sy
                    return sy;
                }

                function infinitePendulum(value, min, max, increment, decrement) {
                    // Swap min and max if max is less than min
                    if (max < min) {
                        [min, max] = [max, min];
                    } 
                    
                    let direction = 1;
                    if (value >= max) { 
                        direction = -1;
                    } else if (value <= min) { 
                        direction = 1;
                    } 

                    return direction === 1 ? increment : decrement;
                }

                particleAnimation = function(){
                    animopts = p.animsettings;
                    ;(function (){
                        if(!animopts.autopendulumrotate) return;
                        //rotation
                        py = p.rotation.y;
                        if(sy==null) sy = -0.2;
                        sy = pendulum(sy,py,-0.2,+0.2,-1.6,+1.6);
                        p.rotation.y += 0.05*sy;
                    })();
                    ;(function (){
                        if(!animopts.autopendulumscale) return;
                        //scale
                        let minObjectScale = objectScale;
                        let maxObjectScale = animopts.autopendulumscale;
                        if (maxObjectScale < minObjectScale) [minObjectScale, maxObjectScale] = [maxObjectScale, minObjectScale];                        
                        let scaleInc = Math.abs(maxObjectScale - objectScale)/100;
                        let scaleDec = - scaleInc; 
                        
                    
                        if(p.scale.x >= maxObjectScale) p.scale_pendulum_direction = -1;
                        if(p.scale.x <= minObjectScale) p.scale_pendulum_direction = 1;

                        p.scale_pendulum_direction = p.scale_pendulum_direction ?? 1;
                        let adj = p.scale_pendulum_direction == 1 ? scaleInc : scaleDec;

                        p.scale.x = p.scale.y = p.scale.z += adj;
                    })();
                    ;(function (){
                        if(!animopts.autorotate) return;
                        //rotation
                        let [vx,vy,vz] = animopts.autorotate;
                        p.rotation.x += 0.05*vx;
                        p.rotation.y += 0.05*vy;
                        p.rotation.z += 0.05*vz;
                    })();
                    ;(function (){
                        if(!animopts.mouserotate) return;
                        p.rotation.x = (mousePos.y-0.5) * Math.PI;
                        p.rotation.z = (mousePos.x-0.5) * Math.PI;
                        p.rotation.y = (mousePos.x-0.5) * Math.PI;
                    })();
                }
                animations.push(particleAnimation);   
        }
        function removeAllParticles(){
            particlesList.map(p=>{
                scene.remove(p)
            });
            particlesList = [];
        }
        function addParticle(typeto){ 
            camera.position.set(0, 15.0, 100);
            camera.lookAt(new THREE.Vector3(0, 20, -100)); 
            if(typeto=="head") particles.head();
            if(typeto=="fish") particles.fish();
            if(typeto=="controller") particles.controller();
            if(typeto=="circle") particles.circlegeometry();
            if(typeto=="teapot") particles.teapotgeometry();
            if(typeto=="lightning") particles.lightninggeometry();
        }
        function transformParticle(typeto){
            if(typeto=="plane") particles.planeparticle(true);
            if(typeto=="head") particles.headgeometry(true);
        }
        function getRandomVertex(geometry){
            let positionAttribute = geometry.getAttribute( 'position' );
            let vertex = new THREE.Vector3();
            let ind = Math.floor(Math.random()*positionAttribute.count); console.log(positionAttribute, ind)
            vertex.fromBufferAttribute( positionAttribute, ind); // read vertex
            // do something with vertex
            //positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z ); // write coordinates back
            console.log(vertex,  ind, camera.position);
            return vertex;
        } 
        function enterSphere(){
            if(!camera.enterSphere) camera.enterSphere = false;
            camera.enterSphere = !camera.enterSphere;
            
            if(enterSphereAnimation) return;
            enterSphereAnimation = function(){
                if(camera.enterSphere)
                if(camera.position.z>p.position.z-10&&camera.position.z<p.position.z+10) {}
                else camera.position.z -= 2.0-1.9*(p.position.z/camera.position.z);
                
                
                if(!camera.enterSphere)
                if(camera.position.z<p.position.z+70) camera.position.z += 2.0-1.9*(camera.position.z/(p.position.z+70)); 
            }
            animations.push(enterSphereAnimation);
        }
        function moveSphere(limit){
            if(!camera.moveSphere) camera.moveSphere = false;
            camera.moveSphere = !camera.moveSphere;
            
            //if(!moveSphereAnimation) return;
            moveSphereAnimation = function(){
                if(p.position.x>limit-1 && p.position.x<limit+1) return;
                p.position.x += (p.position.x>limit?-1:1)/5; 
            }
            animations.push(moveSphereAnimation);
        }
        function enterParticleInSphere(){
            if(!camera.enterParticleInSphere) camera.enterParticleInSphere = false;
            camera.enterParticleInSphere = !camera.enterParticleInSphere;
            
            
            let vertex = getRandomVertex(p.geometry);
            if(enterParticleInSphereAnimation) return;
            enterParticleInSphereAnimation = function(){ 
                if(camera.enterParticleInSphere)
                if(camera.position.z>p.position.z-100){ camera.position.z -= 2.0; camera.lookAt(camera.position.x, camera.position.y, camera.position.z-30)}
                else {} 
            }
            animations.push(enterParticleInSphereAnimation);
        } 
        function doparticles(object, parameters = {}, animsettings = {}) { 
              p_material = p.material;
              p_geom = p.geometry;
              p.rotation.x = p.rotation.y = p.rotation.z = 0;
              p.scale.x = p.scale.y = p.scale.z = 1;
                
                
             
              let verticeslist = []; let vertices = null;
              let verticestotal_length = 0; let verticestotal_length2 = 0; let vind = 0; 

              if(object.traverse !== undefined)
              object.traverse( function ( child ) {  
                 if ( child instanceof THREE.Mesh || child.isMesh) {
                    var scale = 8;
                    verticeslist.push(child.geometry.getAttribute("position").array);
                    verticestotal_length += child.geometry.getAttribute("position").array.length; vind++;
                 }
              });
              vertices = new Float32Array(verticestotal_length);
              verticeslist.map(v=>{
                  vertices.set(v, verticestotal_length2);
                  verticestotal_length2 += v.length; 
              })
              p_geom.vertices = vertices; 
              
              
              
              let p_postn = parameters.postn?parameters.postn:[30,20,20];
              let p_color = particleColor;
              p.material.color = new THREE.Color(p_color);
              p_geom.setAttribute('position', new THREE.BufferAttribute( p_geom.vertices, 3 ));
              p_geom.center();
              p.position.set(p_postn[0], p_postn[1], p_postn[2]);
              p.scale.x = p.scale.y = p.scale.z = objectScale;  
              scene.add(p); 
              particlesList.push(p); 

              //animating
              p.animsettings = animsettings; 
              if(!p.animsettings.autopendulumrotate){  p.rotation.y = 0;  }
              return p;
        }
        function createParticle(modelName, modelPath) {
          return function(procedural=false) {
            function load(callback=function() {}) {
              if (superctx.preloads[`${modelName}obj`]) {
                let object = superctx.preloads[`${modelName}obj`];
                callback(object);
                return object;
              }
              let manager = new THREE.LoadingManager();
              manager.onProgress = function(item, loaded, total) {};
              let loader = new OBJLoader(manager);
              loader.load(`${assets_url}${modelPath}`, function(object) {
                superctx.preloads[`${modelName}obj`] = object;
                callback(object);
                return object;
              });
            }
        
            function make() {
              load(function(object) {  
                doparticles(object, 
                        { postn: [0, 15.0, camera.position.z - 70] }, 
                        { ...objectAnimAttrs }
                );
              });
            }
        
            if (procedural === false) make();
            return { load, make };
          };
        }   
        function getParticles(){
            return { 
                head: createParticle("head", "/canvas/models/head.obj"),
                
                fish: createParticle("fish", "/canvas/models/fishv1/fish.obj"),
                
                controller: createParticle("controller", "/canvas/models/controller.obj"),
        
                spheregeometry: function() {   
                    let material = new THREE.MeshLambertMaterial({
                            color: 0x00BBBB,
                        });
                    let text = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), material);
                    scene.add(text);
                    text.position.x = 0;
                    text.position.y = 100;
                    text.position.z = 50; //console.log("circle", text)
                    doparticles(text, {color: "green"}, {autopendulumrotate: 1})
                },
                
                circlegeometry: function() {   
                    let material = new THREE.MeshLambertMaterial({
                            color: 0x00BBBB,
                        });
                    let text = new THREE.Mesh(new THREE.OctahedronGeometry(10, 10, 10), material);
                    scene.add(text);
                    text.position.x = 0;
                    text.position.y = 100;
                    text.position.z = 50; 
                    //doparticles(text, {postn: [-15,+15.0,camera.position.z-70]}, {autorotate: [0.0521,0,0.025]});
                    doparticles(text, {postn: [+0,+15.0,camera.position.z-70]}, {autorotate: [0.0521,0,0.025]})
                },

                teapotgeometry: function() {   
                    let material = new THREE.MeshLambertMaterial({
                            color: 0x00BBBB,
                        });
                    let text = new THREE.Mesh(new TeapotGeometry(10, 10), material);
                    scene.add(text);
                    text.position.x = 0;
                    text.position.y = 100;
                    text.position.z = 50; 
                    //doparticles(text, {postn: [-15,+15.0,camera.position.z-70]}, {autorotate: [0.0521,0,0.025]});
                    doparticles(text, {postn: [+0,+15.0,camera.position.z-70]}, {autorotate: [0.0521,0,0.025]});
                },
                
                textgeometry: function() {   
                    const loader = new FontLoader();
                    loader.load( '../../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
                        const geometry = new TextGeometry( 'Hekk', {
                            font: font,
                            size: 16,
                            height: 5,
                            curveSegments: 5,
                            bevelEnabled: true,
                            bevelThickness: 2,
                            bevelSize: 0.8,
                            bevelOffset: 0,
                            bevelSegments: 5
                        });
                        let material = new THREE.MeshLambertMaterial({color: 0x00bb88,});
                        let text = new THREE.Mesh(geometry, material);
                        scene.add(text)
                        doparticles(text, {postn: [0,+15.0,20], color: "green"}, {autorotate: [0.0521,0,0.025]})
                    });
                },

                lightninggeometry: function() {   
                    let material = new THREE.MeshLambertMaterial({
                            color: 0x00BBBB,
                        });
                    let text = new THREE.Mesh(new TeapotGeometry(6.0, 6.0), material);
                    scene.add(text);
                    text.position.x = 0;
                    text.position.y = 100;
                    text.position.z = 50; 
                    //doparticles(text, {postn: [-15,+15.0,camera.position.z-70]}, {autorotate: [0.0521,0,0.025]});
                    doparticles(text, {postn: [+0,+15.0,camera.position.z-70]}, {autorotate: [0.0521,0,0.025]});
                },
            
                planeparticle: function() {
                    let p = particlesList[0];
                    let p_geom = p.geometry;
                    let pgv = p_geom.vertices;
                    for(let i=0; pgv.length>i+3; i+=3){
                        let vx = pgv[i], vy = pgv[i+1], vz = pgv[i+2];
                        //pgv[i] += -2+Math.floor(Math.random()*3); pgv[i+1] += -2+Math.floor(Math.random()*3); pgv[i+2] += -2+Math.floor(Math.random()*3)
                        pgv[i] += -8;
                    }
                    p_geom.setAttribute('position', new THREE.BufferAttribute( p_geom.vertices, 3 ));
                    p_geom.center();
                }, 
            }
        }
        
        let particles = getParticles();

        superctx.preloaders.head = particles.head;

        superctx.preloaders.fish = particles.fish;
        
        superctx.preloaders.controller = particles.controller;

        initparticles();

        return { initparticles, removeAllParticles, addParticle, transformParticle, enterSphere, enterParticleInSphere, moveSphere };
    }
    function makeAnimation(){
        cubeAnimation(); 
        animations.map(animation=>{
            animation();
        })
    }
    function LoadAssets(finished) {
        finished();
    }
    

    LoadAssets(function() {
        init();
        animate();
    });
}




function processContainerAttrs(container) {
    let attrs = {}; 

    let draw  = container.getAttribute("draw") ?? "head";
    console.log("drawing: ", draw);  

    let objectScale  = Number(container.getAttribute("size") ?? 1);
    //console.log("objectScale: ", objectScale);
    
    let particleScale  = Number(container.getAttribute("p-size") ?? 1); 
    //console.log("particleScale: ", particleScale);
    
    let particleColor  = (container.getAttribute("p-color") ?? "crimson");
    if(particleColor.includes("--")) 
        particleColor = window.getComputedStyle(document.documentElement).getPropertyValue(particleColor);
    console.log("particleColor: ", particleColor, typeof particleColor);

    let objectSizingAttrs = {}; 
    objectSizingAttrs.objectScale = objectScale;
    objectSizingAttrs.particleScale = particleScale;
    objectSizingAttrs.particleColor = particleColor;


    let objectAnimAttrs = {};
    if(container.hasAttribute("zoominout_auto")) objectAnimAttrs.autopendulumscale = Number(container.getAttribute("zoominout_auto") ?? 1);
    if(container.hasAttribute("rot_mouse")) objectAnimAttrs.mouserotate = 1;

    attrs.draw = draw;
    attrs.objectSizingAttrs = objectSizingAttrs; 
    attrs.objectAnimAttrs = objectAnimAttrs; 
    //console.log("attrs", attrs)

    return attrs;
}
function setAnims(){
    [...document.querySelectorAll(".page .sections[app-page]:not([gone]) three-anim")]
    .map(container=>{ 
        if(container.getAttribute("loaded") && container.getAttribute("reloadable")==undefined)
        return;
        container.setAttribute("loaded", "true");

        container.width = "100%";
        container.height = "100%";

        container.style.width = "100%";
        container.style.height = "100%"; 
 

        let attrs = processContainerAttrs(container); 

        let start = new Start(container, {clientHeight: container.clientHeight}, attrs.objectSizingAttrs, attrs.objectAnimAttrs);
        start.particleManager.addParticle(attrs.draw);
    });
}//EO setAnims
function preloadAssets(callback){
    console.log("preloadAssets")
    let container = document.body.children[0]; 

    let start = new Start(container, {clientHeight: container.clientHeight});
    superctx.preloaders.head(true).load(callback);
    superctx.preloaders.fish(true).load(callback);
    superctx.preloaders.controller(true).load(callback);
}
let threeanims = {setAnims, preloadAssets};
document.addEventListener("DOMContentLoaded", function(){threeanims.setAnims();});
export default threeanims;
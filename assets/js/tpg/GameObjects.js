import * as THREE from 'three';





/*
let PrismGeometry = function ( vertices, height ) { 
    var Shape = new THREE.Shape(); 
    ( function f( ctx ) { 
        ctx.moveTo( vertices[0].x, vertices[0].y ); 
        for (var i=1; i < vertices.length; i++) { 
            ctx.lineTo( vertices[i].x, vertices[i].y ); 
        }
         ctx.lineTo( vertices[0].x, vertices[0].y );
    } )( Shape ); 

    var settings = { }; 
    settings.amount = height; 
    settings.bevelEnabled = false;


    console.log("settings"); 
    new THREE.ExtrudeGeometry( this, Shape, settings );
    console.log("called");  
}; 

PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype ); 
*/
class PrismGeometry extends THREE.ExtrudeGeometry {
    constructor(vertices, height){
        super(new THREE.Shape(vertices), {depth: height, bevelEnabled: false});
    }
}


class GameObjects{  

    constructor(ctx){
        this.ctx = ctx;
        this.objects = []; 

        this.addObjects(
            this.createPrism(), 
            this.createCuboid(), 
            this.createPrism(), 
            this.createPrism(), 
            //this.createCube()
        ); 
    }

    runAnim(){  
        this.objects.map(object=>{
            //object.rotation.y += -Math.PI/25;
        })
        //.position.z > this.ctx.camera.position.z
    } 

    createPrism(){ 
        const prismHeight = 40;
        let A = new THREE.Vector2(0, 0);
        let B = new THREE.Vector2(30, 10);
        let C = new THREE.Vector2(20, 50);
        const randomColor = Math.floor(Math.random()*16777215).toString(16); 

        const prismGeometry = new PrismGeometry([A, B, C], prismHeight);
        const prismMaterial = new THREE.MeshBasicMaterial({ color: parseInt(randomColor, 16) });
        const prism = new THREE.Mesh(prismGeometry, prismMaterial);
        prism.position.set(0, 20, 0);
        prism.rotation.y += Math.PI/2.3;
        this.ctx.scene.add(prism); 

        return prism;
    }

    createCuboid(){
        const prismWidth = 40;
        const prismGeometry = new THREE.BoxGeometry(prismWidth, prismWidth, prismWidth*2);
        const prismMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const prism = new THREE.Mesh(prismGeometry, prismMaterial);
        prism.position.set(0, 20, 0);
        this.ctx.scene.add(prism); 

        return prism;
    }

    addObjects(...args){
        this.objects.push(...args);
        this.objects.map((object, objectIndex)=> {
            object.position.z -= objectIndex * 70;
            object.position.y += objectIndex * 70;
        });
    };

}

export default GameObjects;
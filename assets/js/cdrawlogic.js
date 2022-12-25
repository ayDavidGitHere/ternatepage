let cdrawlogic = {};
cdrawlogic.writeBoxs = function(el){
    
    
    
    
    
    
    
    
    
    
    
        
        
        
    
    
    
    let setCanvasStyle = function(a, settings){
            if(settings.type == "background"){
                a.width = a.parentNode.scrollWidth;
                a.height = a.parentNode.scrollHeight;
                //bad fixrs
                a.style.zIndex = -100;
                a.parentNode.style.overflow =
                (a.parentNode!=document.body?"hidden":0);
            }
            a.style.position = settings.position;
            if(settings.pinToTop ){
                if( a.style.position == "absolute" ||
                a.style.position == "relative"){
                a.style.top = 0+"%";
                a.style.left = 0+"%";
                }
                if( a.style.position == "static"){
                a.style.marginLeft = 0;
                a.style.marginTop = 0;
                }
            }//EO if
    }
    function initWorld(){ 
        let a = document.createElement("canvas");
        el.appendChild(a)
        let b = a.getContext("2d");
        setCanvasStyle(a, {type: "fill", alpha: 0, position: "static", pinToTop: true});   
        a.style.position = "absolute";
        a.style.top = "50%";
        a.style.left = "50%"
        a.style.display = "block";
        a.style.margin = "0 auto"
        a.style.transform = "translate(-50%,-50%)";
        return {canvas: a, context: b};
    }
    
    function run(){ 
         let init = initWorld();
         window.Game = {canvas: init.canvas, context:init.context, paused:false}; 
         draw();
    }    
    run();
                     
                     
                     
    function draw(){
        let {canvas: a, context: b} = Game;
        let wh = a.parentNode.clientWidth/2;
        let CW = a.width = wh;
        let CH = a.height = wh;
        let CR = MATH$.resultantOf(CW, CH);
        Game.CW = CW, Game.CH = CH;
        let scene = new CDraw.useScene(b);
        let bgRect = new CDraw.rect(0,CW,0,CH,"_transparent");
        scene.add(bgRect);
        let text = new CDraw.text("+60px iFi", "COOL ASF", CW/2, CH/2, "_white");
        //text.alpha = 0;
        scene.add(text);
        //temporary hidden
        a.style.opacity = "0"
        
        
        setTimeout(function(){
            a.style.opacity = "1"
            let pixels = null;
            CDraw.functions.getOpaquePixels(b, 0, CW, 0, CH, [0,null,null,null], function(pixels_){
                pixels = pixels_
            });
            
            
            
            let unpickedPixels = [...pixels];
            function sortUnpickedPixelsByClosest(pixel){
                if(pixel ==null )     return;
                unpickedPixels = unpickedPixels.sort((a, b)=>{
                    let hypa = Math.sqrt(Math.pow((pixel.x-a.x),2) + 
                                        Math.pow((pixel.y-a.y),2));
                    let hypb = Math.sqrt(Math.pow((pixel.x-b.x),2) + 
                                        Math.pow((pixel.y-b.y),2));
                    return hypa-hypb;
                })
            }
            function findClosestUnpickedPixelsPreSort(){
                let ppixel = unpickedPixels[0];
                unpickedPixels.splice(0,1);
                return ppixel;
            }
            function findClosestUnpickedPixels(pixel) {
                if(unpickedPixels.length == 0) return null;
                if(pixel == null) 
                pixel = Math.floor(Math.random()*unpickedPixels.length);
                if(typeof pixel == "number") {
                    let rInd = pixel;
                    let ppixel = unpickedPixels[rInd];
                    unpickedPixels.splice(rInd, 1);
                    return ppixel;
                }
                let cpixel = {}; let cpixelInd = 10000; let chyp = 10000;
                for(let i=0; unpickedPixels.length>i; i++){
                    let upixel = unpickedPixels[i];
                    let hyp = Math.sqrt(Math.pow((pixel.x-upixel.x),2) + 
                                        Math.pow((pixel.y-upixel.y),2));
                    if(hyp<chyp){
                        cpixel = upixel; cpixelInd = i; chyp = hyp;
                    }
                }
                unpickedPixels.splice(cpixelInd, 1)
                return cpixel;
            }
            
            
            
            let nextPixel = null;
            let startpoint = 0;//0 || null;
            let speed = 2; // 1 to 10;
            nextPixel = findClosestUnpickedPixels(startpoint); console.log(nextPixel)
            function loop() {
                for(let i=0; speed*pixels.length/300>i; i++){
                if(nextPixel == null) return;
                let pcol = nextPixel.rgba;
                let colrgb = `rgba(${pcol[0]}, ${pcol[1]}, ${pcol[2]}, ${pcol[3]})`;
                scene.add(new CDraw.rect(nextPixel.x,1,nextPixel.y,1,"_"+colrgb));
                nextPixel = findClosestUnpickedPixels(nextPixel);
                }
                requestAnimationFrame(loop)
            }
            loop();
            text.alpha = 0;
        }, 2000);
        
        
        
        
        
        
        function animate(){requestAnimationFrame(animate);}
        animate();
    }//EO draw
    
          
        
    
    
    
    
    
}//EO writeBoxs





export default cdrawlogic;
CDraw.textAndParticles = function (scene, CR, CW, CH, textSize) {
    const fontSize = CR / 450 * textSize;
    const firstText = new CDraw.text("bold +*" + fontSize + "pt arial", "firzt Text", CW / 2, CH / 2, "_red", 1000);
    scene.add(firstText);

    const randomParticles = [];

    setTimeout(function () {
        CDraw.getOpaquePixels(0, CW, 0, CH, function (oPixelPosition) {
            scene.remove(firstText);
            console.log(oPixelPosition.length);

            oPixelPosition.forEach((val) => {
                const randmity = 1 - 590 / oPixelPosition.length;
                const dispersionX = 30 * CH / 300;

                if (Math.random() > randmity) {
                    const particle = new CDraw.arc(
                        val.x - dispersionX + Math.random() * dispersionX,
                        CH / (1.5 - Math.random() * 0.5),
                        CR / 3000 * (4 + 4 / MHelp.randOpt(-2, +2, +2.5)),
                        0, 6.3,
                        "_blue"
                    );
                    particle.destination = { x: val.x, y: val.y };
                    particle.speed = (0.4 + Math.random() * 0.5) * CR / 450;
                    scene.add(particle);
                    randomParticles.push(particle);
                }
            });

            update();
        });
    }, 500);

    function update() {
        randomParticles.forEach((particle) => {
            if (particle.x < particle.destination.x) {
                particle.x += particle.speed / 4;
            }
            if (particle.x > particle.destination.x) {
                particle.x -= particle.speed / 4;
            }
            if (particle.y < particle.destination.y) {
                particle.y += particle.speed;
            }
            if (particle.y > particle.destination.y) {
                particle.y -= particle.speed;
            }
        });

        requestAnimationFrame(update);
    }
}

CDraw.fontLoadedListener = function (fontFamily, callback, noload_callback=function(){}) {
    let retries = 5;
    let prevData = null;

    let checkReady = function () {
        let canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        let context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,1.0)';
        context.fillRect(0, 0, 20, 20);
        context.font = '16pt ' + fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgba(255,255,255,1.0)';
        context.fillText("A", 10, 18);
        let data = context.getImageData(2, 10, 1, 1).data;


        if (prevData == null || comparePixelData(data, prevData)) {
            console.log(`FontFamily ${fontFamily} is not yet available, retrying ...`);
            if (retries > 0) {
                setTimeout(checkReady, 200);
                retries -= 1/5;
            }else {
                noload_callback();
                console.log(`Tries excedded, calling noload_callback`);
            }
        } else {
            console.log(`FontFamily ${fontFamily} is loaded`);
            if (typeof callback === 'function') {
                callback();
            }
        } 

        prevData = data;
    };

    var comparePixelData = function (data1, data2) {
        return data1[0] === data2[0] && data1[1] === data2[1] && data1[2] === data2[2];
    };

    checkReady();
};


CDraw.writeText = function (el, textStyle, textValue, textColor, writeTime=2) {
    let completedWrite = function () { 

    };

    let setCanvasStyle = function (a, settings) {
        if (settings.type == "background") {
            a.width = a.parentNode.scrollWidth;
            a.height = a.parentNode.scrollHeight;
            //bad fixrs
            a.style.zIndex = -100;
            a.parentNode.style.overflow =
                (a.parentNode != document.body ? "hidden" : 0);
        }
        a.style.position = settings.position;
        if (settings.pinToTop) {
            if (a.style.position == "absolute" ||
                a.style.position == "relative") {
                a.style.top = 0 + "%";
                a.style.left = 0 + "%";
            }
            if (a.style.position == "static") {
                a.style.marginLeft = 0;
                a.style.marginTop = 0;
            }
        }//EO if
    };

    function initWorld() {
        let a = document.createElement("canvas");
        el.appendChild(a);
        let b = a.getContext("2d");
        setCanvasStyle(a, { type: "fill", alpha: 0, position: "static", pinToTop: true });
        a.style.position = "absolute";
        a.style.top = "50%";
        a.style.left = "50%";
        a.style.display = "block";
        a.style.margin = "0 auto";
        a.style.width = "100%";
        a.style.height = "100%";
        a.style.transform = "translate(-50%,-50%)";
        return { canvas: a, context: b };
    }

    function run() {
        let init = initWorld();
        window.Game = { canvas: init.canvas, context: init.context, paused: false };
        draw();
    }

    function draw() {
        let { canvas: a, context: b } = Game;
        let wh = a.parentNode.clientWidth;
        let CW = a.width = wh;
        let CH = a.height = wh;
        let CR = MATH$.resultantOf(CW, CH);
        Game.CW = CW, Game.CH = CH;
        let scene = new CDraw.useScene(b);
        let bgRect = new CDraw.rect(0, CW, 0, CH, "_transparent");
        scene.add(bgRect);
        let text = new CDraw.text(textStyle, textValue, CW / 2, CH / 2, textColor);
        //text.alpha = 0;
        scene.add(text);
        //temporary hidden
        a.style.opacity = "0"; 

        let callWrite = (function () {
            a.style.opacity = "1";
            let pixels = null;
            CDraw.functions.getOpaquePixels(b, 0, CW, 0, CH, [0, null, null, null], function (pixels_) {
                pixels = pixels_;
            });

            let unpickedPixels = [...pixels];
            function sortUnpickedPixelsByClosest(pixel) {
                if (pixel == null) return;
                unpickedPixels = unpickedPixels.sort((a, b) => {
                    let hypa = Math.sqrt(Math.pow((pixel.x - a.x), 2) +
                        Math.pow((pixel.y - a.y), 2));
                    let hypb = Math.sqrt(Math.pow((pixel.x - b.x), 2) +
                        Math.pow((pixel.y - b.y), 2));
                    return hypa - hypb;
                });
            }

            function findClosestUnpickedPixelsPreSort() {
                let ppixel = unpickedPixels[0];
                unpickedPixels.splice(0, 1);
                return ppixel;
            }

            function findClosestUnpickedPixels(pixel) {
                if (unpickedPixels.length == 0) return null;
                if (pixel == null)
                    pixel = Math.floor(Math.random() * unpickedPixels.length);
                if (typeof pixel == "number") {
                    let rInd = pixel;
                    let ppixel = unpickedPixels[rInd];
                    unpickedPixels.splice(rInd, 1);
                    return ppixel;
                }
                let cpixel = {};
                let cpixelInd = 10000;
                let chyp = 10000;
                for (let i = 0; unpickedPixels.length > i; i++) {
                    let upixel = unpickedPixels[i];
                    let hyp = Math.sqrt(Math.pow((pixel.x - upixel.x), 2) +
                        Math.pow((pixel.y - upixel.y), 2));
                    if (hyp < chyp) {
                        cpixel = upixel;
                        cpixelInd = i;
                        chyp = hyp;
                    }
                }
                unpickedPixels.splice(cpixelInd, 1);
                return cpixel;
            }

            let dotList = [];
            let nextPixel = null;
            let startpoint = 0;//0 || null;
            let speed = 2; // 1 to 10;
            nextPixel = findClosestUnpickedPixels(startpoint);  
            function loop() {
                for (let i = 0; speed * pixels.length / 300 > i; i++) {
                    if (nextPixel == null) {
                        addDotsWithInterval(writeTime, dotList);
                        return;
                    }
                    let pcol = nextPixel.rgba;
                    let colrgb = `rgba(${pcol[0]}, ${pcol[1]}, ${pcol[2]}, ${pcol[3]})`;
                    dotList.push(new CDraw.rect(nextPixel.x, 1, nextPixel.y, 1, "_" + colrgb));
                    //dotList.push(new CDraw.arc(nextPixel.x, nextPixel.y, 1, 0, 6.3, "_" + colrgb));
                    nextPixel = findClosestUnpickedPixels(nextPixel);
                }
                requestAnimationFrame(loop);
            }
            loop();

            function addDotsWithInterval(writeTime, dotList) {
                let dotListIndex = 0;

                // Calculate intervalTime based on writeTime and the number of dots
                let intervalTime = (writeTime / dotList.length); // Convert to milliseconds
                let totalTimeUsed = 0;   

                let addDots = (function () {
                    let dot = dotList[dotListIndex];
                    if (dotListIndex >= dotList.length) {  
                        completedWrite();
                        return;
                    }
                    scene.add(dot);
                    dotListIndex++;

                    setTimeout(function(){
                        addDots(); 
                        totalTimeUsed += intervalTime;
                    }, intervalTime);
                });
                addDots();
            } 

            text.alpha = 0;
        });

        CDraw.fontLoadedListener(text.font.split(" ")[1], callWrite, callWrite);

    }//EO draw

    run();

    return {
        async complete() {
            return new Promise(resolve => {
                completedWrite = resolve;
            });
        }
    }
}; // EO writeText


// SAMPLE
// CDraw.writeText(el, "+60px iFi", "COOL ASF", "_white");

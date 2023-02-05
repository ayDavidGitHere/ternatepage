import AppState from "./appstate.js";
import AppCss from "./appcss.js";
import ThreeLogic from "./threelogic.js";
import cdrawlogic from "./cdrawlogic.js";
import threeanims from "./threelogic.anims.js";
function LoadElements(){
    this.canvasContainer = document.querySelector(".welcome-abs threejs");
    this.textMain1s = [...document.querySelectorAll(".sections.about .texts")]; 
    this.gotoLinks = document.querySelectorAll(".go-link-cnt .go-link");
    this.gotoLink = this.gotoLinks[0]
    this.wholePage = document.querySelector(".page");
    
}








async function sleep(time){
    return new Promise(function(resolve, reject){
        setTimeout(function() { 
            resolve()
        }, time);
    });
}

async function loadAssets(threelogic, threeanims){
    let loadeds = 0; let loadedmax = 2;
    return new Promise(function(resolve, reject){
        threeanims.preloadAssets(function(){ loadeds++; if(loadeds>=loadedmax) resolve();});
        threelogic.preloadAssets(function(){ loadeds++; if(loadeds>=loadedmax) resolve();});
    });
}





async function App(){
    let loadElements = new LoadElements();
    let threelogic = new ThreeLogic(loadElements.canvasContainer);
    let gtls = loadElements.gotoLinks;
    let page = loadElements.wholePage;
    function welcomepage(e){
        page.setAttribute("currentview", "welcome");
        //gtl.setAttribute("goto", "gartpreview");  gtl.innerText = "GAMES" ;
        threelogic.particleManager.removeAllParticles();
        threelogic.particleManager.addParticle("head");
    }
    async function aboutpage(e){
        //gtl.setAttribute("goto", "welcome");  //gtl.innerText = "GO BACK";
        threelogic.particleManager.removeAllParticles();
        threelogic.particleManager.addParticle("shapes");
    }
    async function gartpreviewpage(e){
        //gtl.setAttribute("goto", "welcome"); // gtl.innerText = "SEE FULL LIST";
        threelogic.particleManager.removeAllParticles();
    }
    async function gamepreviewpage(e){
        //gtl.setAttribute("goto", "welcome");  //gtl.innerText = "SEE FULL LIST";
        threelogic.particleManager.removeAllParticles();
    }
    let appCss = new AppCss(loadElements.textMain1s, threelogic);
    let appState = new AppState(appCss);
    await loadAssets(threelogic, threeanims);
    let showpage = ((new URL(window.location)).pathname || "" ).toLowerCase().split("/")[1];
    //console.log("showpage", showpage)
    switch (showpage){
        case "welcome":
          appState.showpage("welcome", function(){    welcomepage();     });
          break;
        case "about":
          appState.showpage("about", function(){    aboutpage();     });
          break;
        case "gartpreview":
          appState.showpage("gartpreview", function(){    gartpreviewpage();     });
          break;
        case "gamepreview":
          appState.showpage("gamepreview", function(){    gamepreviewpage();     });
          break;
        default: 
          appState.showpage("welcome", function(){    welcomepage();     });
    }
    threeanims.setAnims();



    ;[...gtls].map(gtl=>{
      gtl.onclick = async function(e){
        page.setAttribute("statechanging", "yes");
        let gotopage = gtl.getAttribute("goto");
        let gotopageloader = null;
        if(gotopage == "about") {
            page.setAttribute("currentview", "about");
            gotopageloader = aboutpage;
            await sleep(1000);
        }
        if(gotopage == "welcome") {
            page.setAttribute("currentview", "welcome");
            gotopageloader = welcomepage;
            await sleep(1000);
        }
        if(gotopage == "gartpreview") { 
            page.setAttribute("currentview", "gartpreview");
            gotopageloader = gartpreviewpage;
            await sleep(1000);
        }
        if(gotopage == "gamepreview") { 
            page.setAttribute("currentview", "gamepreview");
            gotopageloader = gamepreviewpage;
            await sleep(1000);
        }
        
        
        
        
        
        appState.showpage(gotopage, function(){   
            threeanims.setAnims();
            gotopageloader(e);
            window.history.pushState({}, gotopage, gotopage);
            page.setAttribute("statechanging", "no");
        });
      }//EO onclick
    });//
    document.onkeydown = (function(e){
        //if(e.key==" ") threelogic.particleManager.transformParticle("plane");
        if(e.key==" ") threelogic.particleManager.enterSphere();
    });
    
    
    
    
    
    
    
    
}
App();//calling app here rather than html else wepack would t do full compile
export default App;
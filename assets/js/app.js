import AppState from "./appstate.js";
import AppCss from "./appcss.js";
import ThreeLogic from "./threelogic.js";
import cdrawlogic from "./cdrawlogic.js";
import threeanims from "./threelogic.anims.js";
function LoadElements(){
    this.canvasContainer = document.querySelector(".welcome-abs threejs");
    this.textMain1s = [...document.querySelectorAll(".sections.about .texts")]; 
    this.gotoLink = document.querySelector(".go-link-cnt .go-link");
    this.wholePage = document.querySelector(".page");
    
}








async function sleep(time){
    return new Promise(function(resolve, reject){
        setTimeout(function() { 
            resolve()
        }, time);
    });
}

function SP(){
    this.components = [];
    this.RegisterComponent = async (path, tag)=>{
        let component = {};
        component.path = path;
        component.tag = tag;
        component.content = await fetch(path).text();
        this.components.push(component);
        return null;
    }
    this.AddComponent = (tag, addtoelement)=>{
        
    }
    this.GetComponent = (tag)=>{
        let component = null;
        this.components.map(c=>{
            if(c.tag==tag){component = c; return;}
        });
        return component;
    }
}





function App(){
    let loadElements = new LoadElements();
    let threelogic = new ThreeLogic(loadElements.canvasContainer);
    let gtl = loadElements.gotoLink;
    let page = loadElements.wholePage;
    function welcomepage(e){
         page.setAttribute("currentview", "welcome");
         gtl.setAttribute("goto", "gartpreview");  gtl.innerText = "BROWSE GAMES" ;
         threelogic.particleManager.removeAllParticles();
         threelogic.particleManager.addParticle("head");
    }
    async function aboutpage(e){
        gtl.setAttribute("goto", "welcome");  gtl.innerText = "GO BACK";
        threelogic.particleManager.removeAllParticles();
        threelogic.particleManager.addParticle("shapes");
    }
    async function gartpreviewpage(e){
        gtl.setAttribute("goto", "welcome");  gtl.innerText = "SEE FULL LIST";
        threelogic.particleManager.removeAllParticles();
    }
    async function gamepreviewpage(e){
        gtl.setAttribute("goto", "welcome");  gtl.innerText = "SEE FULL LIST";
        threelogic.particleManager.removeAllParticles();
    }
    let appState = new AppState();
    let showpage = (new URL(window.location).searchParams.get("page") || "" ).toLowerCase(); console.log("showpage", showpage)
    if(showpage=="welcome" || showpage=="") appState.showpage("welcome", function(){    welcomepage();     });
    if(showpage=="about") appState.showpage("about", function(){    aboutpage();     });
    if(showpage=="gartpreview") appState.showpage("gartpreview", function(){    gartpreviewpage();     });
    if(showpage=="gamepreview") appState.showpage("gamepreview", function(){    gamepreviewpage();     });
    gtl.onclick = async function(e){
        page.setAttribute("statechanging", "yes");
        let gotopage = gtl.getAttribute("goto");
        if(gotopage == "about") {
            page.setAttribute("currentview", "about");
            await sleep(1000);
        }
        if(gotopage == "welcome") {
            page.setAttribute("currentview", "welcome");
            await sleep(1000);
        }
        if(gotopage == "gartpreview") { 
            page.setAttribute("currentview", "gartpreview");
            await sleep(1000);
        }
        if(gotopage == "gamepreview") { 
            page.setAttribute("currentview", "gamepreview");
            await sleep(1000);
        }
        
        
        
        
        
        appState.showpage(gotopage, function(){   
            if(gotopage == "about") aboutpage(e);
            if(gotopage == "welcome") welcomepage(e);
            if(gotopage == "gartpreview") gartpreviewpage(e);
            if(gotopage == "gamepreview") gamepreviewpage(e);
            page.setAttribute("statechanging", "no");
        });
    }
    document.onkeydown = (function(e){
       // if(e.key==" ") threelogic.particleManager.transformParticle("plane");
        if(e.key==" ") threelogic.particleManager.enterSphere();
    });
    
    
    //EO Appstate
    AppCss(loadElements.textMain1s, threelogic);
    
    //cdrawlogic.writeBoxs(loadElements.canvasContainer);
    
    
    
    
    
    
    
    
    
    return;
    let sp = new SP();
    (async function(){
    let about_sp = await sp.RegisterComponent("../../about.sp.html", "about_sp");
    //on =>{this.AddComponent("about_sp");}
    console.log(sp.GetComponent("about_sp"));
    })();
    
}
App();//calling app here rather than html else wepack would t do full compile
export default App;
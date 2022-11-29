
function LoadElements(){
    this.canvasContainer = document.querySelector(".welcome-abs threejs");
    this.textMain1s = [...document.querySelectorAll(".sections.about .texts")]; 
    this.gotoLink = document.querySelector(".go-link-cnt .go-link");
    
}
import AppState from "./appstate.js"
import ThreeLogic from "./threelogic.js"
import AppCss from "./appcss.js"










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
    function welcomepage(e){
         gtl.setAttribute("goto", "about");  gtl.innerText = "ABOUT THIS CONVENTION" ;
         threelogic.particleManager.removeAllParticles();
         threelogic.particleManager.addParticle("head");
    }
    function aboutpage(e){
        gtl.setAttribute("goto", "welcome");  gtl.innerText = "SEE MAIN PAGE";
        threelogic.particleManager.removeAllParticles();
        threelogic.particleManager.addParticle("shapes");
    }
    let appState = new AppState();
    appState.showpage("welcome", function(){    welcomepage();     });
    loadElements.gotoLink.onclick = function(e){
        let gotopage = gtl.getAttribute("goto");
        appState.showpage(gotopage, function(){   
            if(gotopage == "about") aboutpage(e);
            if(gotopage == "welcome") welcomepage(e);
        });
    }
    //EO Appstate
    AppCss(loadElements.textMain1s);
    
    
    
    
    
    return;
    let sp = new SP();
    (async function(){
    let about_sp = await sp.RegisterComponent("../../about.sp.html", "about_sp");
    //on =>{this.AddComponent("about_sp");}
    console.log(sp.GetComponent("about_sp"));
    })();
    
    
}
export default App;
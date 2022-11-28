
function LoadElements(){
    this.canvasContainer = document.querySelector(".welcome-abs threejs")
}
import ThreeLogic from "./threelogic.js"





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
    let canvasContainer =  loadElements.canvasContainer;
    ThreeLogic(canvasContainer);
    
    
    let sp = new SP();
    (async function(){
    let about_sp = await sp.RegisterComponent("../../about.sp.html", "about_sp");
    //on =>{this.AddComponent("about_sp");}
    console.log(sp.GetComponent("about_sp"));
    })();
    
    
}
export default App;
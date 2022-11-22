
function LoadElements(){
    this.canvasContainer = document.querySelector(".welcome-abs threejs")
}
let loadElements = new LoadElements();
let canvasContainer =  loadElements.canvasContainer;
import ThreeLogic from "./threelogic.js"
ThreeLogic(canvasContainer);


function App(){
    
}
export default App;
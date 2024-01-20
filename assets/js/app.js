import AppState from "./appstate.js";
import AppCss from "./appcss.js"; 
import cdrawlogic from "./cdrawlogic.js";
import threeanims from "./threelogic.anims.js";
import page_welcome from "./page.welcome.js";
import CntGame from "./cntgame.js";

import Ft from "./ft/index.js";
import Tpg from "./tpg/index.js";
import Dia from "./dia/index.js";


class LoadElements {
    constructor() {
        document.querySelector(".page").innerHTML += `
            <div class="go-link-cnt">
                <a class="go-link" goto="gartpreview" fnt-pF>ARTS</a>
                <a class="go-link" goto="welcome" opener fnt-pF>=</a>
                <a class="go-link" goto="gamepreview" fnt-pF>GAMES</a>
            </div>
        `; 
        this.textMain1s = [...document.querySelectorAll(".sections.about .texts")];
        this.gotoLinks = document.querySelectorAll(".go-link-cnt .go-link");
        this.gotoLink = this.gotoLinks[0];
        this.wholePage = document.querySelector(".page");
    }
}

async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
 

const Pages = {
    welcome: async function (app) {
        app.page.setAttribute("currentview", "welcome"); 
        page_welcome.run(); 
    },
    
    about: async function (app) {
        app.page.setAttribute("currentview", "about"); 
    },
    
    gartpreview: async function (app) {
        app.page.setAttribute("currentview", "gartpreview"); 
    },
    
    gamepreview: async function (app) {
        app.page.setAttribute("currentview", "gamepreview"); 
    },
}



class App {
    constructor() {   
        this.initialize();
    }
    
    async initialize() { 
        this.elements = new LoadElements();
        this.page = this.elements.wholePage;
        this.css = new AppCss();
        this.state = new AppState(this.css);

        let splasherAnim = this.loadSplasherAnim();

        await this.loadAssets(threeanims);

        //await splasherAnim.complete();   

        this.loadRoutes(this);
        threeanims.setAnims();
        this.setPagesTransitions(this); 

        this.loadPageGames();
    }

    loadRoutes(app) {
        const showpage = (new URL(window.location)).pathname.toLowerCase().split("/")[1]; 
        switch (showpage) {
            case "about":
                app.state.showpage(showpage, () => Pages[`${showpage}`](app));
                break;
            case "gartpreview":
                app.state.showpage(showpage, () => Pages[`${showpage}`](app));
                break;
            case "gamepreview":
                app.state.showpage(showpage, () => Pages[`${showpage}`](app));
                break;
            case "ft":
                app.state.showpage("ft", () => { new Ft(); });
                break;
            case "tpg":
                app.state.showpage("tpg", () => { new Tpg(); });
                break;
            case "dia":
                app.state.showpage("dia", () => { new Dia(); });
                break;
    
            default:
                app.state.showpage("welcome", () => Pages[`welcome`](app));
        }
    }
    
    async loadAssets(threeanims){
        let loadeds = 0; let loadedmax = 2;
        return new Promise(function(resolve, reject){
            threeanims.preloadAssets(function(){ loadeds++; if(loadeds>=loadedmax) resolve();}); 
        });
    }
    
    async setPagesTransitions(app ) {  
        [...app.elements.gotoLinks].map(function (gtl) {
            gtl.onclick = async function (e) {
                app.page.setAttribute("statechanging", "yes");
                const gotopage = gtl.getAttribute("goto");
                app.page.setAttribute("currentview", gotopage);
                await sleep(1000);
                await Pages[`${gotopage}`](app);
                app.state.showpage(gotopage, () => {
                    threeanims.setAnims();
                    window.history.pushState({}, gotopage, gotopage);
                    app.page.setAttribute("statechanging", "no");
                });
            };
        })
    } 

    loadPageGames() {
        //const gameContainer = document.querySelector('game-cnt');
        //const cntGame = new CntGame(gameContainer);
    }

    loadSplasherAnim() { 
        let el_cont = document.querySelector(".sections.splasher"); 

        let writeBox = document.createElement("div");
        el_cont.appendChild(writeBox);
        writeBox.style = `
            width: 400px; height: 400px;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            position: absolute; 
            padding: 0px;
        `;
        let writeComplete = CDraw.writeText(writeBox, "+40px iFl", "Loading ...", "_white", 0.001/5000000);

        return {
            async complete() {
                return new Promise(async (resolve) => {
                    await writeComplete.complete();
                    console.log("writeComplete")
                    resolve();
                });
            }
        }
    }
}







new App();
 // calling app here rather than html else weBpack would not do a full compile
export default App;

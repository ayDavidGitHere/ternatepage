//import AppState from "./AppState";
//import ThreeLogic from "./ThreeLogic"; // Import other necessary modules
import FtRender from "./FtRender.js";

class Ft {
    constructor() {
        //this.appState = new AppState();
        //this.threeLogic = new ThreeLogic(); // Instantiate other necessary modules
        this.initialize();
    }

    async initialize() {
        await this.loadAssets();
        await this.loadApiData();
        this.renderPage();
        this.setupEventListeners();
        // Additional initialization steps can be added here
    }

    async loadAssets() {
        // Implement logic to load 3D assets, textures, etc.
        // Example: await this.threeLogic.loadAssets();
    }

    async loadApiData() {
        // Implement logic to fetch data from APIs
        // Example: const apiData = await fetch('https://api.example.com/data').then(response => response.json());
    }

    clearPage() {
        document.querySelector("html").innerHTML = "";
        console.log("clearPage");
    }

    renderPage() {
        // Implement logic to render the initial page
        // Example: this.appState.showpage("welcome", () => welcomePage.render());
        this.clearPage();
        document.querySelector("html").style.padding = "0";
        document.querySelector("html").style.margin = "0";
        document.querySelector("html").innerHTML = `
            <div id="ft-main-canvas"></div>
        `;
        // Instantiate the class
        const ftRender = new FtRender(document.getElementById('ft-main-canvas'));

    }

    setupEventListeners() {
        // Implement logic to set up event listeners
        // Example: document.getElementById('someButton').addEventListener('click', () => this.handleButtonClick());
    }

    // Additional methods and event handlers can be added as needed

    // Example event handler method
    handleButtonClick() {
        // Handle button click event
    }
}

export default Ft;

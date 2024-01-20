
class Base {
    constructor  () {  

    }

    clearPage() {
        document.querySelector("html").innerHTML = `
            <head>
                <title>AYDAVID'S</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <link rel="icon" type="image/png" sizes="16x16" href="./favicon.png">
                <link rel="stylesheet" type="text/css" href="./assets/css/constant.css" />
                <body>
                </body>
            </head>
        `; // <link rel="stylesheet" type="text/css" href="./assets/css/page.css" />

        document.querySelector("html").style.padding = "0";
        document.querySelector("html").style.margin = "0";
        document.querySelector("body").style.padding = "0";
        console.log("clearPage from base");
    }

    renderPage() { 
        this.clearPage(); 
        document.querySelector("html body").innerHTML += `
            <div id="tpg-main-canvas"></div>
        `;
        // Instantiate the class
        const render = new Render(document.getElementById('tpg-main-canvas'));

    }
}

export default Base;
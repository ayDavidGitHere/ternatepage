
class ScrollHandler {
    constructor(element) {
        this.element = element;
        this.mouseOver = false;
        this.handleScrollCallback = function(event, delta){}
        this.handleScrollUpCallback = function(){}
        this.handleScrollDownCallback = function(){}
    }

    initialize() {
        this.setScrollListeners(this.element);
    }

    setScrollListeners(element) { 

        element.addEventListener('wheel', (e) => {
            if (this.mouseOver) {
                e.preventDefault();
                e.returnValue = false;
                return false;
            }
        });

        element.addEventListener('mouseenter', () => {
            this.mouseOver = true;
        });

        element.addEventListener('mouseleave', () => {
            this.mouseOver = false;
        });

        element.addEventListener('wheel_', (e) => {
            const delta = e.wheelDelta;
            if (delta > 0) {
                this.scrollUp(); 
            } else {
                this.scrollDown();
            }
            this.handleScroll(delta);
        });



        let lastKnownScrollPosition = 0;
        let delta = 0;
        let scrolling = false;

        element.addEventListener('scroll', (e) => { 
            const scrollCall = (() => {
                delta = element.scrollTop - lastKnownScrollPosition;
                lastKnownScrollPosition = element.scrollTop;

                if (delta > 0) { 
                    this.scrollUp(e, delta);
                } else {
                    this.scrollDown(e, delta);
                }

                this.handleScroll(e, delta);  
            });
            scrollCall(); 
        }); 
    }

    handleScroll(e, delta) {
        this.handleScrollCallback(e, delta); 
    }

    scrollUp(e, delta) {
        this.handleScrollUpCallback(e, delta); 
    }

    scrollDown(e, delta) {
        this.handleScrollDownCallback(e, delta); 
    }

    elementPercentInView(element, returnScroll=false) {
        const rect = element.getBoundingClientRect();

        let is_inview = null;
        is_inview = (
            true 
            && rect.bottom >= 0 
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight) 
        );

        let percent_inview = null;
        percent_inview = 100 - (rect.top / window.innerHeight * 100);
        return percent_inview;
    }
}
function transferScroll(scrollEvent, scrollDelta, child) {
    // body...
    child.scrollTop += scrollDelta;
    //console.log("transferScroll scrollDelta: ", scrollDelta);
}
function returnScroll(scrollEvent, scrollDelta, container, element) {
    // body...
    //element.scrollTop = window.innerHeight;
    container.scrollTo(0, container.scrollTop-scrollDelta);
    //console.log("returnScroll scrollDelta: ", scrollDelta);
}







let run = function(){ 
    let indicator = document.querySelector(".go-link[goto='welcome']");

    let welcomepage = document.querySelector("section.sections.welcome");

    let welcome_firstview = document.querySelector("section.sections.welcome .first-view");
    let welcome_nextview = document.querySelector("section.sections.welcome .next-view");
    let welcome_lastview = document.querySelector("section.sections.welcome .last-view");
    let welcome_nextview_side2 = document.querySelector("section.sections.welcome .next-view .side2");
    let welcome_nextview_side2_btag = document.querySelector("section.sections.welcome .next-view .side2 bottom-tag");
    let welcome_thirdview = document.querySelector(".third-view");
    
    // Create an instance of the ScrollHandler class and initialize it
    const scrollHandler = new ScrollHandler(welcomepage);
    scrollHandler.initialize();

    scrollHandler.handleScrollCallback = function(scrollEvent, scrollDelta) {  
        indicator.innerText = "-";
        welcomepage.setAttribute("in-view", "any-view");
        if(scrollHandler.elementPercentInView(welcome_nextview) > 0){ 
            indicator.innerText = "*";
            if(scrollHandler.elementPercentInView(welcome_nextview_side2_btag) > 0){ 
               //as reached bottom  of nextview side2
                indicator.innerText = "+";
            }
            else {
                if(welcome_nextview.getBoundingClientRect().top <= 0) {
                    returnScroll(scrollEvent, scrollDelta, welcomepage, welcome_nextview);
                    transferScroll(scrollEvent, scrollDelta, welcome_nextview_side2);
                    indicator.innerText = "|";
                }else {
                    indicator.innerText = "&";
                }
            }
        }

        if(scrollHandler.elementPercentInView(welcome_lastview) > 0){ 
            welcomepage.setAttribute("in-view", "last-view");
        }
        //console.log("indicator.innerText: ", indicator.innerText);
    };
}


let page = { run };
export default page;
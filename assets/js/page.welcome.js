


/*
class MouseHandler {

    constructor(...elements) {
        this.elements = elements;
        this.mousePos = {x:.5,y:.5};
        this.handleMouseCallback = function(event, delta){}
        this.handleMouseUpCallback = function(){}
        this.handleMouseDownCallback = function(){}
    }

    initialize() {
        this.setMouseListenersForAll(this.elements);
    }

    setMouseListenersForAll(elements) { 
        elements.map(element => { this.setMouseListeners(element) })
    }

    setMouseListeners(element) {
        document.addEventListener('mousemove', (event) => {
            event.preventDefault(); 
            this.mousePos = { 
                x:event.clientX/window.innerWidth, 
                y:event.clientY/window.innerHeight
            };
        });
    }
}
*/






class ScrollHandler {
    constructor(...elements) {
        this.elements = elements;
        this.mouseOver = false;
        this.handleScrollCallback = function(event, delta){}
        this.handleScrollUpCallback = function(){}
        this.handleScrollDownCallback = function(){}
    }

    initialize() {
        this.setScrollListenersForAll(this.elements);
    }

    setScrollListenersForAll(elements) { 
        elements.map(element => { this.setScrollListeners(element) })
    }

    setScrollListeners(element) {   
        let lastKnownScrollPosition = 0;
        let delta = 0; 



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

    setIntersectionListener(element) {
        // Intersection Observer to watch for element visibility
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if(!this.handleIntersectionListener) {
                        this.handleIntersectionListener = (entry) => {}
                    }
                    this.handleIntersectionListener(entry);
                }
            });
        }, { threshold: 0 });

        observer.observe(element);
    }

    limitScroll(divideby) { 
        let delta = 0; 
        this.elements.map(element => {
            element.addEventListener('scroll', (e) => {  
            });    
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
        
        let percent_inview = null;
        percent_inview = 100 - ( (rect.top + 0) / window.innerHeight * 100);
        return percent_inview;
    }

    elementBtmPercentInView(element, returnScroll=false) {
        const rect = element.getBoundingClientRect();

        let percent_inview = null;
        percent_inview = 100 - ( (rect.bottom + 0) / window.innerHeight * 100);
        return percent_inview;
    }

    elementHeightPercentInView(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let elementHeight = rect.height;
        let percent_inview = null;


        if (rect.top < 0 && rect.bottom <= windowHeight) {
            percent_inview = (rect.bottom - 0) / windowHeight * 100;
        }
        if (rect.top < 0 && rect.bottom > windowHeight) {
            percent_inview = (windowHeight - 0) / windowHeight * 100;
        } 
        if (rect.top >= 0 && rect.bottom <= windowHeight) {
            percent_inview = (rect.bottom - rect.top) / windowHeight * 100;
        } 
        if (rect.top >= 0 && rect.bottom > windowHeight) {
            percent_inview = (windowHeight - rect.top) / windowHeight * 100;
        } 
        if(rect.top > windowHeight || rect.bottom < 0) {
            percent_inview = 0;
        } 
 
        return percent_inview;
    }

    elementScrollPercent(element) { 
        return 100 * element.scrollTop / ( element.scrollHeight - element.clientHeight);
    }
}
function transferScroll(scrollEvent, scrollDelta, child) { 
    child.scrollTop += scrollDelta; 
}
function returnScroll(scrollEvent, scrollDelta, container, element) { 
    container.scrollTo(0, container.scrollTop-scrollDelta); 
}

function addFirstViewCursor(container) { 
    const contRect = container.getBoundingClientRect();
    const hTexts = container.querySelectorAll(".headline-text");
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    container.appendChild(cursor); 

    container.addEventListener('mousemove', e => {
      const cursRect = cursor.getBoundingClientRect();  
      const cursX = e.clientX - contRect.left - cursRect.width / 2;
      const cursY = e.clientY - contRect.top - cursRect.height / 2;  
      cursor.style.top = `${cursY}px`;
      cursor.style.left = `${cursX}px`; 

        [...hTexts].map((hText, hTextIndex)=>{
          const bgCursX = cursX - hText.getBoundingClientRect().left + cursRect.width / 2;;
          const bgCursY = cursY - hText.getBoundingClientRect().top + cursRect.height / 2;; 

          getElementStyle(`.headline-text[ht-${hTextIndex+1}]`)
            ?.setProperty("--before-bg-position-x", `${bgCursX}px`); 

          getElementStyle(`.headline-text[ht-${hTextIndex+1}]`)
            ?.setProperty("--before-bg-position-y", `${bgCursY}px`);  
        });
    });
}

function getElementStyle(selectorText) {
    let styles = [];
    for(let styleSheet of document.styleSheets){  
        let styleRule = null;
        try{
            styleRule = [...styleSheet.cssRules]
            .find(r=>r.selectorText == selectorText)
        }catch(e){} 
        if(styleRule) styles.push(styleRule.style);
    }  
    return styles[0];
}














let run = function(threeanims){ 
    let indicator = document.querySelector(".go-link[goto='welcome']");

    let welcomepage = document.querySelector("section.sections.welcome");
    welcomepage.setAttribute("loaded", "");

    let welcome_views = document.querySelectorAll("section.sections.welcome .in-view");

    let welcome_firstview = document.querySelector("section.sections.welcome .first-view");
    let welcome_nextview = document.querySelector("section.sections.welcome .next-view");
    let welcome_lastview = document.querySelector("section.sections.welcome .last-view");
    let welcome_nextview_side2 = document.querySelector("section.sections.welcome .next-view .side2");
    let welcome_nextview_side2_btag = document.querySelector("section.sections.welcome .next-view .side2 bottom-tag");
    let welcome_thirdview = document.querySelector(".third-view");

    welcome_lastview.setAttribute("inf-position", "bottom");



    //update primeview
    function removePrimeView() { 
        [...welcome_views].map(view_=> {
            if(view_.hasAttribute("is-prime-view")) {
                view_.removeAttribute("is-prime-view")
            }
        });
    }

    function setPrimeView(view) {
        if(!view.hasAttribute("is-prime-view")) { 
            removePrimeView(view);
            view.setAttribute("is-prime-view", "");
        }        
    }

    function updatePrimeView() { 
        let list = [];
        [...welcome_views].map(view=>{
            let percent_inview_height = scrollHandler.elementHeightPercentInView(view);   
 
            list.push({view: view, percent: percent_inview_height  }); 
        }); 
        list.sort((a, b) => {  return b.percent - a.percent;  });
        
        let prime = list[0];
        if(prime);
        setPrimeView(prime.view)
    }



    // infinite scroll
    function addToTop(moveToStart=false) {  
        // remove element from bottom
        welcomepage.removeChild(welcome_lastview);
        // up element on top 
        welcomepage.prepend(welcome_lastview);
        //scrolltotop
        if(!moveToStart) welcomepage.scrollTo(0, 0);
        else welcomepage.scrollTo(0, welcomepage.clientHeight);
        welcome_lastview.setAttribute("inf-position", "top");
    }

    function addToBottom(moveToStart=false) { 
        // remove element from top
        welcomepage.removeChild(welcome_lastview);
        // up element on bottom 
        welcomepage.appendChild(welcome_lastview);
        //scrolltotop
        if(!moveToStart) welcomepage.scrollTo(0, 0);
        else {}// welcomepage.scrollTo(0, welcomepage.clientHeight);
        welcome_lastview.setAttribute("inf-position", "bottom");
    }







    let bottomThreeAnim = null;
    threeanims.addSetAnimsListener(function(){
        bottomThreeAnim = threeanims.getAnim("#bottom-anim");
        threeanims.getAnim("#head-anim").zoom();
    });
    
    // Create an instance of the ScrollHandler class and initialize it
    const scrollHandler = new ScrollHandler(welcomepage, welcome_nextview_side2);
    scrollHandler.initialize();
    scrollHandler.setIntersectionListener(welcome_nextview);
    scrollHandler.limitScroll(.5);

    scrollHandler.handleScrollCallback = function(scrollEvent, scrollDelta) {  
        indicator.innerText = "-";
        let welcome_nextview_percentinview = scrollHandler.elementPercentInView(welcome_nextview);;
        let welcome_nextview_side2_percentinview = scrollHandler.elementPercentInView(welcome_nextview_side2);;

        let welcome_nextview_btmpercentinview = scrollHandler.elementBtmPercentInView(welcome_nextview);;
        let welcome_nextview_side2_btmpercentinview = scrollHandler.elementBtmPercentInView(welcome_nextview_side2); 

        let welcome_nextview_side2_scrollpercent = scrollHandler.elementScrollPercent(welcome_nextview_side2);




        /* transfer scroll to child*/
        if(false && welcome_nextview_btmpercentinview <= 100) {
        if(
            (welcome_nextview_btmpercentinview >= 0 && welcome_nextview_side2_scrollpercent < 100)
            //||
            //(welcome_nextview_btmpercentinview < 0 && welcome_nextview_side2_scrollpercent >= 100)
            ) {
            indicator.innerText = "&";
            returnScroll(scrollEvent, scrollDelta, welcomepage, welcome_nextview);
            transferScroll(scrollEvent, scrollDelta, welcome_nextview_side2);
        }}
        
        if(welcome_nextview_percentinview > 100 
        && !welcome_nextview.hasAttribute("hold") ) {
            welcome_nextview.setAttribute("hold", "");
        } 
        if(welcome_nextview_btmpercentinview > 0 
        &&  welcome_nextview.hasAttribute("hold") ) {
            welcome_nextview.removeAttribute("hold", "");
        }


        /* transfer scroll to child*/





        /*infinite-scroll*/
        if(scrollHandler.elementBtmPercentInView(welcome_lastview) >= -1
            ){   
            if(scrollDelta > 0) {
                if(welcome_lastview.getAttribute("inf-position")=="bottom"){
                    addToTop();
                }
            }
            if(scrollDelta < 0) {
                if(welcome_lastview.getAttribute("inf-position")=="top"){
                    //addToBottom(true);
                }
            }
        }   

        if(scrollHandler.elementPercentInView(welcome_firstview) >= 100
            ){
            if(scrollDelta > 0) {
                if(welcome_lastview.getAttribute("inf-position")=="top"){
                    addToBottom(); // move to bottom
                }
            }

            if(scrollDelta < 0) {
                if(welcome_lastview.getAttribute("inf-position")=="bottom"){
                    //addToTop(scrollDelta);
                }
            }
        } 
        /*infinite-scroll*/



        updatePrimeView(); 
    }; 
    scrollHandler.handleIntersectionListener = function(entry) {
        //console.log("IntersectionObserver callback", entry)
    }
    
    updatePrimeView(); 

    addFirstViewCursor(welcome_firstview)  
}


let page = { run };
export default page;
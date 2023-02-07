
let fixScrollBehavior = {
    call: function(){},
    listen: function(elem){
        elem.addEventListener('scroll', (e) => {
            console.log('scrolling');
        });
        let MOUSE_OVER = false;
        elem.addEventListener('wheel', (e) => {
            if (MOUSE_OVER) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
                return false;
            }
        });
        elem.addEventListener('mouseenter', () => {
            MOUSE_OVER = true;
        });
        elem.addEventListener('mouseleave', () => {
            MOUSE_OVER = false;
        });
        elem.addEventListener('wheel', (e) => {
            let delta = e.wheelDelta;
            if (delta > 0) {
                //go up
            } else {
                //go down
            }
            fixScrollBehavior.call(delta);
        });
    }
}//EO 
fixScrollBehavior.listen(document.body);
function isInView(element) {
  var windowTop = window.scrollY;
  var windowBottom = windowTop + window.innerHeight;
  var elementTop = element.offsetTop;
  var elementBottom = elementTop + element.offsetHeight;
  return elementTop <= windowBottom && elementBottom >= windowTop;
}









let run = function(){
        fixScrollBehavior.call =  function(delta) { 
          let welcomepage = document.querySelector("section.sections.welcome");
          let welcome_text = document.querySelector("section.sections.welcome .text");
          let welcome_nextview = document.querySelector("section.sections.welcome .next-view");
          
          let inview = welcomepage.getAttribute("in-view");
          
          
          if(delta<0) {
            if(isInView(welcome_text)){
                welcomepage.setAttribute("in-view", "next-view");
            } 
          }
          if(delta>0) {
            if(isInView(welcome_nextview)){
                welcomepage.setAttribute("in-view", "text");
            } 
          }
        };
}


let page = { run };
export default page;
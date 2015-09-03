// chiasm-layout.js
// v__VERSION__
// github.com/chiasm-project/chiasm-layout
//
// This is a Chiasm plugin for nested box layout.

var ChiasmComponent = require("chiasm-component");
var None = require("model-js").None;
var computeLayout = require("./computeLayout");

function Layout(chiasm){

  var my = ChiasmComponent({
    layout: {},
    sizes: {},
    containerSelector: None
  });

  my.when("containerSelector", function (containerSelector){
  
    if(containerSelector !== None){

      // If the containerSelector changes, remove all component 
      // DOM elements from the old container.
      if(my.container){
        removeAllChildren(my.container);
      }

      my.container = document.querySelector(containerSelector);

      // Initialize `my.box`.
      setBox();
    }
  });

  // Sets the `box` my property based on actual container size .
  function setBox(){
    if(my.container){
      my.box = {
        x: 0,
        y: 0,
        width: my.container.clientWidth,
        height: my.container.clientHeight
      };
    }
  }

  // Add this guard here so unit tests can run in Node.
  if (typeof window !== "undefined"){

    // Update `my.box` on resize
    window.addEventListener("resize", _.throttle(setBox, 100));
  }
  
  // Respond to changes is box and layout.
  my.when(["layout", "sizes", "box"], function(layout, sizes, box){

    var boxes = computeLayout(layout, sizes, box);

    Object.keys(boxes).forEach(function (alias){
      chiasm.getComponent(alias).then(function (component){

        // Pass the box into the component so it can resize its content
        // using box.width and box.height.
        component.box = boxes[alias];

        d3.select(component.el)

          // Use CSS `position: absolute;` so setting `left` and `top` CSS
          // properties later will position the SVG relative to the parent container.
          .style("position", "absolute")

          // Set the CSS `left` and `top` properties to move the
          // SVG to `(box.x, box.y)` relative to the parent container.
          .style("left", component.box.x + "px")
          .style("top", component.box.y + "px");
      });
    });
  });

  // Computes which aliases are referenced in the given layout.
  function aliasesInLayout(layout){
    var aliases = [];
    if(isLeafNode(layout)){
      aliases.push(layout);
    } else {
      layout.children.forEach(function(child){
        aliases.push.apply(aliases, aliasesInLayout(child));
      });
    }
    return aliases;
  }
  
  function removeAllChildren(parent){
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }


  // Handle DOM management for components.
  my.when(["container", "layout"], function(container, layout){

    removeAllChildren(container);

    // Add the DOM elements for each component to the container.
    var aliases = aliasesInLayout(layout);
    aliases.forEach(function (alias){
      chiasm.getComponent(alias).then(function (component){
        if(!component.el){
          throw new Error("Every component referenced in layout must have a DOM element 'el' defined. " +
            "Component with alias " + alias + " has no 'el'.");
        }
        container.appendChild(component.el);
      });
    });
  });

  // Return the public API.
  return my;
}

module.exports = Layout;

var ChiasmComponent = require("chiasm-component");
var None = require("model-js").None;
var computeLayout = require("./computeLayout");
var _ = require("lodash");
var d3 = require("d3");

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

      // Initialize `my.box` based on the container size.
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

  my.when("container", setBox);

  // Add this guard here so unit tests can run in Node.
  if (typeof window !== "undefined"){
    
    var listener = _.throttle(setBox, 100);

    // Update `my.box` on resize
    window.addEventListener("resize", listener);
    
    my.destroy = function(){
      window.removeEventListener("resize", listener);
    };
  }
  
  // Respond to changes is box and layout.
  my.when(["layout", "sizes", "box"], function(layout, sizes, box){

    var boxes = computeLayout(layout, sizes, box);

    Object.keys(boxes).forEach(function (alias){

      // Annotate the DOM so it is clear what each element corresponds to
      // for developers inspecting the DOM.
      var domClass = "chiasm-component-" + alias;

      chiasm.getComponent(alias).then(function (component){

        var box = boxes[alias];

        // Pass the box into the component so it can resize its content
        // using box.width and box.height.
        component.box = box;

        // Set the (x, y) box offset on the component's DOM element.
        if(component.el){

          if(component.el instanceof SVGGraphicsElement){

            // Use SVG transform property to position SVG component elements.
            d3.select(component.el)
              .attr("transform", "translate(" + box.x + "," + box.y + ")")
              .classed(domClass, true);

          } else {

            // Use CSS to position non-SVG component elements (e.g. <div/>).
            d3.select(component.el)

              // Use CSS `position: absolute;` so setting `left` and `top` CSS
              // properties later will position the SVG relative to the parent container.
              .style("position", "absolute")

              // Set the CSS `left` and `top` properties to move the
              // SVG to `(box.x, box.y)` relative to the parent container.
              .style("left", box.x + "px")
              .style("top", box.y + "px")
              .classed(domClass, true);

          }
        }
      });
    });
  });

  // Computes which aliases are referenced in the given layout.
  function aliasesInLayout(layout, sizes){
    return Object.keys(computeLayout(layout, sizes, {
      width: 100,
      height: 100
    }));
  }
  
  function removeAllChildren(parent){
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }


  // Handle DOM management for components.
  my.when(["container", "layout", "sizes"], function(container, layout, sizes){

    removeAllChildren(container);

    var containerDIV = d3.select(container)
      .append("div")
      .attr("class", "chiasm-container-for-non-svg-elements");

    var containerSVG = d3.select(container)
      .append("svg")
      .attr("class", "chiasm-container-for-svg-elements")

    my.containerSVG = containerSVG;

    // Add the DOM elements for each component to the container.
    var aliases = aliasesInLayout(layout, sizes);
    aliases.forEach(function (alias){
      chiasm.getComponent(alias).then(function (component){

        if(!component.el){
          throw new Error("Every component referenced in layout must have a DOM " + 
            "element 'el' defined. Component with alias " + alias + 
            " has no 'el' property defined.");
        }

        if(component.el instanceof SVGGraphicsElement){
          containerSVG.node().appendChild(component.el);
        } else {
          containerDIV.node().appendChild(component.el);
        }
      });
    });
  });
  
  my.when(["containerSVG", "box"], function(containerSVG, box){
    containerSVG
      .attr("width", box.width)
      .attr("height", box.height);
  });

  // Return the public API.
  return my;
}
module.exports = Layout;

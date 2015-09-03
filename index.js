// chiasm-layout.js
// v__VERSION__
// github.com/chiasm-project/chiasm-layout
//
// This is a Chiasm plugin for nested box layout.
function Layout(chiasm){

  var my = ChiasmComponent({
    layout: {},
    sizes: {},
    containerSelector: Model.None
  });

  my.when("containerSelector", function (containerSelector){
  
    if(containerSelector !== Model.None){

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

  // Update `my.box` on resize
  window.addEventListener("resize", _.throttle(setBox, 100));
  
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


  // This function computes the nested box layout from a tree data structure.
  //
  // Takes as input the following arguments:
  //
  // * `layout` A tree data structure defining nested boxes. The root
  //   of the tree may be either a leaf node or an internal node.
  //   * Leaf nodes are component alias strings.
  //   * Internal nodes are objects with the following properties:
  //     * `orientation` A string, either
  //       * "horizontal", meaning this node is subdivided horizontally
  //         with children placed from left to right, or
  //       * "vertical", meaning this node is subdivided vertically
  //         with children placed from top to bottom.
  //     * `children` An array of child node objects, each of which may be 
  //       either a leaf node or internal node.
  //     * `size` The size of the internal node, with the same specifications
  //       as values within `sizes` (see next bullet point).
  // * `sizes` An object that specifies component size options, where
  //   * Keys are component alias strings.
  //   * Values are objects with the following properties:
  //     * `size` the width (if the containing box is horizontal)
  //       or height (if the containing box is vertical) of the component.
  //       May be either:
  //       * a number (like "1.5" or "1", expressed as a number or a string) that 
  //       determines size relative to siblings within the containing box, or
  //       * a count of pixels (like "50px" or "200px" expressed as a string 
  //         with "px" suffix) that determines an absolute fixed size.
  //         This is useful in cases where components have fixed-size UI widgets 
  //         rather than flexibly resizable visualizations.
  //       * If `size` is not specified, it is assigned a default value of 1.
  //     * `hidden` A boolean for hiding components. If true, the component
  //       is excluded from the layout, if false the component is included.
  // * `box` An object describing the outermost box of the layout,
  //   with the following properties:
  //   * `width` The width of the box in pixels.
  //   * `height` The height of the box in pixels.
  //   * `x` The X offset of the box in pixels.
  //     If not specified, this defaults to zero.
  //   * `y` The Y offset of the box in pixels.
  //     If not specified, this defaults to zero.
  //
  // Returns an object where
  //
  //  * Keys are component aliases.
  //  * Values are objects representing the computed box for the component,
  //    having the following integer properties:
  //   * `x` The X offset of the box in pixels.
  //   * `y` The Y offset of the box in pixels.
  //   * `width` The width of the box in pixels.
  //   * `height` The height of the box in pixels.
  //   * These box dimensions are quantized from floats to ints such that there are no gaps.
  function computeLayout(layout, sizes, box){
    var result = {},
        isHorizontal,
        wiggleRoom,
        sizeSum = 0,
        x,
        y,
        visibleChildren;

    box.x = box.x || 0;
    box.y = box.y || 0;
    sizes = sizes || {};

    function size(layout){
      var result, alias;
      if(isLeafNode(layout)){
        alias = layout;
        if(alias in sizes){
          result = sizes[alias].size;
        } else {
          result = 1;
        }
      } else {
        result = layout.size || 1;
      }
      if(typeof result === "string" && ! isPixelCount(result)){
        result = parseFloat(result);
      }
      return result;
    }

    function isVisible(layout) {
      if(isLeafNode(layout) && (layout in sizes)){
        return !sizes[layout].hidden;
      } else {
        return true;
      }
    }

    if(isLeafNode(layout)){
      result[layout] = _.clone(box);
    } else {
      isHorizontal = layout.orientation === "horizontal";
      wiggleRoom = isHorizontal ? box.width : box.height;
      visibleChildren = layout.children.filter(isVisible);
      visibleChildren.forEach(function (child) {
        if(isPixelCount(size(child))){
          wiggleRoom -= pixelCount(size(child));
        } else {
          sizeSum += size(child);
        }
      });
      x = box.x;
      y = box.y;
      visibleChildren.forEach(function (child) {
        var childBox = { x: x, y: y},
            childSize = size(child),
            sizeInPixels;

        if(isPixelCount(childSize)){
          sizeInPixels = pixelCount(childSize);
        } else {
          sizeInPixels = (childSize / sizeSum) * wiggleRoom;
        }

        if(isHorizontal){
          childBox.width = sizeInPixels;
          childBox.height = box.height;
          x += childBox.width;
        } else {
          childBox.width = box.width;
          childBox.height = sizeInPixels;
          y += childBox.height;
        }

        quantize(childBox);

        if(isLeafNode(child)){
          result[child] = childBox;
        } else {
          _.extend(result, computeLayout(child, sizes, childBox));
        }
      });
    }
    return result;
  };

  // Determines whether the given node in the layout tree
  // is a leaf node or a non-leaf node.
  function isLeafNode(layout){

    // If it is a leaf node, then it is a string
    // that is interpreted as a component alias.
    return typeof layout === "string";
  }

  function isPixelCount(size){
    return (typeof size === "string") && endsWith(size, "px");
  }

  // http://stackoverflow.com/questions/280634/endswith-in-javascript
  function endsWith(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function pixelCount(size){
    return parseInt(size.substr(0, size.length - 2));
  }

  function quantize(box){
    var x = Math.round(box.x),
        y = Math.round(box.y);
    box.width = Math.round(box.width + box.x - x);
    box.height = Math.round(box.height + box.y - y);
    box.x = x;
    box.y = y;
  }

  // Return the public API.
  return my;
}

module.exports = Layout;

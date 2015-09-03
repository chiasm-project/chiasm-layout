// This file contains tests for the computeLayout function.

// Use the "expect" assert style.
// See http://chaijs.com/guide/styles/
var expect = require("chai").expect,
    computeLayout = require("./computeLayout");

describe("computeLayout", function () {

  it("single component", function() {
    var layout = "foo",
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(100);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);
  });

  it("two components horizontal, unspeficied sizes", function() {
    var layout = {
          orientation: "horizontal",
          children: ["foo", "bar"]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(50);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(50);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(50);
    expect(result.bar.y).to.equal(0);
  });

  it("two components vertical, unspeficied sizes", function() {
    var layout = {
          orientation: "vertical",
          children: ["foo", "bar"]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(100);
    expect(result.foo.height).to.equal(50);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(100);
    expect(result.bar.height).to.equal(50);
    expect(result.bar.x).to.equal(0);
    expect(result.bar.y).to.equal(50);
  });

  it("two components horizontal, relative size", function() {
    var layout = {
          orientation: "horizontal",
          children: ["foo", "bar"]
        },
        sizes = {
          foo: { size: 3 },
          // bar size defaults to 1
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(75);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(25);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(75);
    expect(result.bar.y).to.equal(0);
  });

  it("two components horizontal, relative size as a string", function() {
    var layout = {
          orientation: "horizontal",
          children: ["foo", "bar"]
        },
        sizes = {
          foo: { size: "3" },
          // bar size defaults to 1
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(75);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(25);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(75);
    expect(result.bar.y).to.equal(0);
  });

  it("two components vertical, relative size", function() {
    var layout = {
          orientation: "vertical",
          children: ["foo", "bar"]
        },
        sizes = {
          foo: { size: 3 },
          // bar size defaults to 1
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(100);
    expect(result.foo.height).to.equal(75);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(100);
    expect(result.bar.height).to.equal(25);
    expect(result.bar.x).to.equal(0);
    expect(result.bar.y).to.equal(75);
  });

  it("two components horizontal, absolute size", function() {
    var layout = {
          orientation: "horizontal",
          children: ["foo", "bar"]
        },
        sizes = {
          foo: { size: "60px" },
          // bar size defaults to 1
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(60);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(40);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(60);
    expect(result.bar.y).to.equal(0);
  });

  it("two components vertical, absolute size", function() {
    var layout = {
          orientation: "vertical",
          children: ["foo", "bar"]
        },
        sizes = {
          foo: { size: "60px" },
          // bar size defaults to 1
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(100);
    expect(result.foo.height).to.equal(60);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(100);
    expect(result.bar.height).to.equal(40);
    expect(result.bar.x).to.equal(0);
    expect(result.bar.y).to.equal(60);
  });

  it("three components horizontal", function() {
    var layout = {
          orientation: "horizontal",
          children: ["foo", "bar", "baz"]
        },
        sizes = {
          foo: { size: 2},
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(50);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(25);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(50);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(25);
    expect(result.baz.height).to.equal(100);
    expect(result.baz.x).to.equal(75);
    expect(result.baz.y).to.equal(0);
  });

  it("three components nested horizontal, unspecified sizes", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "horizontal",
              children: ["bar", "baz"]
            }
          ]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(50);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(25);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(50);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(25);
    expect(result.baz.height).to.equal(100);
    expect(result.baz.x).to.equal(75);
    expect(result.baz.y).to.equal(0);
  });

  it("three components nested horizontal & vertical, unspecified sizes", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "vertical",
              children: ["bar", "baz"]
            }
          ]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(50);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(50);
    expect(result.bar.height).to.equal(50);
    expect(result.bar.x).to.equal(50);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(50);
    expect(result.baz.height).to.equal(50);
    expect(result.baz.x).to.equal(50);
    expect(result.baz.y).to.equal(50);
  });

  it("three components nested horizontal & vertical, relative size in layout", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "vertical",
              size: 3,
              children: ["bar", "baz"]
            }
          ]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(25);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(75);
    expect(result.bar.height).to.equal(50);
    expect(result.bar.x).to.equal(25);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(75);
    expect(result.baz.height).to.equal(50);
    expect(result.baz.x).to.equal(25);
    expect(result.baz.y).to.equal(50);
  });

  it("three components nested horizontal & vertical, relative size in layout as a string", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "vertical",
              size: "3",
              children: ["bar", "baz"]
            }
          ]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(25);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(75);
    expect(result.bar.height).to.equal(50);
    expect(result.bar.x).to.equal(25);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(75);
    expect(result.baz.height).to.equal(50);
    expect(result.baz.x).to.equal(25);
    expect(result.baz.y).to.equal(50);
  });

  it("three components nested horizontal & vertical, absolute size in layout", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "vertical",
              size: "60px",
              children: ["bar", "baz"]
            }
          ]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);

    expect(result.foo.width).to.equal(40);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(60);
    expect(result.bar.height).to.equal(50);
    expect(result.bar.x).to.equal(40);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(60);
    expect(result.baz.height).to.equal(50);
    expect(result.baz.x).to.equal(40);
    expect(result.baz.y).to.equal(50);
  });

  it("three components, absolute size in layout, relative size in sizes", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "vertical",
              size: "60px",
              children: ["bar", "baz"]
            }
          ]
        },
        sizes = { bar: { size: 3 }},
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);

    expect(result.foo.width).to.equal(40);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(60);
    expect(result.bar.height).to.equal(75);
    expect(result.bar.x).to.equal(40);
    expect(result.bar.y).to.equal(0);

    expect(result.baz.width).to.equal(60);
    expect(result.baz.height).to.equal(25);
    expect(result.baz.x).to.equal(40);
    expect(result.baz.y).to.equal(75);
  });

  it("three components, one hidden", function() {
    var layout = {
          orientation: "horizontal",
          children: [
            "foo",
            {
              orientation: "vertical",
              children: ["bar", "baz"]
            }
          ]
        },
        sizes = { baz: { hidden: true }},
        box = { width: 100, height: 100 },
        result = computeLayout(layout, sizes, box);
    
    expect(result.foo.width).to.equal(50);
    expect(result.foo.height).to.equal(100);
    expect(result.foo.x).to.equal(0);
    expect(result.foo.y).to.equal(0);

    expect(result.bar.width).to.equal(50);
    expect(result.bar.height).to.equal(100);
    expect(result.bar.x).to.equal(50);
    expect(result.bar.y).to.equal(0);

    expect("baz" in result).to.equal(false);
  });

  it("quantization from floats to ints for pixel dimensions", function() {
    var layout = {
          orientation: "horizontal",

          // Using 3 children will induce 33.333333 widths,
          // which should be quantized to integers and ensure no gaps.
          children: ["a", "b","c"]
        },
        box = { width: 100, height: 100 },
        result = computeLayout(layout, null, box);
    
    expect(result.a.x).to.equal(0);
    expect(result.a.width).to.equal(33);

    expect(result.b.x).to.equal(result.a.width);
    expect(result.b.width).to.equal(34);

    expect(result.c.x).to.equal(result.b.x + result.b.width);
    expect(result.c.width).to.equal(33);

    expect(result.a.width + result.b.width + result.c.width).to.equal(100);

  });
});

//// This file contains tests for the layout plugin.
//// Created by Curran Kelleher Feb 2015
//
//// Use the "expect" assert style.
//// See http://chaijs.com/guide/styles/
//var expect = require("chai").expect,
//    Model = require("model-js"),
//    Chiasm = require("../index");
//
//// Use JSDOM for DOM manipulation in Node.
//// https://github.com/tmpvar/jsdom#creating-a-browser-like-window-object
//// "var" omitted intentionally to induce global variables.
//document = require("jsdom").jsdom();
//window = document.parentWindow;
//
//// A utility function for asserting a group of component property values.
//function expectValues(chiasm, values, callback){
//  var promises = Object.keys(values).map(function(key){
//    return new Promise(function(resolve, reject){
//      var path = key.split("."),
//          alias = path[0],
//          property = path[1],
//          propertyPath = path.slice(2),
//          expectedValue = values[key];
//
//      chiasm.getComponent(alias).then(function(component){
//        component.when(property, function(value){
//          propertyPath.forEach(function(key){
//            value = value[key];
//          });
//          expect(value).to.equal(expectedValue);
//          resolve();
//        });
//      }, reject);
//    });
//  });
//  
//  Promise.all(promises).then(function(results){
//    callback();
//  }, function(err){
//    console.log(err);
//  });
//}
//
//function initChiasm(){
//  var div = document.createElement("div");
//  var chiasm = Chiasm(div);
//
//  // Set the width and height that the layout will use.
//  div.clientHeight = div.clientWidth = 100;
//
//  return chiasm;
//}
//
//describe("plugins/layout", function () {
//  it("should compute size for a single dummyVis", function(done) {
//
//    var chiasm = initChiasm();
//
//    chiasm.setConfig({
//      layout: {
//        plugin: "layout",
//        state: {
//          layout: "a"
//        }
//      },
//      a: {
//        plugin: "dummyVis"
//      }
//    }).then(function(){
//      chiasm.getComponent("a").then(function(a){
//        a.when("box", function(box){
//          expect(box.x).to.equal(0);
//          expect(box.y).to.equal(0);
//          expect(box.width).to.equal(100);
//          expect(box.height).to.equal(100);
//          done();
//        });
//      });
//
//    }, function(err){
//      console.log(err);
//    });
//  });
//
//  it("should compute size for a 2 instances of dummyVis", function(done) {
//    var chiasm = initChiasm();
//    
//    chiasm.config = {
//      layout: {
//        plugin: "layout",
//        state: {
//          layout: {
//            orientation: "horizontal",
//            children: ["a", "b"]
//          }
//        }
//      },
//      a: {
//        plugin: "dummyVis"
//      },
//      b: {
//        plugin: "dummyVis"
//      }
//    };
//
//    expectValues(chiasm, {
//      "a.box.x": 0,
//      "a.box.y": 0,
//      "a.box.width": 50,
//      "a.box.height": 100,
//      "b.box.x": 50,
//      "b.box.y": 0,
//      "b.box.width": 50,
//      "b.box.height": 100
//    }, done);
//  });
//
//  it("should compute from size specified in initial state", function(done) {
//
//    var chiasm = initChiasm();
//    
//    chiasm.config = {
//      layout: {
//        plugin: "layout",
//        state: {
//          layout: {
//            orientation: "horizontal",
//            children: ["a", "b"]
//          }
//        }
//      },
//      a: {
//        plugin: "dummyVis",
//        state: {
//          size: "40px"
//        }
//      },
//      b: {
//        plugin: "dummyVis"
//      }
//    };
//    expectValues(chiasm, {
//      "a.box.width": 40,
//      "b.box.width": 60
//    }, done);
//  });
//
//  // This tests that the layout plugin is listening for changes
//  // in the "size" property of each component in the layout.
//
//  // TODO refactor layout plugin to REMOVE THIS FEATURE
//  // The layout should be specified purely in the layout component,
//  // not spread across "size" properties in component configurations.
//  it("should compute from size changed within component", function(done) {
//    var chiasm = initChiasm();
//    
//    chiasm.config = {
//      layout: {
//        plugin: "layout",
//        state: {
//          layout: {
//            orientation: "horizontal",
//            children: ["a", "b"]
//          }
//        }
//      },
//      a: {
//        plugin: "dummyVis",
//        state: {
//          size: "40px"
//        }
//      },
//      b: {
//        plugin: "dummyVis"
//      }
//    };
//
//    chiasm.getComponent("a").then(function(a){
//      chiasm.getComponent("b").then(function(b){
//        a.when("box", function(box){
//          if(a.size === "40px"){
//            expect(box.width).to.equal(40);
//            expect(b.box.width).to.equal(60);
//            a.size = "55px";
//          } else if(a.size === "55px"){
//            expect(box.width).to.equal(55);
//            expect(b.box.width).to.equal(45);
//            a.size = "75px";
//          } else if(a.size === "75px"){
//            expect(box.width).to.equal(75);
//            expect(b.box.width).to.equal(25);
//            done();
//          }
//        });
//      });
//    });
//  });
//});

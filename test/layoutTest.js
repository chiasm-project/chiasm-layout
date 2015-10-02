// This file contains tests for the layout plugin.
// Created by Curran Kelleher Feb 2015

// Use the "expect" assert style.
// See http://chaijs.com/guide/styles/
var expect = require("chai").expect,
    Model = require("model-js"),
    Chiasm = require("chiasm");

// Use JSDOM for DOM manipulation in Node.
// https://github.com/tmpvar/jsdom#creating-a-browser-like-window-object
// "var" omitted intentionally to induce global variables.
document = require("jsdom").jsdom();
window = document.parentWindow;

// A utility function for asserting a group of component property values.
function expectValues(chiasm, values, callback){
  var promises = Object.keys(values).map(function(key){
    return new Promise(function(resolve, reject){
      var path = key.split("."),
          alias = path[0],
          property = path[1],
          propertyPath = path.slice(2),
          expectedValue = values[key];

      chiasm.getComponent(alias).then(function(component){
        component.when(property, function(value){
          propertyPath.forEach(function(key){
            value = value[key];
          });
          expect(value).to.equal(expectedValue);
          resolve();
        });
      }, reject);
    });
  });
  
  Promise.all(promises).then(function(results){
    callback();
  }, function(err){
    console.log(err);
  });
}

function initChiasm(){
  var chiasm = Chiasm();

  chiasm.plugins.layout = require("../index");
  chiasm.plugins.dummyVis = Model;

  // Mock the DOM container using jsdom.
  chiasm.getComponent("layout").then(function (layout){
    var div = document.createElement("div");
    div.clientHeight = div.clientWidth = 100;
    layout.container = div;
  });

  return chiasm;
}

describe("plugins/layout", function () {
  it("should compute size for a single dummyVis", function(done) {

    var chiasm = initChiasm();

    chiasm.setConfig({
      layout: {
        plugin: "layout",
        state: {
          layout: "a"
        }
      },
      a: {
        plugin: "dummyVis"
      }
    }).then(function(){
      chiasm.getComponent("a").then(function(a){
        a.when("box", function(box){
          expect(box.x).to.equal(0);
          expect(box.y).to.equal(0);
          expect(box.width).to.equal(100);
          expect(box.height).to.equal(100);
          done();
        });
      });

    }, function(err){
      console.log(err);
    });
  });

  it("should compute size for a 2 instances of dummyVis", function(done) {
    var chiasm = initChiasm();
    
    chiasm.config = {
      layout: {
        plugin: "layout",
        state: {
          layout: {
            orientation: "horizontal",
            children: ["a", "b"]
          }
        }
      },
      a: {
        plugin: "dummyVis"
      },
      b: {
        plugin: "dummyVis"
      }
    };

    expectValues(chiasm, {
      "a.box.x": 0,
      "a.box.y": 0,
      "a.box.width": 50,
      "a.box.height": 100,
      "b.box.x": 50,
      "b.box.y": 0,
      "b.box.width": 50,
      "b.box.height": 100
    }, done);
  });

  it("should compute from size specified in initial state", function(done) {

    var chiasm = initChiasm();
    
    chiasm.config = {
      layout: {
        plugin: "layout",
        state: {
          layout: {
            orientation: "horizontal",
            children: ["a", "b"]
          },
          sizes: {
            a: {
              size: "40px"
            }
          }
        }
      },
      a: {
        plugin: "dummyVis"
      },
      b: {
        plugin: "dummyVis"
      }
    };
    expectValues(chiasm, {
      "a.box.width": 40,
      "b.box.width": 60
    }, done);
  });
});

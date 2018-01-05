require("./lib/social");
require("./lib/ads");
require("./lib/comments");
// var track = require("./lib/tracking");

require("savage-image");

var $ = require("./lib/qsa");
var debounce = require("./lib/debounce");
var Camera = require("savage-camera");
var savage = require("savage-query");

var container = $.one(".map-container");
var poiList = $(".poi").reverse();

var current = null;

container.addEventListener("load", function() {
  var camera = new Camera($.one("svg", container));
  var image = savage(".map-container image");
  var svg = $.one("svg", container);
  svg.setAttribute("alt", "An interactive map of the One Center City project");

  var m = savage.dom;
  var dropshadow = m("filter", { id: "drop" },
    [-1, -1, 1, 1].map((y, i) =>
      m("feDropShadow", {
        dx: y,
        dy: i % 2 ? -1 : 1,
        stdDeviation: .5,
        "flood-color": "#D8D9DA",
        "flood-opacity": 1
      })
    )
  );

  var defs = $.one("defs", svg);
  defs.appendChild(dropshadow);

  var desat = m("filter", { id: "desat" }, [
    m("feColorMatrix", {
      type: "saturate",
      values: "0.5"
    })
  ]);
  defs.appendChild(desat);


  window.addEventListener("scroll", debounce(function() {

    var located = false;
    for (var i = 0; i < poiList.length; i++) {
      var poi = poiList[i];
      var id = poi.getAttribute("data-map");
      if (!id) continue;
      var layer = $.one("#" + id, container);
      if (!layer) return console.log(id);
      var bounds = poi.getBoundingClientRect();
      if (!located && bounds.top < window.innerHeight) {
        if (id == current) return;
        located = layer;
        savage(layer).addClass("highlight");
      } else {
        savage(layer).removeClass("highlight");
      }
    }

    if (!located) {
      current = null;
      camera.pan({ x: 1, y: 1, width: 770.1, height: 909.3 }, 400);
      image.removeClass("zoomed");
    } else if (located != current) {
      current = located;
      var layerBounds = located.getBBox();
      var padding = layerBounds.width * layerBounds.height > 20000 ? 10 : 50;
      camera.zoomTo(located, padding);
      image.addClass("zoomed");
    }

  }, 300));

});
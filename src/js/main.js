// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("savage-image");

var $ = require("./lib/qsa");
var Camera = require("savage-camera");

var container = $.one(".map-container");
var poiList = $(".poi").reverse();

var current = null;

container.addEventListener("load", function() {
  var camera = new Camera($.one("svg", container));

  window.addEventListener("scroll", function() {

    for (var i = 0; i < poiList.length; i++) {
      var poi = poiList[i];
      var id = poi.getAttribute("data-map");
      if (!id) continue;
      var bounds = poi.getBoundingClientRect();
      if (bounds.top < window.innerHeight) {
        if (id == current) return;
        current = id;
        console.log(id, $.one("#" + id));
        camera.zoomTo($.one("#" + id));
        return;
      }
    }

  });

});
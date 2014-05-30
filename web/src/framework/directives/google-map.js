var APILoaded = false;
var injecting = false;
var queue = [];

function initMap(el, attrs) {
  return new google.maps.Map(el, {
    center: attrs.latlng,
    zoom: parseInt(attrs.zoom),
    scrollwheel: false
  });
}

function createMarker(map, latlng, title) {
  return new google.maps.Marker({
    map: map,
    position: latlng,
    title: title || null
  });
}

function getLatLng(address, cb) {
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ address: address }, function(res, status) {
    if (status !== 'OK') return cb('Geocoding error: ' + status);
    return cb(null, res);
  });
}

function injectGMap() {
  window.gMapLoadCallback = function(){
    APILoaded = true;
    var cb = null;
    while (cb = queue.pop()) cb();
  }
  var gmap = document.createElement('script');
  gmap.src = 'http://maps.googleapis.com/maps/api/js?sensor=false' + 
             '&callback=gMapLoadCallback';
  gmap.async = true;
  var script = document.getElementsByTagName('script')[0];
  script.parentNode.insertBefore(gmap, script);
  injecting = true;
}

function linkDirective(el, attrs) {
  // Get geocode for center and draw map
  getLatLng(attrs.latlng, function(err, res) {
    attrs.latlng = res[0].geometry.location;
    var map = initMap(el[0], attrs);
    // Get geocode for marker and draw it
    getLatLng(attrs.marker, function(err, res) {
      var marker = createMarker(map, res[0].geometry.location);
    });
  });
}

module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div style="height:20rem" class="map"></div>',
    scope: true,
    link: function(scope, el, attrs) {
      if (APILoaded) return linkDirective(el, attrs);
      queue.push(function() {
        linkDirective(el, attrs);
      });
      if (!injecting) injectGMap();
    }
  }
}

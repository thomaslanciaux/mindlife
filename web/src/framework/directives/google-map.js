function initMap(google, el, attrs) {
  return new google.maps.Map(el, {
    center: attrs.latlng,
    zoom: parseInt(attrs.zoom),
    scrollwheel: false
  });
}

function createMarker(google, map, latlng, title) {
  return new google.maps.Marker({
    map: map,
    position: latlng,
    title: title || null
  });
}

function getLatLng(google, address, cb) {
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ address: address }, function(res, status) {
    if (status !== 'OK') return cb('Geocoding error: ' + status);
    return cb(null, res);
  });
}

module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div style="height:20rem" class="map"></div>',
    scope: true,
    link: function(scope, el, attrs) {
      // Check if maps API is loaded
      if (!google && !google.map) return;
      // Get geocode for center and draw map
      getLatLng(google, attrs.latlng, function(err, res) {
        attrs.latlng = res[0].geometry.location;
        var map = initMap(google, el[0], attrs);
        // Get geocode for marker and draw it
        getLatLng(google, attrs.marker, function(err, res) {
          var marker = createMarker(google, map, res[0].geometry.location);
        });
      });
    }
  }
}

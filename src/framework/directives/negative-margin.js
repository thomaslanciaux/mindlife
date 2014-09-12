var channels = require('../channels');

var header = document.querySelectorAll('.header')[0];

function draw(elt, viewport) {
  var parent = elt.parentElement;
  var diff = 0;
  if (viewport <= 750) {
    diff = (viewport - parent.offsetWidth)/2;
  } else {
    diff = parent.offsetLeft - header.offsetWidth;
  }
  elt.style.marginLeft = '-' + diff + 'px';
  elt.style.marginRight = '-' + diff + 'px';
}

module.exports = function() {
  return {
    restrict: 'C',
    link: function(scope, elt, attrs) {
      elt = elt[0];
      draw(elt, window.innerWidth);
      channels.pubsub.on('resize', function(dim) {
        draw(elt, dim.width);
      });
    }
  }
}

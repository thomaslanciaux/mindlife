var Mediator = require('mediator-js').Mediator;
var pubsub = new Mediator();
var throttle = require('./throttle');

function viewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// Global resize handler
window.addEventListener('resize', throttle(function(){
  var dim = viewport();
  pubsub.emit('resize', dim);
}, 50, { leading: false  }));

var channels = {
  pubsub: pubsub,
  viewport: viewport
}

module.exports = channels;

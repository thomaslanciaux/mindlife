var env = require('./env');

function getGallery(id, i, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    cb(null, i, JSON.parse(this.responseText));
  };
  xhr.open('get', env.API.REST_URL + '/_restGalleries/' + id, true);
  xhr.send();
}

module.exports = getGallery;

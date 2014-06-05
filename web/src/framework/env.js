var BASE = 'http://mindlife.co.uk';
var API = {
  BASE: BASE,
  REST_URL: BASE + '/AppWebRest',
  ADMIN_URL: BASE + '/AppWebGenie'
};

function getLang() {
  var url = document.location.hash.split('/');
  if (url.length < 2) url.push('en');
  return url[1];
}

function getVars(cb) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on fetching ENV vars');
    return cb(null, JSON.parse(self.responseText)[0]);
  }
  xhr.open('GET', API.REST_URL + '/_restEnvVars', false);
  xhr.send();
}

module.exports = {
  API: API,
  getLang: getLang,
  getVars: getVars
};

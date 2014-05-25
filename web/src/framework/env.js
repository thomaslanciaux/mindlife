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

function getVars($http, cb) {
  var q = $http.get(API.REST_URL + '/_restEnvVars');
  q.then(function(res) {
    return cb(null, res.data[0]);
  });
}

module.exports = {
  API: API,
  getLang: getLang,
  getVars: getVars
};

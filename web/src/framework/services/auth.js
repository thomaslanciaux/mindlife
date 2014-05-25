var env = require('../env');
var Base64 = require('../services/base64');

function submitCredentials($http, credentials, cb) {
  var encoded = Base64.encode(credentials.email + ':' + credentials.password);
  $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
  var req = $http.post(env.API.REST_URL + '/_restAuth/login', credentials);
  req.success(function(res) {
    return cb(null, res);
  });
  req.error(function(res) {
    return cb(res, null);
  })
}

module.exports = {
  submitCredentials: submitCredentials
};

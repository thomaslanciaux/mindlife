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

function isAuthRoute(path, authPaths) {
  var i = authPaths.length;
  var check = false;
  while(i--) {
    if (authPaths[i] !== path) continue;
    check = true;
  }
  return check;
}

module.exports = {
  submitCredentials: submitCredentials,
  isAuthRoute: isAuthRoute
};

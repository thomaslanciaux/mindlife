var env = require('./env');
var Base64 = require('./services/base64');
var SessionService = require('./services/session');

function sanitizeCredentials($sanitize, credentials) {
  return {
    email: $sanitize(credentials.email),
    password: $sanitize(credentials.password)
  };
}

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

function initCtl($rootScope, $http, $sanitize, $cookieStore, $scope) {
  // Set app state
  $rootScope.activeNav = 'signin';
  $rootScope.pageTitle = 'Sign in';
  $scope.login = function() {
    var credentials = sanitizeCredentials($sanitize, $scope.credentials);
    submitCredentials($http, credentials, function(err, res) {
      if (err) return console.log(err);
      $rootScope.isLoggedIn = true;
      SessionService.set('authenticated', true);
      $cookieStore.put('userdata', res);
    });
  }
}

module.exports = initCtl;

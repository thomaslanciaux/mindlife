var env = require('./env');
var Base64 = require('./services/base64');

function sanitizeCredentials($sanitize, credentials) {
  return {
    email: $sanitize(credentials.email),
    password: $sanitize(credentials.password)
  };
}

function submitCredentials(credentials, cb) {
  var data = new FormData();
  for (var key in credentials) data.append(key, credentials[key]);
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    cb(null, JSON.parse(this.responseText));
  }
  xhr.open('POST', env.API.REST_URL + '/_restAuth/login')
  xhr.send(data);
}

function initCtl($rootScope, $http, $sanitize, $scope) {
  // Set app state
  $rootScope.activeNav = 'signin';
  $rootScope.pageTitle = 'Sign in';
  $scope.login = function() {
    var credentials = sanitizeCredentials($sanitize, $scope.credentials);
    submitCredentials(credentials);
  }
}

module.exports = initCtl;

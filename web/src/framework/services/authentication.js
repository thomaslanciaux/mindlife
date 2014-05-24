var env = require('../env');
var SessionService = require('./session');
var Base64 = require('./base64');

function sanitizeCredentials($http, $sanitize, credentials) {
  var encoded = Base64.encode(credentials.email + ':' + credentials.password);
  $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
  return {
    email: $sanitize(credentials.email),
    password: $sanitize(credentials.password)
    //csrf_token: CSRF_TOKEN,
  };
}

function cacheSession(SessionService) {
  SessionService.set('authenticated', true);
}

function uncacheSession(SessionService) {
  SessionService.unset('authenticated');
}

function loginError(res) {
  alert(res.val);
}

module.exports = function ($http, $rootScope, $sanitize, $cookieStore) {
  return {
    login: function(credentials) {
      var login = $http.post(env.API.REST_URL + '/_restAuth/login', 
                             sanitizeCredentials($http, $sanitize, credentials));
      login.success(cacheSession);
      login.success(function(data) {
        $cookieStore.put('userdata', data);
        $rootScope.user = $cookieStore.get('userdata');
      });
      login.error(loginError);
      return login;
    },
    logout: function() {
      var logout = $http.get($rootScope.production_url_4LRest + 
                            '/_restAuth/logout');
      logout.success(uncacheSession);
      logout.success(function(data, status) {
        $cookieStore.remove('userdata');
        $rootScope.user = null;
        $rootScope.register = false;
        $rootScope.loginSuccess = false;
        $rootScope.registerSuccess = false;});
      $http.defaults.headers.common.Authorization = 'Basic ';
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
};

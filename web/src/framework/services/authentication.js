var env = require('../env');
var Base64 = require('./base64');

module.exports = function ($http, $rootScope, $sanitize, $cookieStore) {
  return {
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

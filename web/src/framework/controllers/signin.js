var env = require('../env');
var Session = require('../services/session');
var Auth = require('../services/auth');

function initCtl($rootScope, $http, $sanitize, $cookieStore, $location, $scope) {
  // Set app state
  $rootScope.activeNav = 'signin';
  $rootScope.pageTitle = 'Sign in';
  $scope.login = function() {
    Auth.submitCredentials($http, $scope.credentials, function(err, res) {
      if (err) return console.log(err);
      $rootScope.isLoggedIn = true;
      Session.set('authenticated', true);
      $cookieStore.put('userdata', res);
      $rootScope.user = res;
      // Redirect to dashboard
      $location.path('/' + env.getLang() + '/dashboard');
    });
  }
}

module.exports = initCtl;

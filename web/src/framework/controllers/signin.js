var env = require('../env');
var Session = require('../services/session');
var Auth = require('../services/auth');

function initCtl($rootScope, $http, $cookieStore, $location, $scope) {
  var lang = env.getLang();
  // Redirect to dashboard if logged in
  if ($rootScope.isLoggedIn) return $location.path('/' + lang + '/dashboard');

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
      $location.path('/' + lang + '/dashboard');
    });
  }
}

module.exports = initCtl;

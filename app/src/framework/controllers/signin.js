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
    $rootScope.routeLoading = true;
    Auth.submitCredentials($http, $scope.credentials, function(err, res) {
      $rootScope.routeLoading = false;
      if (err) return alert(err.flash);
      $rootScope.isLoggedIn = true;
      Session.set('authenticated', true);
      $cookieStore.put('userdata', res);
      $rootScope.user = res;
      // Redirect to dashboard
      $location.path('/' + lang + '/dashboard');
    });
  }

  // Autofocus on the first input once the view is loaded
  var $input = document.getElementById('login-email');
  $input.focus();
}

module.exports = initCtl;

var env = require('./env');
var Session = require('./services/session');

function redirectToHome() {
  return document.location.hash = '/' + env.getLang() + '/home';
}

function initCtl($rootScope, $http, $cookieStore) {
  if (!$rootScope.isLoggedIn) redirectToHome();
  var req = $http.get(env.API.REST_URL + '/_restAuth/logout');
  req.success(function(res) {
    $rootScope.isLoggedIn = false;
    Session.unset('authenticated');
    $cookieStore.remove('userdata');
    delete $rootScope.user;
    redirectToHome();
  });
}

module.exports = initCtl;

require('./vendors/angular');

var env = require('./framework/env');
var nav = require('./framework/navigation');
var pages = require('./framework/pages');
var SessionService = require('./framework/services/session');

var app = angular.module('ML', [
  'ngRoute', 'ngSanitize', 'ngCookies', 'ngTouch', 'angular-google-analytics'
]);

app.controller('PagesCtl', pages.initCtl);
app.controller('SigninCtl', require('./framework/controllers/signin'));
app.controller('SignupCtl', require('./framework/controllers/signup'));
app.controller('SignoutCtl', require('./framework/controllers/signout'));
app.controller('DashboardCtl', require('./framework/controllers/dashboard'));

app.directive('bindOnce', require('./framework/directives/bind-once'));

app.config(require('./framework/config'));

app.run(function($rootScope, $http, $cookieStore, $sce, $route) {

  // Get Env vars
  env.getVars($http, function(err, res){ $rootScope.envVars = res; });
  $rootScope.lang = env.getLang();
  $rootScope.env = env.API;
  
  // Get nav
  nav.getNav($http, function(err, res) { $rootScope.nav = res; });

  // Active state of nav on route changes
  $rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
    var active = current.params.page || 'home';
    $rootScope.activeNav = active;

    // Go to top of the page
    document.body.scrollTop = 0;

    // Get active page title
    if ($rootScope.nav && active) {
      var i = $rootScope.nav.length;
      while (i--) {
        var path = $rootScope.nav[i].path.split('/').pop();
        if (path !== active) continue;
        $rootScope.pageTitle = $rootScope.nav[i].label;
        break;
       }
    }
  });

  // Active class on current route
  $rootScope.navClass = function(path) {
    var path = path.split('/').pop();
    return (path === $rootScope.activeNav)? 'active' : '';
  }

  // trustAsResourceUrl external URL in data
  $rootScope.trustSrc = function(src) { return $sce.trustAsResourceUrl(src); }

  // Check if user is logged in
  $rootScope.isLoggedIn = !!SessionService.get('authenticated');

  // Get user info if logged in
  if (!$rootScope.isLoggedIn) return;
  $rootScope.user = $cookieStore.get('userdata');
  
});

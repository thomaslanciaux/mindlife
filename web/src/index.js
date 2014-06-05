require('./framework/vendors/angular');

var env = require('./framework/env');
var nav = require('./framework/navigation');
var pages = require('./framework/pages');
var SessionService = require('./framework/services/session');

var app = angular.module('App', [
  'ngRoute', 'ngSanitize', 'ngCookies', 'ngTouch', 'angular-google-analytics'
]);

app.controller('PagesCtl', pages.initCtl);
app.controller('SigninCtl', require('./framework/controllers/signin'));
app.controller('SignupCtl', require('./framework/controllers/signup'));
app.controller('SignoutCtl', require('./framework/controllers/signout'));
app.controller('DashboardCtl', require('./framework/controllers/dashboard'));
app.controller('HomeCtl', require('./framework/controllers/home'));

app.directive('bindOnce', require('./framework/directives/bind-once'));
app.directive('googleMap', require('./framework/directives/google-map'));
app.directive('fileUpload', require('./framework/directives/file-upload'));

app.filter('Filesize', require('./framework/filters/filesize'));
app.filter('componentsType', require('./framework/filters/components-type'));
app.filter('hl', require('./framework/filters/highlight'));

app.config(require('./framework/config'));

app.run(function($rootScope, $http, $cookieStore, $sce, $route, $location,
                 $timeout) {
  // Get Env vars
  $rootScope.envVars = angular.envVars;
  $rootScope.lang = env.getLang();
  $rootScope.env = env.API;
  
  // Get nav
  $rootScope.nav = angular.nav;

  // Active state of nav on route changes
  $rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
    var active = current.params.page || 'home';
    $rootScope.activeNav = active;

    // Go to top of the page
    $timeout(function() { document.body.scrollTop = 0; });

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

  // Search
  $rootScope.search = function() {
    var query = $rootScope.searchString;
    if (!query || query.length < 2) return;
    $location.search('');
    $location.path('/' + $rootScope.lang + '/search/' + query);
  }

  // trustAsResourceUrl external URL in data
  $rootScope.trustSrc = function(src) { return $sce.trustAsResourceUrl(src); }

  // Check if user is logged in
  $rootScope.isLoggedIn = angular.isLoggedIn;

  // Get user info if logged in
  if (!$rootScope.isLoggedIn) return;
  $rootScope.user = $cookieStore.get('userdata');
});

angular.element(document).ready(function() {
  angular.isLoggedIn = !!SessionService.get('authenticated');
  env.getVars(function(err, res){ 
    if (err) return alert(err);
    angular.envVars = res;
    nav.getNav(function(err, res) { 
      if (err) return alert(err);
      angular.nav = res; 
      angular.bootstrap(document, ['App']);
    }); 
  });
});

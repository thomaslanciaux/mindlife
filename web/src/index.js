require('./vendors/angular');

var env = require('./framework/env');
var nav = require('./framework/navigation');
var pages = require('./framework/pages');

var app = angular.module('ML', [
  'ngRoute', 'ngSanitize', 'ngCookies', 'ngTouch', 'ngAnimate',
  'angular-google-analytics'
]);

app.config(function($routeProvider, AnalyticsProvider) {
  
  $routeProvider.when('/en/:page', {
    templateUrl: './views/page.html',
    controller: 'PagesCtl',
    resolve: pages.resolve
  });
  $routeProvider.otherwise({ redirectTo: '/en/home' });

  AnalyticsProvider.setAccount('UA-12411151-8');
  AnalyticsProvider.trackPages(true); // track all routes (or not)
  AnalyticsProvider.useAnalytics(true); // Use analytics.js instead of ga.js
  AnalyticsProvider.ignoreFirstPageLoad(true) ; // Ignore first page view
  AnalyticsProvider.useECommerce(true); //Enabled eCommerce module
  AnalyticsProvider.useEnhancedLinkAttribution(true);
  // change page event name
  AnalyticsProvider.setPageEvent('$stateChangeSuccess');
});

app.factory('AuthenticationService', 
            require('./framework/services/authentication'));
app.controller('PagesCtl', pages.initCtl);

app.run(function($rootScope, $http, $cookieStore, AuthenticationService,
                 $sce) {
  
  // Get Env vars
  env.getVars($http, function(err, res){ $rootScope.envVars = res; });
  $rootScope.lang = env.getLang();
  
  // Get nav
  nav.getNav($http, function(err, res) { $rootScope.nav = res; });

  // Active state of nav on route changes
  $rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
    var active = current.params.page;
    $rootScope.activeNav = active;

    // Get active page title
    var i = $rootScope.nav.length;
    while (i--) {
      var path = $rootScope.nav[i].path.split('/').pop();
      if (path !== active) continue;
      $rootScope.pageTitle = $rootScope.nav[i].label;
      break;
    }

    // Go to top of the page
    document.body.scrollTop = 0;
  });

  // Active class on current route
  $rootScope.navClass = function(path) {
    var path = path.split('/').pop();
    return (path === $rootScope.activeNav)? 'active' : '';
  }

  // trustAsResourceUrl external URL in data
  $rootScope.trustSrc = function(src) {
    console.log(src)
    return $sce.trustAsResourceUrl(src);
  }

  // Check if user is logged in
  $rootScope.isLoggedIn = !!AuthenticationService.isLoggedIn()

  // Get user info if logged in
  if (!$rootScope.isLoggedIn) return;
  $rootScope.user = $cookieStore.get('userdata');
  
});

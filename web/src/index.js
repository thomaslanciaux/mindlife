require('./vendors/angular');
var env = require('./framework/env');
var nav = require('./framework/navigation');

var app = angular.module('ML', [
  'ngRoute', 'ngSanitize', 'ngCookies', 'ngTouch', 'ngAnimate',
  'angular-google-analytics'
]);

app.config(function($routeProvider, AnalyticsProvider) {
  
  $routeProvider.when('/en/:page', {
    templateUrl: './views/page.html',
    controller: nav.NavCtrl
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

app.run(function($rootScope, $http) {
  
  // Get ENV_VARS
  env.getVars($http, function(err, res){
    $rootScope.envVars = res;
  });
  
  // Get nav
  nav.getNav($http, function(err, res) {
    $rootScope.nav = res;
  });

  // Active state of nav on route changes
  $rootScope.$on('$routeChangeSuccess', function(next, current) {
    $rootScope.activeNav = current.params.page;
  });

  // Active class on current route
  $rootScope.navClass = function(path) {
    var path = path.split('/').pop();
    return (path === $rootScope.activeNav)? 'active' : '';
  }

});


require('./vendors/angular');
var env = require('./framework/env');
var nav = require('./framework/navigation');
var REST_URL = '//192.168.0.13/AppWebRest';

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

});

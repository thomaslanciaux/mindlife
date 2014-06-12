var env = require('./env');
var pages = require('./pages');

module.exports = function($routeProvider, AnalyticsProvider) {
  var lang = env.getLang() || 'en';
  var base = '/' + lang + '/';
  $routeProvider.when(base + 'home', { 
    controller: 'HomeCtl', templateUrl: './views/home.html' 
  });
  $routeProvider.when(base + 'signin', { 
    templateUrl: './views/signin.html', controller: 'SigninCtl'
  });
  $routeProvider.when(base + 'signup', {
    templateUrl: './views/signup.html', controller: 'SignupCtl'
  });
  $routeProvider.when(base + 'signout', {
    templateUrl: './views/home.html', controller: 'SignoutCtl'
  });
  $routeProvider.when(base + 'dashboard', {
    templateUrl: './views/dashboard.html', controller: 'DashboardCtl'
  });
  $routeProvider.when(base + ':page', {
    templateUrl: './views/page.html', controller: 'PagesCtl',
    resolve: pages.resolve
  });
  $routeProvider.when(base + 'search/:query', {
    templateUrl: './views/page.html', controller: 'PagesCtl',
    resolve: pages.resolve, reloadOnSearch: false
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
}

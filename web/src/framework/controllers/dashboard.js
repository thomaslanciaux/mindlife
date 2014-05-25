function initCtl($rootScope, $location) {
  if (!$rootScope.isLoggedIn) return $location.path('/');

  $rootScope.pageTitle = 'Dashboard';
  $rootScope.activeNav = 'dashboard';
}

module.exports = initCtl;

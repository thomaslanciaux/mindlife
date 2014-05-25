var moment = require('moment');

function initCtl($rootScope, $location) {
  if (!$rootScope.isLoggedIn) return $location.path('/');

  $rootScope.pageTitle = 'Dashboard';
  $rootScope.activeNav = 'dashboard';
  var lastUpdate = $rootScope.user.updated_at;
  var dateFormat = 'Do MMM YYYY, h:mm a';
  $rootScope.user.lastUpdate = moment(lastUpdate).format(dateFormat);
}

module.exports = initCtl;

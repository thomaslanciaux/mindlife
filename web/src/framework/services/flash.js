function displayFlash($rootScope, msg) {
  $rootScope.flash = msg;
}

function clearFlash($rootScope) {
  $rootScope.flash = '';
}

module.exports = {
  show: displayFlash,
  clear: clearFlash
};

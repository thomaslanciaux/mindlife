var countries = require('../countries');
var langs = [
  { label: 'English', value: 0 },
  { label: 'Spanish', value: 1 },
  { label: 'French', value: 2 },
  { label: 'German', value: 3 }
];

function getCurrentIPCountry(cb) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on fetch Geoip');
    var res = JSON.parse(self.responseText);
    return cb(null, res.countryCode);
  }
  xhr.open('GET', 'http://geoip.smart-ip.net/json');
  xhr.send();
}

function initCtl($rootScope, $scope) {
  $rootScope.pageTitle = 'Sign up';
  $rootScope.activeNav = 'signin';
  $scope.countries = countries;
  $scope.langs = langs;
  $scope.lang = langs[0].value;

  getCurrentIPCountry(function(err, res) {
    if (err) return $scope.country = 'GB';
    $scope.$apply(function() {
      $scope.country = res;
    });
  });
}

module.exports = initCtl;

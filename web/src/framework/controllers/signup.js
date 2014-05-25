var env = require('../env');
var Auth = require('../services/auth');
var Session = require('../services/session');
var countries = require('../countries');

var langs = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'sp' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' }
];
var roles = [
  { label: 'Registered reader', rank: 5 }
];

function signUp(user, cb) {
  user = formatUser(user);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', env.API.REST_URL + '/_restUserRegistration');
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on registration');
    return cb(null, JSON.parse(self.responseText));
  }
  xhr.send(JSON.stringify(user));
}

function formatUser(user) {
  delete user.country;
  delete user.passwordConfirm;
  user.is_confirmed = false;
  user.role = roles[0].label;
  user.role_rank = roles[0].rank;
  return user;
}

function initCtl($rootScope, $scope, $http, $location, $cookieStore) {
  $rootScope.pageTitle = 'Sign up';
  $rootScope.activeNav = 'signin';
  $scope.countries = countries.list;
  $scope.langs = langs;
  $scope.user = {};
  $scope.user.lang = langs[0].value;

  countries.getCurrentIPCountry(function(err, res) {
    if (err) return $scope.user.country = 'GB';
    $scope.$apply(function() {
      $scope.user.country = res;
    });
  });
  
  $scope.signup = function() {
    signUp($scope.user, function(err, res) {
      if (err) return console.log(err);
      credentials = {
        email: $scope.user.email,
        password: $scope.user.password
      };
      Auth.submitCredentials($http, credentials, function(err, res) {
        if (err) return console.log(err);
        $rootScope.isLoggedIn = true;
        Session.set('authenticated', true);
        $cookieStore.put('userdata', res);
        $rootScope.user = res;
        // Redirect to dashboard
        $location.path('/' + env.getLang() + '/dashboard');
      });
    });
  }
}

module.exports = initCtl;

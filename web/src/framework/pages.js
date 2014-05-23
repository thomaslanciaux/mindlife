var env = require('./env');

function initCtl($scope, sections) {
  $scope.sections = sections.data;
}

function resolvePageSections($q, $http, $route) {
  var routeName = $route.current.params.page;
  // var deferred = $q.defer();
  var promise = $http.get(env.API.REST_URL + '/_restPage/' + routeName);
  promise.success(function(res) { return res; });
  return promise;
}

module.exports = {
  initCtl: initCtl,
  resolve: {
    sections: resolvePageSections
  }
};

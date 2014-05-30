var env = require('./env');
var Gallery = require('./gallery');
var Forms = require('./forms');
var countries = require('./countries');

var authRoute = [ 'life-expectency-calculator', 'private' ];

function initCtl($rootScope, $scope, sections, $location, $route) {
  var path = $location.path().split('/')[2];

  if (!$rootScope.isLoggedIn) {
    var i = authRoute.length;
    while(i--) {
      if (authRoute[i] !== path) continue;
      return $location.path('/');
    }
  }

  if (path === 'search') {
    var searchQuery = $route.current.params.query;
    if (!searchQuery) return $location.path('/');
    $rootScope.activeNav = null;
    $rootScope.pageTitle = 'Search results for "' + searchQuery + '"';
    $scope.pageType = 'search';
    $scope.searchQuery = searchQuery;
  }

  var sections = sections.data;
  $scope.sections = sections;

  for (var i = 0; i < sections.length; i++) {
    var section = $scope.sections[i];
    
    if (section.type === 'DescriptionGallery' || section.type === 'Gallery') {
      var id = section.description_gallery_id || section.gallery_id;
      Gallery(id, i, function(err, i, res) {
        if (err) return alert(err);
        $scope.$apply(function() { $scope.sections[i].gallery = res; });
      });
    }

    if (section.type === 'Questionnaire' || section.type === 'Form') {
      $scope.current = 1;
      $scope.countries = countries.list;
      var id = section.form_template_id;
      Forms.getFields(id, i, function(err, res, i) {
        if (err) return alert(err);
        $scope.$apply(function() {
          $scope.sections[i].fields = Forms.cleanOptions(res); 
        });
      });
    }
  }

  $scope.galleryClass = function(isLeft) {
    return (!!isLeft)? 'gallery-left' : '';
  }
}

function resolvePageSections($q, $http, $route) {
  var routeName = $route.current.params.page;
  // If a routeName is undefined, it is a search query
  var url = (routeName)? '/_restPage/' + routeName 
                       : '/_restPublicSearch/' + $route.current.params.query;
  var promise = $http.get(env.API.REST_URL + url);
  promise.success(function(res) { return res; });
  return promise;
}

module.exports = {
  initCtl: initCtl,
  resolve: {
    sections: resolvePageSections
  }
};

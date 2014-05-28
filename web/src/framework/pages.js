var env = require('./env');
var Gallery = require('./gallery');
var Forms = require('./forms');
var countries = require('./countries');

var authRoute = [ 'life-expectency-calculator', 'private' ];

function initCtl($rootScope, $scope, sections, $route, $location) {

  if (!$rootScope.isLoggedIn) {
    var i = authRoute.length;
    while(i--) {
      if (authRoute[i] !== $route.current.params.page) continue;
      return $location.path('/');
    }
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

    if (section.type === 'Audio') {
      // Do something
    }
  }

  $scope.galleryClass = function(isLeft) {
    return (!!isLeft)? 'gallery-left' : '';
  }
}

function resolvePageSections($q, $http, $route) {
  var routeName = $route.current.params.page;
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

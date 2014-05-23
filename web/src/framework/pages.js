var env = require('./env');
var Gallery = require('./gallery');

function initCtl($scope, sections) {
  var sections = sections.data;
  $scope.sections = sections;

  for (var i = 0; i < sections.length; i++) {
    var section = $scope.sections[i];
    if (section.type === 'DescriptionGallery') {
      var id = section.description_gallery_id || section.gallery_id;
      Gallery(id, function(err, res ) {
        $scope.$apply(function() {
          section.gallery = res;
        });
        $scope.galleryClass = function(isLeft) {
          return (!!isLeft)? 'gallery-left' : '';
        }
      });
      break;
    }
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

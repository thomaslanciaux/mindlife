var env = require('./env');
var Gallery = require('./gallery');
var Forms = require('./forms');
var countries = require('./countries');
var _ = require('lodash');

var authRoute = [ 'life-expectency-calculator', 'private' ];

function initCtl($rootScope, $scope, sections, $location, $route) {
  var path = $location.path().split('/')[2];
  
  // Check if the user is logged in and redirect if on a private route
  if (!$rootScope.isLoggedIn) {
    var i = authRoute.length;
    while(i--) {
      if (authRoute[i] !== path) continue;
      return $location.path('/');
    }
  }

  // sections.data is the data return by the resolve promise of the route
  var sections = sections.data;
  var sectionTypes = [];
  $scope.sections = sections;

  // Launch API calls for components that requires async data
  for (var i = 0; i < sections.length; i++) {
    var section = $scope.sections[i];
    
    // Create sections type array
    if (path === 'search') {
      var sectionType = _.find(sectionTypes, {name: section.type});
      if (!sectionType) {
        sectionTypes.push({ name: section.type, count: 1 });
      } else {
        sectionType.count++;
      }
    }

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
          var j = $scope.sections[i].fields.length;
          while(j--) {
            var field = $scope.sections[i].fields[j];
            if (field.type === 'Checkboxes') { field.submit_input = []; }
          }
        });
      });
    }

    $scope.submitForm = function(formID, fields) {
      var submittedFields = Forms.formatSubmittedFields(fields, $rootScope.user);
      console.log(submittedFields)
    }
  }
  
  // Gallery class gesture
  $scope.galleryClass = function(isLeft) {
    return (!!isLeft)? 'gallery-left' : '';
  }

  // Search results case
  if (path === 'search') {
    var searchQuery = $route.current.params.query;
    if (!searchQuery) return $location.path('/');
    $rootScope.activeNav = null;
    $rootScope.pageTitle = 'Search results for "' + searchQuery + '"';
    $rootScope.searchString = searchQuery;
    $scope.pageType = 'search';
    $scope.searchQuery = searchQuery;
    $scope.sectionTypes = sectionTypes;
    if ( $location.search().filter ) {
      $scope.filter = { type: $location.search().filter };
    } else {
      $scope.filter = '';
    }
    $scope.filterSearch = function(type) { $scope.filter = { type: type }; }
    $scope.filterReset = function() { $scope.filter = ''; }
    $scope.filterClass = function(type) {
      return (type === $scope.filter.type)? 'active' : '';
    }
  }
}

function resolvePageSections($q, $http, $route) {
  var page = $route.current.params.page;
  var url = '';
  if (page) {
    url = '/_restPage/' + page;
  } else { // If page is undefined, it is a search query
    // Add | character if there are more than 1 keyword on the query
    var query = encodeURI($route.current.params.query.replace(/ +/g, '|'));
    url = '/_restPublicSearch/' + query;
  }
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

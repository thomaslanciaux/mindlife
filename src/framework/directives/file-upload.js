var Files = require('../services/files');
var qwery = require('qwery');

function hasFileAPI() {
  return (!!window.File && !!window.FileReader && 
          !!window.FileList && !!window.Blob);
}


module.exports = function($timeout) {
  return {
    restrict: 'C',
    scope: true,
    link: function(scope, el, attrs) {
      var fileAPI = hasFileAPI();
      scope.file = null;
      scope.fileAPI = fileAPI;
      scope.status = null;

      if (!fileAPI) return;

      function fileSelect(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        if (!file.type.match(attrs.restrict)) {
          return alert('The format is not correct ' + 
                       '(required: ' + attrs.restrict + ')')
        }
        reader.onload = function(ev) {
          scope.$apply(function() {
            scope.preview = {
              img: ev.target.result,
              name: file.name,
              size: file.size,
              file: file
            };
            scope.status = null;
          });
        }
        reader.readAsDataURL(file);
        scope.file = file;
      }

      scope.uploadFile = function() {
        scope.status = 'loading';
        $timeout(function() {
          Files.uploadFile(scope.file, function(err, res) {
            if (err) return alert(err);
            scope.$apply(function() {
              scope.status = 'loaded';
            });
          });
        }, 100);
      }

      var input = qwery('input[type=file]', el[0])[0];
      input.addEventListener('change', fileSelect, false);
      scope.hasFile = false;
    }
  }
}

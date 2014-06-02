var qwery = require('qwery');

function hasFileAPI() {
  return (!!window.File && !!window.FileReader && 
          !!window.FileList && !!window.Blob);
}


module.exports = function() {
  return {
    restrict: 'C',
    scope: true,
    link: function(scope, el, attrs) {
      var fileAPI = hasFileAPI();
      scope.fileAPI = fileAPI;
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
            }
          });
        }
        reader.readAsDataURL(file);
      }

      var input = qwery('input[type=file]', el[0])[0];
      input.addEventListener('change', fileSelect, false);

      scope.hasFile = false;
    }
  }
}

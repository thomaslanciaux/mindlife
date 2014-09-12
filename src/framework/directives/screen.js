module.exports = function() {
  return {
    restrict: 'C',
    link: function(scope, $elt, attrs) {
      var id = $elt[0].id;
      var ctls = document.querySelectorAll('[data-screen='+id+']');
      $elt.addClass('screen-hidden');
      
      for (var i = 0; i < ctls.length; i++) {
        var ctl = ctls[i];
        ctl.onclick = function() { $elt.toggleClass('screen-hidden') };
      }
    }
  }
}

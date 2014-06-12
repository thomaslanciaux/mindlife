module.exports = function() {
  return {
    restrict: 'C',
    scope: true,
    link: function(scope, el, attrs) {
      el.ready(function() {
        var initTxt = el[0].innerHTML;
        var rel = document.getElementById(attrs.rel);
        var $rel = angular.element(rel);
        $rel.addClass('collapsed');
        el[0].onclick = function() {
          if ($rel.hasClass('collapsed')) {
            el[0].innerHTML = 'Close';
            return $rel.removeClass('collapsed');
          }
          el[0].innerHTML = initTxt;
          $rel.addClass('collapsed');
        };
      });
    }
  }
}

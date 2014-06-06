module.exports = function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      el.addClass('img-loading');
      var img = new Image();
      img.src = attrs.lazySrc;
      img.onload = function() {
        el[0].src = img.src;
        el.removeClass('img-loading');
      }
    }
  }
}

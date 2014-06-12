function drawImg(el, src) {
  el.addClass('img-loading');
  var img = new Image();
  img.src = src;
  img.onload = function() {
    el[0].src = img.src;
    el.removeClass('img-loading');
  }
}

module.exports = function($rootScope) {
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, el, attrs) {
      var loaded = false;
      if (el[0].offsetTop < document.body.scrollTop + window.innerHeight) {
        drawImg(el, attrs.lazySrc);
        return loaded = true;
      }
      var listener = function() {
        var pos = document.body.scrollTop + window.innerHeight;
        if (pos + 100 < el[0].offsetTop || loaded) return;
        drawImg(el, attrs.lazySrc);
        loaded = true;
        window.removeEventListener('scroll', listener, false);
      }
      window.addEventListener('scroll', listener, false);
    }
  }
}

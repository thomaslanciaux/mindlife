function drawImg(el, src) {
  el.addClass('img-loading');
  var img = new Image();
  img.src = src;
  img.onload = function() {
    el[0].src = img.src;
    el.removeClass('img-loading');
  }
}

var scrollElt = document.querySelector('#app');

module.exports = function($rootScope) {
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, el, attrs) {
      var loaded = false;
      if (el[0].offsetTop < scrollElt.scrollTop + window.innerHeight) {
        drawImg(el, attrs.lazySrc);
        return loaded = true;
      }
      var listener = function() {
        var pos = scrollElt.scrollTop + window.innerHeight;
        if (pos + 100 < el[0].offsetTop || loaded) return;
        drawImg(el, attrs.lazySrc);
        loaded = true;
        scrollElt.removeEventListener('scroll', listener, false);
      }
      scrollElt.addEventListener('scroll', listener, false);
    }
  }
}

module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      rel: '='
    },
    template: '<div class="route-loader">Loading…</div>',
    link: function(scope, el, attrs) {
      scope.$watch('rel', function(val) {
        if (val) {
          el.addClass('loading');
        } else {
          el.removeClass('loading');
        }
      });
    }
  }
}

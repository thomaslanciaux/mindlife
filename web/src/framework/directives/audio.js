module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { file: '@' },
    template: '<audio controls><source src="{{file}}" type="audio/ogg" />HELLO</audio>'
  }
}

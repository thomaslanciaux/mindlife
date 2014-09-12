var APILoaded = false;
var injecting = false;
var queue = [];
var players = [];
var current = null;

function injectYT() {
  var script = document.createElement('script');
  script.src= '//www.youtube.com/player_api';
  script.async = true;
  var placeholder = document.getElementsByTagName('script')[0];
  placeholder.parentNode.insertBefore(script, placeholder);
  injecting = true;
}

window.onYouTubePlayerAPIReady = function() {
  APILoaded = true;
  var cb = null;
  while(cb = queue.pop()) cb();
}

function onPlayerStateChange(e) {
  if (e.data === -1 || e.data === 5) return;
  for (var i in players) {
    if (i === e.target.a.id) continue;
    players[i].stopVideo();
  }
}

function linkDirective(playerId) {
  players[playerId] = new YT.Player(playerId, {
    events: { 'onStateChange': onPlayerStateChange }
  });
}

module.exports = function() {
  return {
    restrict: 'C',
    scope: true,
    link: function(scope, el, attrs) {
      if (APILoaded) return linkDirective(el[0].id);
      queue.push(function() { linkDirective(el[0].id); });
      if (!injecting) injectYT();
    }
  }
}

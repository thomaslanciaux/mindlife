var Snap = require('snapsvg');

var s = Snap('#snap');
var color = 'rgba(255, 255, 255, .5)';
var dots = [ [-10, 300] ];
var ratio = 1010/7;
var drawn = false;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function draw() {
  for (var i = 1; i < 7; i++) {
    var ln = dots.length;
    var last = dots[ln-1];
    var x = getRandom(last[0] + 30, i*ratio);
    var y = getRandom(200, 500);
    dots.push([x, y]);
  }

  var cAttrs = { fill: '#2980b9', stroke: '#eee', strokeWidth: 3 };
  var path = '';
  var g = s.g();
  for (var i = 0; i < dots.length; i++) {
    var circle = s.circle(dots[i][0], dots[i][1], 1).attr(cAttrs);
    circle.animate({r: 8}, 1500, mina.bounce);
    g.add(circle);
    var coords = dots[i][0] + ' ' + dots[i][1];
    var dir = (i === 0)? 'M ' : ' L '
    path += dir + coords;
  }

  var p = s.path(path + 'L 1010 150').attr({
    fill: 'none',
    stroke: color,
    strokeWidth: 3
  }).prependTo(s);

  var len = p.getTotalLength();

  p.attr({
    "stroke-dasharray": len + ' ' + len,
    "stroke-dashoffset": len
  });

  p.animate({'stroke-dashoffset': 10}, 1000, mina.easeinout);
  drawn = true;
};

var svg = document.querySelector('#snap');

window.onscroll = function() {
  var pos = svg.parentElement.offsetTop;
  var scrollPos = document.body.scrollTop;
  var ratio = window.innerHeight/4;
  if (scrollPos < pos - ratio || drawn) return;
  draw();
}

module.exports = function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 2;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var number = Math.floor(Math.log(bytes) / Math.log(1024));
    var res = (bytes / Math.pow(1024, Math.floor(number)));
    return res.toFixed(precision) + ' ' + units[number];
  }
}

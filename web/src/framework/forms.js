var env = require('./env');

function cleanOptions(res) {
  var i = res.length;
  while(i--) {
    var opts = [];
    var field = res[i];
    for (var key in field) {
      if (key.indexOf('option') > -1 && field[key]) {
        opts.push(field[key]);
      }
    }
    res[i].opts = opts;
  }
  return res;
}

function getFields(id, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', env.API.REST_URL + '/_restTemplateFields/' + id);
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on fetching form fields');
    var res = JSON.parse(self.responseText);
    return cb(null, res);
  }
  xhr.send();
}

module.exports = {
  getFields: getFields,
  cleanOptions: cleanOptions
};

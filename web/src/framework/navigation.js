var env = require('./env');

function formatNav(raw) {
  var nav = [];
  for (var i = 0; i < raw.length; i++) {
    nav.push({
      label: raw[i].name,
      path: '/' + env.getLang() + '/' + raw[i].target,
      is_button: raw[i].is_button,
      icon_class: raw[i].icon_class,
      file_dir: raw[i].file_dir
    });
  }
  return nav;
}

function getNav(cb) {
  var lang = env.getLang();
  var url = env.API.REST_URL + '/_restPublicNav/' + lang;
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error while fetching nav');
    return cb(null, formatNav(JSON.parse(self.responseText)));
  }
  xhr.open('GET', url, false);
  xhr.send();
}

module.exports = {
  getNav: getNav
};

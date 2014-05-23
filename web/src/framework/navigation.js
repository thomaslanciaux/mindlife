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

function getNav($http, cb) {
  var lang = env.getLang();
  var url = env.API.REST_URL + '/_restPublicNav/' + lang;
  var q = $http.get(url);
  q.then(function(res) {
    return cb(null, formatNav(res.data));
  });
}

module.exports = {
  getNav: getNav
};

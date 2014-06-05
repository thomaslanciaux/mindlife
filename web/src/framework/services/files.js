var env = require('../env');

function uploadFile(file, cb) {
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  fd.append('file', file);
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on file upload');
    var filedir = self.getResponseHeader('directory');
    createFileEntry(file, filedir, cb);
  }
  xhr.open('POST', env.API.REST_URL + '/_restAuth/upload', false);
  xhr.send(fd);
}

function createFileEntry(file, filedir, cb) {
  var xhr = new XMLHttpRequest();
  var data = {
    file_dir: filedir + '/' + file.name,
    file_gallery_id: null,
    file_model: null,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type
  };
  xhr.open('POST', env.API.REST_URL + '/_restFiles')
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on creating file entry');
    cb(null, JSON.parse(self.responseText));
  }
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(data));
}

module.exports = {
  uploadFile: uploadFile
};

var env = require('./env');
var randomstring = require('randomstring');
var Score = require('./score');

function cleanOptions(res) {
  var i = res.length;
  while(i--) {
    var opts = [];
    var field = res[i];
    for (var key in field) {
      if (key.indexOf('option') > -1 && field[key]) opts.push(field[key]);
    }
    res[i].opts = opts;
  }
  return res;
}

function getFields(id, i, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', env.API.REST_URL + '/_restTemplateFields/' + id);
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on fetching form fields');
    var res = JSON.parse(self.responseText);
    return cb(null, res, i);
  }
  xhr.send();
}

function formatAnswer(field) {
  var type = field.type;
  var answer = '';
  if (type === 'Radio' || type === 'Select') {
    return answer = field.opts[parseInt(field.submit_input)];
  }
  if (type === 'Checkboxes') {
    var answers = [];
    for (var i in field.submit_input) {
      if (!!field.submit_input[i]) answers.push(field.opts[i]);
    }
    return answer = answers.join(', ');
  }
  return answer = field.submit_input;
}


function formatSubmittedFields(fields, user) {
  var randomString = randomstring.generate(255);
  var submittedFields = [];
  for (var i in fields) {
    var field = fields[i];
    var submittedField = {
      template_random_string: randomString,
      template_id: field.template_id,
      template_name: field.template_name,
      template_description: field.template_description,
      field_id: field.field_id,
      field_label: field.field_label,
      field_description: field.field_description,   
      field_value: formatAnswer(field) || null,
      field_type: field.type,
      required: field.required,
      lang: field.lang,
      position: parseInt(i),
      searchable: field.searchable,
      user_id: (user)? user.id : null,
      printable_name: (user)? user.printable_name : 'Anonynous user',
      username: (user)? user.username : 'anonymous'
    };
    // Create score fields in object
    var scored = Score.scoreField(field, submittedField);
    submittedFields.push(scored);
  }
  return submittedFields;
}

function postField(field, index, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var self = this;
    if (self.status !== 200) return cb('Error on posting field');
    return cb(null, JSON.parse(self.responseText), parseInt(index));
  }

  xhr.open('POST', env.API.REST_URL + '/_restFormFields');
  xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
  xhr.send(JSON.stringify(field));
}

module.exports = {
  getFields: getFields,
  postField: postField,
  cleanOptions: cleanOptions,
  formatSubmittedFields: formatSubmittedFields
};

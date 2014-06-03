var env = require('./env');

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

function randomString() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 255;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
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

function scoreField(field, submittedField) {
  for (var i = 0; i < 16; i++) {
    var prop = 'dim' + (i+1) + '_field_score';
    submittedField[prop] = null;
  }
  return submittedField;
}

function formatSubmittedFields(fields, user) {
  var randomstring = randomString();
  var submittedFields = [];
  for (var i in fields) {
    var field = fields[i];
    // if (!field.submit_input || !field.submit_input.length) continue;
    var submittedField = {
      template_random_string: randomstring,
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
      user_id: user.id,
      printable_name: user.printable_name || 'Anonynous user',
      username: user.username || 'anonymous'
    };
    // Create score fields in object
    var scored = scoreField(field, submittedField);
    submittedFields.push(scored);
  }
  return submittedFields;
}

module.exports = {
  getFields: getFields,
  cleanOptions: cleanOptions,
  formatSubmittedFields: formatSubmittedFields
};

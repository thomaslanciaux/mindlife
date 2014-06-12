function createFinalScoreTags(fieldSample) {
  var tags = [];
  for (var key in fieldSample) {
    if (key.indexOf('tag_name') === -1 || !fieldSample[key]) continue;
    tags.push(fieldSample[key]);
  }
  return tags;
}

function addScore(score, tags, res) {
  for (var i = 0; i < tags.length; i++) {
    var itemScore = res['dim' + (i+1) + '_field_score'];
    var total = (!!score[i])? score[i].total : 0;
    score[i] = {
      label: tags[i],
      total: total+itemScore
    }
  }
  return score;
}

function scoreField(field, submittedField) {
  var rawSubmit = field.submit_input || null;
  var scoreCase = (rawSubmit && typeof rawSubmit === 'object')
                  ? 'multiple' : 'single';

  if (scoreCase === 'multiple') {
    var totalCoef = 0;
    for (var i in rawSubmit) {
      var coef = field['combo_' + (i+1) + '_coef'];
      if (coef) totalCoef = totalCoef+coef;
    }
  }

  for (var i = 0; i < 16; i++) {
    var prop = 'dim' + (i+1) + '_field_score';
    var dim = field['dimension_' + (i+1) + '_coef'];
    var score = null;
    if (scoreCase === 'single' && rawSubmit) {
      var coef = field['combo_' + (parseInt(rawSubmit)+1) + '_coef'];
      score = coef*dim;
      if (score === -0) score = 0;
    }
    if (scoreCase === 'multiple' && rawSubmit.length) score = totalCoef*dim; 
    submittedField[prop] = score;
  }
  return submittedField;
}

module.exports = {
  scoreField: scoreField,
  addScore: addScore,
  createFinalScoreTags: createFinalScoreTags
};

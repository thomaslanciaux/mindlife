module.exports = function() {
  return function(type) {
    var humanType = type;
    switch(type) {
      case 'DescriptionOnly'   : humanType = 'Articles'; break;
      case 'DescriptionGallery': humanType = 'Gallery articles'; break;
      case 'Questionnaire'     : humanType = 'Questionnaires'; break;
      case 'Form'              : humanType = 'Forms'; break;
      case 'GoogleMaps'        : humanType = 'Forms'; break;
    }
    return humanType;
  }
}

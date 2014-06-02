module.exports = function() {
  return function(type) {
    var humanType = type;
    switch(type) {
      case 'DescriptionOnly'   : humanType = 'Articles'; break;
      case 'YoutubeVideo'      : humanType = 'Youtube videos'; break;
      case 'Audio'             : humanType = 'Audio files'; break;
      case 'DescriptionGallery': humanType = 'Gallery articles'; break;
      case 'Questionnaire'     : humanType = 'Questionnaires'; break;
      case 'Form'              : humanType = 'Forms'; break;
      case 'GoogleMaps'        : humanType = 'Maps'; break;
      case 'Gallery'           : humanType = 'Galleries'; break;
      case 'Files'             : humanType = 'Files'; break;
    }
    return humanType;
  }
}

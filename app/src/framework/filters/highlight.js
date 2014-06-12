module.exports = function () {
  /**
   * @param text {string} haystack to search through
   * @param search {string} needle to search for
   * @param [caseSensitive] {boolean} optional boolean to use case-sensitive
   * searching
   */
  return function (text, search, caseSensitive) {
    if (search || angular.isNumber(search)) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join('<mark class="search-match">' + search + '</mark>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<mark class="search-match">$&</mark>');
      }
    } else {
      return text;
    }
  }
}

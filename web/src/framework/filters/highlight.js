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
        return text.split(search).join('<span class="search-match">' + search + '</span>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<span class="search-match">$&</span>');
      }
    } else {
      return text;
    }
  }
}

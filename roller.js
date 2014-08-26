// ==UserScript==
// @name       imgur roller
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Full screen imgur rolling
// @match      http://imgur.com/r/*/
// @copyright  2014+, kopzu
// @require
// ==/UserScript==


showImagesFromPage(0)

function showImagesFromPage(pageNumber) {
  $.get('page/' + pageNumber + '/hit.json', function (response) {
    var data = response.data

    if (data.length > 0) {
      var hashes = _.each(response.data, function (img) {
        return img.hash
        //render with timeout
        // load image smoothly

      })
      // call showImagesFromPage pageNumber+1
    } else if (pageNumber > 0) {
      showImagesFromPage(0)
    } else {
      // no content, load funny pic from imgur
    }
  })
}

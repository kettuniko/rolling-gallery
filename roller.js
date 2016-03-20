// ==UserScript==
// @name       imgur roller
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Full screen imgur rolling
// @match      http://imgur.com/r/*/
// @copyright  2014+, kettuniko
// @require
// ==/UserScript==

$(() => {
  var imageElement = $('<img />').css({
    'width': '100%',
    'height': '100%'
  })
  $('body').empty().append(imageElement).css('overflow', 'hidden')

  showImagesFromPage(0)

  function showImagesFromPage(pageNumber) {
    $.get('page/' + pageNumber + '/hit.json', response => {
      if (response.data.length > 0) {
        var imageUrls = _.map(response.data, imageData => {
          return '//i.imgur.com/' + imageData.hash + imageData.ext
        })

        var i = 0
        var intervalId = setInterval(() => {
          if (imageUrls[i]) {
            imageElement.attr('src', imageUrls[i++])
          } else {
            clearInterval(intervalId)
            showImagesFromPage(pageNumber + 1)
          }
        }, 5000);
      } else {
        showImagesFromPage(0)
      }
    })
  }
})
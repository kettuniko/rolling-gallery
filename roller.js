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
  const imageElement = $('<img />').css({
    'width': '100%',
    'height': '100%'
  })
  $('body').empty().append(imageElement).css('overflow', 'hidden')

  const toImageUrl = imageData => '//i.imgur.com/' + imageData.hash + imageData.ext
  const isNotEditRequest = imageData => !imageData.title.toLowerCase().includes('request')

  showImagesFromPage(0)

  function showImagesFromPage (pageNumber) {
    fetch(window.location.href + '/page/' + pageNumber + '/hit.json')
      .then(response => response.json())
      .then(responseBody => responseBody.data)
      .then(doSlideShow)

    function doSlideShow (images) {
      if (images.length > 0) {
        const imageUrls = images
          .filter(isNotEditRequest)
          .map(toImageUrl)

        let i = 0
        const intervalId = setInterval(() => {
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
    }
  }
})
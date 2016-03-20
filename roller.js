// ==UserScript==
// @name       imgur roller
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Full screen imgur rolling
// @match      http://imgur.com/r/*/
// @copyright  2014+, kettuniko
// @require
// ==/UserScript==

const imageElement = document.createElement('img')

document.body.innerHTML = ''
document.body.appendChild(imageElement)
document.body.style.overflow = 'hidden'

const toImageUrl = imageData => '//i.imgur.com/' + imageData.hash + imageData.ext
const isNotEditRequest = imageData => !imageData.title.toLowerCase().includes('request')

showImagesFromPage(0)

function showImagesFromPage (pageNumber) {
  fetch(window.location.href + '/page/' + pageNumber + '/hit.json')
    .then(response => response.json())
    .then(responseBody => responseBody.data)
    .then(images => {
      if (images) doSlideShow(images)
      else showImagesFromPage(0)
    })
}

function doSlideShow (images) {
  const imageUrls = images
    .filter(isNotEditRequest)
    .map(toImageUrl)

  let i = 0
  const intervalId = setInterval(() => {
    if (imageUrls[i]) {
      imageElement.style.height = `${window.innerHeight}px`
      imageElement.style.width = `${window.innerWidth}px`
      imageElement.src = imageUrls[i++]
    } else {
      clearInterval(intervalId)
      showImagesFromPage(pageNumber + 1)
    }
  }, 5000);
}
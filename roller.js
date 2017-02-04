const initBody = element => {
  document.body.innerHTML = ''
  document.body.appendChild(element)
}

function toDomNode(html) {
  const el = document.createElement('template');
  el.innerHTML = html;
  return document.importNode(el.content, true);
}

const createTextElement = text =>
  toDomNode(`<h1 style="font-size: 100pt; text-align: center; line-height: normal">${text}</h1>`)

const createImageElement = src =>
  toDomNode(`<img style="height: ${window.innerHeight}; width: 100%" src="${src}"/>`)

const showImagesFromPage = pageNumber => {
  window.fetch(`${window.location.href}/page/${pageNumber}/hit.json`)
    .then(response => response.json())
    .then(responseBody => responseBody.data)
    .then(images => {
      if (images) doSlideShow(images, pageNumber)
      else if (pageNumber !== 0) showImagesFromPage(0)
      else createTextElement('Nothing to show :(')
    })
    .catch(e => {
      console.log(e)
      createTextElement('Error!')
    })
}

const doSlideShow = (images, pageNumber) =>
  images
    .filter(isNotEditRequest)
    .map(toImageUrl)
    .reduce(toSlideShow, Promise.resolve())
    .then(() => showImagesFromPage(pageNumber + 1))

const isNotEditRequest = imageData => !imageData.title.toLowerCase().includes('request')
const toImageUrl = imageData => `//i.imgur.com/${imageData.hash}${imageData.ext}`
const cleanUpImage = () => window.URL.revokeObjectURL(document.querySelector('img').src)

const toSlideShow = (sequence, imageUrl) =>
  sequence
    .then(() => window.fetch(imageUrl))
    .then(response => response.blob())
    .then(window.URL.createObjectURL)
    .then(createImageElement)
    .then(initBody)
    .then(cleanUpImage)
    .then(pause)
    .catch(e => {
      console.log(e)
      return Promise.resolve()
    })

const pause = () => new Promise(resolve => setTimeout(resolve, 3000))

initBody(createTextElement('Loading'))
showImagesFromPage(0)

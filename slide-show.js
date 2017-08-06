import getInfo from 'gif-info'
import fetchGallery from './fetch-gallery'
import toDomNode from './to-dom-node'

const cleanUpContent = contentToSaveId => () =>
  Array.from(document.querySelectorAll('.content'))
    .filter(content => content.id !== contentToSaveId)
    .forEach(content => content.remove())

const initContent = duration => html => {
  const id = `content-${new Date().getTime()}`
  const newContent = toDomNode(`
    <div class="content content-animated" id="${id}">
      <div class="progressbar" style="animation-duration: ${duration / 1000}s"></div>
      ${html}
    </div>
  `)
  document.body.appendChild(newContent)
  document.querySelector(`#${id}`).addEventListener('animationend', cleanUpContent(id))
}

const createTextTag = text => `<h1>${text}</h1>`
const createImageTag = src => `<img class="rolling-image" src="${src}"/>`
const showText = text => initContent(Infinity)(createTextTag(text))

const showImagesFromPage = gallery => pageNumber => () =>
  fetchGallery(gallery, pageNumber)
    .then(images => {
      const galleryPage = showImagesFromPage(gallery)
      if (images.length) doSlideShow(images, galleryPage(pageNumber + 1))
      else if (pageNumber !== 0) galleryPage(0)()
      else showText('Nothing to show :(')
    })
    .catch(e => {
      console.log(e)
      showText('Error!')
    })

const pause = duration => () => new Promise(resolve => setTimeout(resolve, duration))
const doSlideShow = (images, nextPage) =>
  images
    .map(toImageUrl)
    .reduce(toSlideShow, Promise.resolve(() => pause(0)))
    .then(waitForLast => waitForLast())
    .then(nextPage)

const toImageUrl = imageData => imageData.link.replace('http://', 'https://')
const cleanUpImage = imageUrl => () => window.URL.revokeObjectURL(imageUrl)

const readInfo = blob => new Promise((resolve) => {
  const fileReader = new FileReader()
  fileReader.onload = () => resolve(getInfo(fileReader.result))
  fileReader.readAsArrayBuffer(blob);
})

// const stillImageDuration = getParameter(location.search)('stillSeconds').fold(() => 5000, t => t * 1000)
const stillImageDuration = 1000 //TODO
const animationDuration = ({ isBrowserDuration, durationChrome, duration }) => isBrowserDuration ? durationChrome : duration
const toDuration = imageInfo => imageInfo.animated ? animationDuration(imageInfo) : stillImageDuration
const fetchBlob = url => window.fetch(url).then(response => response.blob())
const getDuration = objectUrl => fetchBlob(objectUrl).then(readInfo).then(toDuration)
const createObjectUrl = blob => Promise.resolve(window.URL.createObjectURL(blob))

const toSlideShow = (chain, imageUrl) =>
  chain
    .then(() => Promise.all([fetchBlob(imageUrl), chain.then(waitForPrevious => waitForPrevious())]))
    .then(([blob]) => createObjectUrl(blob)
      .then(objectUrl => getDuration(objectUrl)
        .then(duration => Promise.resolve(initContent(duration))
          .then(contentWith => contentWith(createImageTag(objectUrl)))
          .then(cleanUpImage(objectUrl))
          .then(() => pause(duration)))))
    .catch(e => {
      console.log(e)
      return Promise.resolve()
    })

export default gallery => showImagesFromPage(gallery)(0)()

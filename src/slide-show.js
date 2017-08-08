import { get } from 'axios'
import { parse } from 'query-string'
import { compose, multiply, prop, propOr } from 'ramda'
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

const toMilliseconds = multiply(1000)
const stillImageDuration = compose(toMilliseconds, propOr(5, 'stillSeconds'), parse)
const animationDuration = ({ isBrowserDuration, durationChrome, duration }) => isBrowserDuration ? durationChrome : duration
const toDuration = imageInfo => imageInfo.animated ? animationDuration(imageInfo) : stillImageDuration(window.location.search)
const fetchBlob = url => get(url, { responseType: 'blob' }).then(prop('data'))
const fetchArrayBuffer = url => get(url, { responseType: 'arraybuffer' }).then(prop('data'))
const getDuration = objectUrl => fetchArrayBuffer(objectUrl).then(getInfo).then(toDuration)
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

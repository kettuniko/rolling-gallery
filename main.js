import getInfo from 'gif-info'
import getParameter from './get-parameter'

window.onerror = errorMsg => document.body.innerHTML = errorMsg

const isDisplayAble = ({link}) => link.includes('i.imgur.com')

const fetchGallery = (gallery, pageNumber = 0) =>
  window.fetch(`https://api.imgur.com/3/gallery/r/${gallery}/time/${pageNumber}`, {
    headers: {
      'Authorization': 'Client-ID 1400c78269df7bc'
    }
  }).then(response => response.json())
    .then(responseBody => responseBody.data)
    .then(images => images.filter(isDisplayAble))

const toDomNode = html => {
  const el = document.createElement('template')
  el.innerHTML = html
  return el.content.cloneNode(true)
}

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

const stillImageDuration = getParameter(location.search)('stillSeconds').fold(() => 5000, t => t * 1000)
const animationDuration = ({isBrowserDuration, durationChrome, duration}) => isBrowserDuration ? durationChrome : duration
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

const startRolling = gallery => showImagesFromPage(gallery)(0)()

const galleries = ['brokengifs', 'wastedgifs', 'earthporn', 'reactiongifs', 'gifs', 'wallpapers', 'woahdude', 'perfecttiming', 'foodporn', 'unexpected']

const landingPage = () => galleries
  .map((g) => fetchGallery(g))
  .reduce((sequence, current) => sequence
    .then(() => current
      .then(([{id, section}]) => toDomNode(`
              <a class="gallery-head" href="?r=${section}">
                <img src="${`https://i.imgur.com/${id}b.jpg`}" />
                <span class="gallery-head__name">${section}</span>
              </a>`))
      .then(img => document.querySelector('.galleries').appendChild(img))), Promise.resolve())
  .then(() => {
    document.querySelector('.loading').remove()
  })

getParameter(location.search)('r')
  .fold(landingPage, startRolling)


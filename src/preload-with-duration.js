import { compose, composeP, forEach, multiply, propOr } from 'ramda'
import { parse as parseQueryString } from 'query-string'

const stillImageDuration = compose(propOr(5, 'stillSeconds'), parseQueryString)(window.location.search)

const getDurationInSeconds = ({ mp4, link }) =>
  new Promise(resolve => {
    const element = document.createElement(mp4 ? 'video' : 'img')
    element.setAttribute('src', mp4 || link)
    forEach(attr => element.setAttribute(attr, attr), ['muted', 'autoplay'])
    forEach(event => element.addEventListener(event, () =>
      resolve(element.duration || stillImageDuration)), ['load', 'canplaythrough'])
  })

export const preloadWithDuration = composeP(
  multiply(1000),
  getDurationInSeconds
)

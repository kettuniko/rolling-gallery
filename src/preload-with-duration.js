import { parse as parseQueryString } from 'query-string'
import { compose, composeWith, forEach, multiply, propOr, then } from 'ramda'

const stillImageDuration = compose(propOr(5, 'stillSeconds'), parseQueryString)(window.location.search)

const getDurationInSeconds = ({ mp4, link }) =>
  new Promise((resolve, reject) => {
    const element = document.createElement(mp4 ? 'video' : 'img')
    element.setAttribute('src', mp4 || link)
    forEach(attr => element.setAttribute(attr, attr), ['muted', 'autoplay'])
    forEach(event => element.addEventListener(event, () =>
      resolve(element.duration || stillImageDuration)), ['load', 'canplaythrough'])
    element.addEventListener('error', reject)
  })

export const preloadWithDuration = composeWith(then, [
    multiply(1000),
    getDurationInSeconds
  ]
)

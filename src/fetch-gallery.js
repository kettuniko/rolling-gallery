import { assoc, compose, composeWith, includes, curry, F, filter, map, path, prop, T, then } from 'ramda'
import { fetchHead, fetchJson } from './fetch'

const isDisplayable = image => fetchHead(image.link)
  .then(T)
  .catch(F)
  .then(isDisplayAble => assoc('isDisplayAble', isDisplayAble, image))

const isImage = compose(includes('i.imgur.com'), prop('link'))

const getGallery = (pageNumber, gallery) =>
  fetchJson(`https://api.imgur.com/3/gallery/r/${gallery}/time/${pageNumber}`)

export const fetchGallery = curry(
  composeWith(then,
    [filter(prop('isDisplayAble')),
    images => Promise.all(images),
    map(isDisplayable),
    filter(isImage),
    path(['data']),
    getGallery]
  ))

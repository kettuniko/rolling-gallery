import { compose, composeP, contains, curry, filter, path, prop } from 'ramda'
import { fetchJson } from './fetch'

const isDisplayAble = compose(contains('i.imgur.com'), prop('link'))

const getGallery = (pageNumber, gallery) =>
  fetchJson(`https://api.imgur.com/3/gallery/r/${gallery}/time/${pageNumber}`, {
    headers: {
      Authorization: 'Client-ID 1400c78269df7bc'
    }
  })

export const fetchGallery = curry(
  composeP(
    filter(isDisplayAble),
    path(['data']),
    getGallery
  ))

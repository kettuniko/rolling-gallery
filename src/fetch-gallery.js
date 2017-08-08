import { compose, contains, filter, path, prop } from 'ramda'
import { get } from 'axios'

const isDisplayAble = compose(contains('i.imgur.com'), prop('link'))

export default (gallery, pageNumber = 0) =>
  get(`https://api.imgur.com/3/gallery/r/${gallery}/time/${pageNumber}`, {
    headers: {
      Authorization: 'Client-ID 1400c78269df7bc'
    }
  }).then(path(['data', 'data']))
    .then(filter(isDisplayAble))

import queryString from 'query-string'
import * as R from 'ramda'
import frontPage from './front-page'
import slideShow from './slide-show'

window.onerror = errorMsg => document.body.innerHTML = errorMsg

const init = R.compose(
  R.ifElse(R.isNil, frontPage, slideShow),
  R.prop('r'),
  queryString.parse
)

init(window.location.search)

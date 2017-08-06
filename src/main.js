import { parse } from 'query-string'
import { compose, ifElse, isNil, prop } from 'ramda'
import frontPage from './front-page'
import slideShow from './slide-show'

window.onerror = errorMsg => document.body.innerHTML = errorMsg

const init = compose(
  ifElse(isNil, frontPage, slideShow),
  prop('r'),
  parse
)

init(window.location.search)

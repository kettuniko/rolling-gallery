import { parse as parseQueryString } from 'query-string'
import { compose, flip, ifElse, isNil, prop } from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import FrontPage from './front-page/FrontPage.jsx'
import SlideShow from './slide-show/SlideShow.jsx'

window.onerror = errorMsg => document.body.innerHTML = errorMsg

const render = flip(ReactDOM.render)

const init = compose(
  render(document.querySelector('.root')),
  ifElse(isNil, () => <FrontPage/>, gallery => <SlideShow gallery={gallery}/>),
  prop('r'),
  parseQueryString
)

init(window.location.search)

import { parse as parseQueryString } from 'query-string'
import { compose, flip, ifElse, isNil, nAry, prop } from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import FrontPage from './front-page/FrontPage.jsx'
import SlideShow from './slide-show/SlideShow.jsx'

const render = flip(nAry(2, ReactDOM.render))

const init = compose(
  render(document.querySelector('.root')),
  ifElse(isNil, () => <FrontPage/>, gallery => <SlideShow gallery={gallery}/>),
  prop('r'),
  parseQueryString
)

init(window.location.search)

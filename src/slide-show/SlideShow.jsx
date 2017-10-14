import './SlideShow.css'

import { apply, compose, curry, head, last, multiply, objOf, path, propOr, reduce, tap } from 'ramda'
import React, { Component } from 'react'
import { parse as parseQueryString } from 'query-string'
import { fetchBlob } from '../fetch'
import { fetchGallery } from '../fetch-gallery'
import { getDuration } from '../get-duration'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

const { createObjectURL, revokeObjectURL } = window.URL
const revokeOnLoad = compose(revokeObjectURL, path(['target', 'src']))

const pause = ({ waitTime }) => new Promise(resolve => setTimeout(resolve, waitTime))

const startImmediately = Promise.resolve({ waitTime: 0 })

const toMilliseconds = multiply(1000)
const stillImageDuration = compose(toMilliseconds, propOr(5, 'stillSeconds'), parseQueryString)

const doSlideShow = handlers => reduce(toSlideShow(handlers), startImmediately)

const toDuration = (animated, objectUrl) =>
  animated ?
    getDuration(objectUrl) :
    stillImageDuration(window.location.search)

const toSlideShow = ({ onItemDownloaded }) => (chain, { animated, mp4, link }) =>
  chain
    .then(() => animated ? mp4 : link)
    .then(url => Promise.all([fetchBlob(url), chain.then(pause)]))
    .then(compose(createObjectURL, head))
    .then(objectUrl => Promise.all([animated, objectUrl, toDuration(animated, objectUrl)]))
    .then(tap(apply(onItemDownloaded)))
    .then(compose(objOf('waitTime'), last))
    .catch(e => {
      console.log(e)
      return Promise.resolve()
    })

const showImagesFromGalleryPage = curry((gallery, handlers, pageNumber) =>
  fetchGallery(pageNumber, gallery)
    .then(items => {
      const showImagesFromPage = showImagesFromGalleryPage(gallery, handlers)
      if (items.length) {
        doSlideShow(handlers)(items)
          .then(pause)
          .then(() => showImagesFromPage(pageNumber + 1))
      } else if (pageNumber !== 0) {
        showImagesFromPage(0)
      } else {
        handlers.onMessage('Nothing to show :(')
      }
    })
    .catch(e => {
      console.log(e)
      handlers.onMessage('Terrible error!')
    }))

export default class SlideShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      animated: null,
      duration: null,
      fetching: true,
      itemUrl: null,
      message: null
    }
  }

  componentDidMount() {
    showImagesFromGalleryPage(this.props.gallery, {
      onItemDownloaded: (animated, itemUrl, duration) => {
        this.setState({
          animated,
          duration,
          itemUrl,
          fetching: false
        })
      },
      onMessage: message => this.setState({
        message,
        fetching: false
      })
    }, 0)
  }

  render() {
    const { animated, duration, itemUrl, fetching, message } = this.state
    return (
      <div className='slide-show'>
        {duration && <Progressbar key={itemUrl} duration={duration}/>}
        {itemUrl && animated && <video className='slide-show__item' src={itemUrl} onLoad={revokeOnLoad} loop autoPlay/>}
        {itemUrl && !animated && <img className='slide-show__item' src={itemUrl} />}
        {fetching && <div className='slide-show__spinner'><Spinner/></div>}
        {message && <h2 className='slide-show__message'>{message}</h2>}
      </div>
    )
  }
}

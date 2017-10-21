import './SlideShow.css'

import { apply, compose, curry, last, multiply, objOf, propOr, reduce, tap } from 'ramda'
import React, { Component } from 'react'
import { parse as parseQueryString } from 'query-string'
import { fetchGallery } from '../fetch-gallery'
import { getDuration } from '../get-duration'
import GalleryItem from '../gallery-item/GalleryItem.jsx'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

const pause = ({ waitTime }) => new Promise(resolve => setTimeout(resolve, waitTime))

const startImmediately = Promise.resolve({ waitTime: 0 })

const toMilliseconds = multiply(1000)
const stillImageDuration = compose(toMilliseconds, propOr(5, 'stillSeconds'), parseQueryString)

const doSlideShow = handlers => reduce(toSlideShow(handlers), startImmediately)

const toDuration = ({ mp4 }) =>
  mp4 ?
    getDuration(mp4) :
    stillImageDuration(window.location.search)

const toSlideShow = ({ onItemDownloaded }) => (chain, item) =>
  chain
    .then(pause)
    .then(url => Promise.all([item, toDuration(item)]))
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
      item: null,
      duration: null,
      fetching: true,
      message: null
    }
  }

  componentDidMount() {
    showImagesFromGalleryPage(this.props.gallery, {
      onItemDownloaded: (item, duration) => {
        this.setState({
          item,
          duration,
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
    const { item, duration, fetching, message } = this.state
    return (
      <div className='slide-show'>
        {duration && <Progressbar key={item.id} duration={duration}/>}
        {item && <GalleryItem autoPlay item={item} />}
        {fetching && <div className='slide-show__spinner'><Spinner/></div>}
        {message && <h2 className='slide-show__message'>{message}</h2>}
      </div>
    )
  }
}

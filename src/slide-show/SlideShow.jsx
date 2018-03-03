import './SlideShow.css'

import { apply, compose, curry, last, objOf, reduce, tap } from 'ramda'
import React, { Component } from 'react'
import { fetchGallery } from '../fetch-gallery'
import { preloadWithDuration } from '../preload-with-duration'
import GalleryItem from '../gallery-item/GalleryItem.jsx'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

const pause = ({ waitTime }) => new Promise(resolve => setTimeout(resolve, waitTime))
const withNoDelay = { waitTime: 0 }
const startImmediately = Promise.resolve(withNoDelay)
const doSlideShow = handlers => reduce(toSlideShow(handlers), startImmediately)

const toSlideShow = ({ onDuration }) => (chain, item) =>
  chain
    .then(pause)
    .then(() => Promise.all([item, preloadWithDuration(item)]))
    .then(tap(apply(onDuration)))
    .then(compose(objOf('waitTime'), last))
    .catch(e => {
      console.log(e)
      return Promise.resolve(withNoDelay)
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
      onDuration: (item, duration) => {
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
        {item && <GalleryItem key={`${item.id}i`} item={item} />}
        {fetching && <div className='slide-show__spinner'><Spinner/></div>}
        {message && <h2 className='slide-show__message'>{message}</h2>}
      </div>
    )
  }
}

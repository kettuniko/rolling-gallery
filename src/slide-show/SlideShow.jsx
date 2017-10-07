import './SlideShow.css'

import { apply, compose, composeP, curry, head, last, map, objOf, path, prop, reduce, replace, tap } from 'ramda'
import React, { Component } from 'react'
import { fetchBlob } from '../fetch'
import fetchGallery from '../fetch-gallery'
import getDuration from '../get-duration'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

const { createObjectURL, revokeObjectURL } = window.URL
const revokeOnLoad = compose(revokeObjectURL, path(['target', 'src']))

const useHttps = replace('http://', 'https://')
const toImageUrl = compose(useHttps, prop('link'))

const pause = ({ waitTime }) => new Promise(resolve => setTimeout(resolve, waitTime))

const startImmediately = Promise.resolve({ waitTime: 0 })

const doSlideShow = handlers => compose(
  reduce(toSlideShow(handlers), startImmediately),
  map(toImageUrl)
)

const recover = e => {
  console.log(e)
  return Promise.resolve()
}

const toSlideShow = ({ onImageDownloaded }) => (chain, imageUrl) => composeP(
  compose(objOf('waitTime'), last),
  tap(apply(onImageDownloaded)),
  url => Promise.all([url, getDuration(url)]),
  compose(createObjectURL, head),
  () => Promise.all([fetchBlob(imageUrl).catch(recover), chain.then(pause)]),
)(chain)

const showImagesFromGalleryPage = curry((gallery, handlers, pageNumber) =>
  fetchGallery(pageNumber, gallery)
    .then(images => {
      const showImagesFromPage = showImagesFromGalleryPage(gallery, handlers)
      if (images.length) {
        doSlideShow(handlers)(images)
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
      duration: null,
      fetching: true,
      imageUrl: null,
      message: null
    }
  }

  componentDidMount() {
    showImagesFromGalleryPage(this.props.gallery, {
      onImageDownloaded: curry((imageUrl, duration) => {
        this.setState({
          duration,
          imageUrl,
          fetching: false
        })
      }),
      onMessage: message => this.setState({
        message,
        fetching: false
      })
    }, 0)
  }

  render() {
    const { duration, imageUrl, fetching, message } = this.state
    return (
      <div className='slide-show'>
        {duration && <Progressbar key={imageUrl} duration={duration}/>}
        {imageUrl && <img className='slide-show__image' onLoad={revokeOnLoad} src={imageUrl}/>}
        {fetching && <div className='slide-show__spinner'><Spinner/></div>}
        {message && <h2 className='slide-show__message'>{message}</h2>}
      </div>
    )
  }
}

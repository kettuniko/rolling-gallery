import './SlideShow.css'

import { get as axiosGet } from 'axios'
import getInfo from 'gif-info'
import { compose, composeP, curry, flip, multiply, path, prop, propOr } from 'ramda'
import { parse } from 'query-string'
import React, { Component } from 'react'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

const get = curry(composeP(prop('data'), flip(axiosGet)))
const fetchBlob = get({ responseType: 'blob' })
const fetchArrayBuffer = get({ responseType: 'arraybuffer' })

const toMilliseconds = multiply(1000)
const stillImageDuration = compose(toMilliseconds, propOr(5, 'stillSeconds'), parse)
const animationDuration = ({ isBrowserDuration, durationChrome, duration }) => isBrowserDuration ? durationChrome : duration
const toDuration = imageInfo => imageInfo.animated ? animationDuration(imageInfo) : stillImageDuration(window.location.search)
const getDuration = composeP(toDuration, getInfo, fetchArrayBuffer)

const { createObjectURL, revokeObjectURL } = window.URL
const revokeOnLoad = compose(revokeObjectURL, path(['target', 'src']))

const pause = duration => new Promise(resolve => setTimeout(resolve, duration))

export default class SlideShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      duration: null,
      fetching: true,
      imageUrl: null
    }
  }

  componentDidMount() {
    fetchBlob('https://i.imgur.com/lRzZzxB.gif')
      .then(createObjectURL)
      .then(objectUrl =>
        getDuration(objectUrl)
          .then(duration => {
            this.setState({ imageUrl: objectUrl, fetching: false, duration })
            return pause(duration)
          }))
  }

  render() {
    return (
      <div>
        {this.state.duration && <Progressbar key={this.state.imageUrl} duration={this.state.duration}/>}
        {this.state.imageUrl && <img onLoad={revokeOnLoad} src={this.state.imageUrl}/>}
        {this.state.fetching && <div className='slide-show-spinner'><Spinner/></div>}
      </div>
    )
  }
}

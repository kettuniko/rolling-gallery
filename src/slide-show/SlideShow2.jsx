import './SlideShow.css'

import { compose, path } from 'ramda'
import React, { Component } from 'react'
import { fetchBlob } from '../fetch'
import getDuration from '../get-duration'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

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

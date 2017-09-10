import './SlideShow.css'

import { compose, head, map, path, prop, replace } from 'ramda'
import React, { Component } from 'react'
import { fetchBlob } from '../fetch'
import fetchGallery from '../fetch-gallery'
import getDuration from '../get-duration'
import Progressbar from '../progressbar/Progressbar.jsx'
import Spinner from '../spinner/Spinner.jsx'

const { createObjectURL, revokeObjectURL } = window.URL
const revokeOnLoad = compose(revokeObjectURL, path(['target', 'src']))
const toImageUrl = compose(replace('http://', 'https://'), prop('link'))

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
    fetchGallery(0, this.props.gallery)
      .then(map(toImageUrl))
      .then(head)
      .then(fetchBlob)
      .then(createObjectURL)
      .then(objectUrl =>
        getDuration(objectUrl)
          .then(duration =>
            this.setState({
              duration,
              imageUrl: objectUrl,
              fetching: false
            })))
  }

  render() {
    return (
      <div className='slide-show'>
        {this.state.duration && <Progressbar key={this.state.imageUrl} duration={this.state.duration}/>}
        {this.state.imageUrl && <img className='slide-show--image' onLoad={revokeOnLoad} src={this.state.imageUrl}/>}
        {this.state.fetching && <div className='slide-show--spinner'><Spinner/></div>}
      </div>
    )
  }
}

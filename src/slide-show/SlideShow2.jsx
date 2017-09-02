import './SlideShow.css'

import { get } from 'axios'
import { compose, path, prop } from 'ramda'
import React, { Component } from 'react'
import Spinner from '../spinner/Spinner.jsx'

const fetchBlob = url => get(url, { responseType: 'blob' }).then(prop('data'))

const { createObjectURL, revokeObjectURL } = window.URL
const revokeOnLoad = compose(revokeObjectURL, path(['target', 'src']))

export default class SlideShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true,
      imageUrl: null
    }
  }

  componentDidMount() {
    fetchBlob('https://i.imgur.com/lgCsd14.jpg')
      .then(createObjectURL)
      .then(imageUrl => this.setState({ imageUrl, fetching: false }))
  }

  render() {
    return (
      <div>
        {this.state.imageUrl && <img onLoad={revokeOnLoad} src={this.state.imageUrl}/>}
        {this.state.fetching && <div className='slide-show-spinner'><Spinner/></div>}
      </div>
    )
  }
}

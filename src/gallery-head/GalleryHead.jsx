import './GalleryHead.css'
import React, { Component } from 'react'
import Spinner from '../spinner/Spinner.jsx'
import GalleryItem from '../gallery-item/GalleryItem.jsx'

export default class GalleryHead extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true
    }
  }

  markReady() {
    this.setState({
      fetching: false
    })
  }

  render() {
    const { item } = this.props
    const { section, id } = item
    const { fetching } = this.state

    return (
      <a className='gallery-head' href={`?r=${section}`}>
        {fetching && <span className='gallery-head__spinner'><Spinner/></span>}
        {fetching && <img className='gallery-head__thumbnail' src={`https://i.imgur.com/${id}b.jpg`}/>}
        <GalleryItem playOnHover item={item} onLoad={() => this.markReady()}/>
        <span className='gallery-head__name'>{section}</span>
      </a>
    )
  }
}

import './GalleryHead.css'
import React, { Component } from 'react'

export default class GalleryHead extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { section, id } = this.props
    return (
      <a className="gallery-head" href={`?r=${section}`}>
        <img className='gallery-head__image' src={`https://i.imgur.com/${id}b.jpg`}/>
        <span className="gallery-head__name">{section}</span>
      </a>
    )
  }
}

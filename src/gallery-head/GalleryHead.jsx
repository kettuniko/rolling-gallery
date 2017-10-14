import './GalleryHead.css'
import React, { Component } from 'react'
import Spinner from '../spinner/Spinner.jsx'

export default class GalleryHead extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: false
    }
  }

  render() {
    const { item: { section, id } } = this.props
    const { fetching } = this.state

    return (
      <a className="gallery-head" href={`?r=${section}`}>
        {fetching && <span className='gallery-head__spinner'><Spinner/></span>}
        <img className='gallery-head__image' src={`https://i.imgur.com/${id}b.jpg`}/>
        <span className="gallery-head__name">{section}</span>
      </a>
    )
  }
}

import './GalleryHead.css'
import React from 'react'

export default function GalleryHead({ id, section }) {
  return (
    <a className="gallery-head" href={`?r=${section}`}>
      <img className='gallery-head__image' src={`https://i.imgur.com/${id}b.jpg`}/>
      <span className="gallery-head__name">{section}</span>
    </a>
  )
}

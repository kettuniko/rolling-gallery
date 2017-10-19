import React from 'react'

export default function GalleryItem(props) {
  const { item: { animated, link, mp4 } } = props

  return (
    animated
      ? <video className='gallery-item' src={mp4} loop autoPlay muted playsInline/>
      : <img className='gallery-item' src={link}/>
  )
}

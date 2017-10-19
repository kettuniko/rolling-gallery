import React from 'react'

export default function GalleryItem(props) {
  const { item: { animated, link, mp4 }, onLoad } = props

  return (
    animated
      ? <video className='gallery-item' src={mp4} onCanPlayThrough={onLoad} loop autoPlay muted playsInline/>
      : <img className='gallery-item' onLoad={onLoad} src={link}/>
  )
}

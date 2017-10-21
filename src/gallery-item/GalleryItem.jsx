import React, { Component } from 'react'
import { __, always, equals, ifElse } from 'ramda'

export default class GalleryItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item: { animated, link, mp4 }, onLoad, autoPlay } = this.props

    const whenAutoPlayDisabled = ifElse(equals(true), always, __, autoPlay)

    return animated
      ? <video className='gallery-item'
               src={mp4}
               onCanPlayThrough={onLoad}
               ref={video => {this.video = video}}
               onMouseOver={whenAutoPlayDisabled(() => this.video.play())}
               onMouseOut={whenAutoPlayDisabled(() => this.video.pause())}
               autoPlay={autoPlay}
               loop
               muted
               playsInline/>
      : <img className='gallery-item' onLoad={onLoad} src={link}/>
  }
}

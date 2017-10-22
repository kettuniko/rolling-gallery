import React, { Component } from 'react'
import { __, always, equals, ifElse } from 'ramda'

export default class GalleryItem extends Component {
  constructor(props) {
    super(props)
    this.playVideo = this.playVideo.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.playVideo)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.playVideo)
  }

  componentDidUpdate() {
    this.playVideo()
  }

  playVideo() {
    const video = this.video
    if (video) {
      const { bottom, top, width } = video.getBoundingClientRect()
      const topInsideViewPort = top >= 0
      const bottomInsideViewPort = bottom < window.innerHeight
      const onlyHorizontalItem = width === window.innerWidth
      const bestItemInViewPort = topInsideViewPort && bottomInsideViewPort && onlyHorizontalItem
      bestItemInViewPort ? video.play() : video.pause()
    }
  }

  render() {
    const { item: { animated, link, mp4 }, onLoad, playOnHover } = this.props

    const playOnHoverEnabled = ifElse(equals(true), always, __, playOnHover)

    return animated
      ? <video className='gallery-item'
               src={mp4}
               onCanPlayThrough={onLoad}
               ref={video => this.video = video}
               onMouseOver={playOnHoverEnabled(() => this.video.play())}
               onMouseOut={playOnHoverEnabled(() => this.video.pause())}
               autoPlay
               loop
               muted
               playsInline/>
      : <img className='gallery-item' onLoad={onLoad} src={link}/>
  }
}

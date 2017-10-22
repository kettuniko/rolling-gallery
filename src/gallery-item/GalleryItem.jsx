import React, { Component } from 'react'

export default class GalleryItem extends Component {
  constructor(props) {
    super(props)
    this.playVideoWithinViewport = this.playVideoWithinViewport.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.playVideoWithinViewport)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.playVideoWithinViewport)
  }

  componentDidUpdate() {
    this.playVideoWithinViewport()
  }

  playVideoWithinViewport() {
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

  playVideo(play) {
    if (this.props.playOnHover && !play) {
      this.video.pause()
    } else {
      this.video.play()
    }
  }

  render() {
    const { item: { animated, link, mp4 }, onLoad } = this.props

    return animated
      ? <video className='gallery-item'
               src={mp4}
               onCanPlayThrough={onLoad}
               ref={video => this.video = video}
               onMouseOver={() => this.playVideo(true)}
               onMouseOut={() => this.playVideo(false)}
               autoPlay
               loop
               muted
               playsInline/>
      : <img className='gallery-item' onLoad={onLoad} src={link}/>
  }
}

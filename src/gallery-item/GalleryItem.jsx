import { compose, equals, gt, ifElse, invoker, lte, where } from 'ramda'
import React, { Component } from 'react'

const invoke = invoker(0)

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

  componentDidUpdate({ item: { id } }) {
    if (id === this.props.item.id) {
      this.playVideoWithinViewport()
    }
  }

  playVideoWithinViewport() {
    const video = this.video
    if (video) {
      const isBestInViewPort = compose(
        where({
          top: lte(0),
          bottom: gt(window.innerHeight),
          width: equals(window.innerWidth)
        }),
        invoke('getBoundingClientRect')
      )

      ifElse(
        isBestInViewPort,
        invoke('play'),
        invoke('pause')
      )(video)
    }
  }

  playVideo(play) {
    play ? this.video.play() : this.video.pause()
  }

  render() {
    const { item: { animated, link, mp4 }, onLoad, playOnHover } = this.props

    return animated
      ? <video className='gallery-item'
               src={mp4}
               onCanPlayThrough={onLoad}
               ref={video => this.video = video}
               onMouseOver={() => playOnHover && this.playVideo(true)}
               onMouseOut={() => playOnHover && this.playVideo(false)}
               autoPlay
               loop
               muted
               playsInline/>
      : <img className='gallery-item' onLoad={onLoad} src={link}/>
  }
}

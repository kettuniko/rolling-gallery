import { append, head, map, pick } from 'ramda'
import React, { Component } from 'react'
import fetchGallery from './fetch-gallery'

const galleries = [
  'brokengifs',
  'wastedgifs',
  'earthporn',
  'reactiongifs',
  'gifs',
  'wallpapers',
  'woahdude',
  'perfecttiming',
  'foodporn',
  'unexpected'
]


const Gallery = ({ id, section }) =>
  <a className="gallery-head" href={`?r=${section}`}>
    <img src={`https://i.imgur.com/${id}b.jpg`}/>
    <span className="gallery-head__name">{section}</span>
  </a>

export default class FrontPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true,
      galleries: []
    }
  }

  componentDidMount() {
    const renderSequentially = (sequence, current) => sequence
      .then(() => current
        .then(head)
        .then(pick(['id', 'section']))
        .then(gallery =>
          this.setState(prevState => ({ galleries: append(gallery, prevState.galleries) }))
        ))

    galleries
      .map(g => fetchGallery(g))
      .reduce(renderSequentially, Promise.resolve())
      .then(() => this.setState({ fetching: false }))
  }

  render() {
    return (
      <div>
        <div className="galleries">
          {map(({ id, section }) => <Gallery id={id} section={section} key={id}/>, this.state.galleries)}
        </div>
        {this.state.fetching && <h1 className="loading">Loading...</h1>}
        <footer className="footer">image copyrights: <a href="https://imgur.com/">imgur.com</a></footer>
      </div>
    )
  }
}

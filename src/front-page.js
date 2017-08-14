import { append, compose, head, map, objOf, pick, prop, reduce } from 'ramda'
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

const createAppender = gallery => compose(
  objOf('galleries'),
  append(gallery),
  prop('galleries')
)

const fetchAsGallery = gallery =>
  fetchGallery(gallery)
    .then(head)
    .then(pick(['id', 'section']))
    .then(createAppender)

export default class FrontPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true,
      galleries: []
    }
  }

  componentDidMount() {
    const renderSequentially = (sequence, current) =>
      sequence
        .then(() => current
          .then(appendToGalleries =>
            this.setState(appendToGalleries)))

    const renderGalleries = compose(
      reduce(renderSequentially, Promise.resolve()),
      map(fetchAsGallery)
    )

    renderGalleries(galleries)
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

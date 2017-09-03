import './FrontPage.css'
import { append, compose, composeP, head, lensProp, map, over, pick, reduce } from 'ramda'
import React, { Component } from 'react'
import fetchGallery from '../fetch-gallery'
import Spinner from '../spinner/Spinner.jsx'

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

const appendToGalleriesF = gallery => over(
  lensProp('galleries'),
  append(gallery)
)

const fetchAsGallery = composeP(
  appendToGalleriesF,
  pick(['id', 'section']),
  head,
  fetchGallery(0)
)

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
      <div className='front-page'>
        <div className="galleries">
          {map(({ id, section }) => <Gallery id={id} section={section} key={id}/>, this.state.galleries)}
          {this.state.fetching && <div className='gallery-head-spinner'><Spinner/></div>}
        </div>
        <footer className="footer">image copyrights: <a href="https://imgur.com/">imgur.com</a></footer>
      </div>
    )
  }
}

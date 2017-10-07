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

const fetchAsGallery = composeP(
  pick(['id', 'section']),
  head,
  fetchGallery(0)
)

const renderSequentially = onSingleDownloaded => (sequence, current) =>
  sequence.then(() => current.then(onSingleDownloaded))

const renderGalleries = ({ onSingleDownloaded, onAllDownloaded }) => compose(
  onAllDownloaded,
  reduce(renderSequentially(onSingleDownloaded), Promise.resolve()),
  map(fetchAsGallery)
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
    renderGalleries({
      onSingleDownloaded: gallery => this.setState(over(lensProp('galleries'), append(gallery))),
      onAllDownloaded: () => this.setState({ fetching: false })
    })(galleries)
  }

  render() {
    const { fetching, galleries } = this.state
    return (
      <div className='front-page'>
        <div className="galleries">
          {map(({ id, section }) => <Gallery id={id} section={section} key={id}/>, galleries)}
          {fetching && <div className='gallery-head-spinner'><Spinner/></div>}
        </div>
        <footer className="footer">image copyrights: <a href="https://imgur.com/">imgur.com</a></footer>
      </div>
    )
  }
}

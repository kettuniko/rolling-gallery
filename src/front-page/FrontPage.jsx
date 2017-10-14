import './FrontPage.css'
import { append, compose, composeP, head, lensProp, map, over, pick, reduce } from 'ramda'
import React, { Component } from 'react'
import { fetchGallery } from '../fetch-gallery'
import Footer from '../footer/Footer.jsx'
import GalleryHead from '../gallery-head/GalleryHead.jsx'
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

const fetchAsGallery = composeP(
  pick(['id', 'section']),
  head,
  fetchGallery(0)
)

const renderSequentially = onSingleDownloaded => (sequence, current) =>
  sequence.then(() => current.then(onSingleDownloaded))

const renderGalleries = ({ onSingleDownloaded, onAllDownloaded }) => compose(
  composeP(
    onAllDownloaded,
    reduce(renderSequentially(onSingleDownloaded), Promise.resolve())
  ),
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
          {map(({ id, section }) => <GalleryHead id={id} section={section} key={id}/>, galleries)}
          {fetching && <div className='gallery-head-spinner'><Spinner/></div>}
        </div>
        <Footer />
      </div>
    )
  }
}

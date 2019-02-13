import { append, compose, composeWith, head, lensProp, map, over, reduce, then } from 'ramda'
import React, { Component } from 'react'
import { fetchGallery } from '../fetch-gallery'
import Footer from '../footer/Footer.jsx'
import GalleryHead from '../gallery-head/GalleryHead.jsx'
import Spinner from '../spinner/Spinner.jsx'
import './FrontPage.css'

const galleries = [
  'brokengifs',
  'wastedgifs',
  'slygifs',
  'mildlyinteresting',
  'reactiongifs',
  'gifs',
  'chemicalreactiongifs',
  'woahdude',
  'mechanical_gifs',
  'oddlysatisfying',
  'combinedgifs',
  'unexpected'
]

const fetchAsGallery = composeWith(then,
  [head, fetchGallery(0)]
)

const renderSequentially = onSingleDownloaded => (sequence, current) =>
  sequence.then(() => current.then(onSingleDownloaded))

const renderGalleries = ({ onSingleDownloaded, onAllDownloaded }) => compose(
  composeWith(then,[onAllDownloaded, reduce(renderSequentially(onSingleDownloaded), Promise.resolve())]),
  map(fetchAsGallery)
)

export default class FrontPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true,
      galleryHeads: []
    }
  }

  componentDidMount() {
    renderGalleries({
      onSingleDownloaded: gallery => this.setState(over(lensProp('galleryHeads'), append(gallery))),
      onAllDownloaded: () => this.setState({ fetching: false })
    })(galleries)
  }

  render() {
    const { fetching, galleryHeads } = this.state
    return (
      <div className='front-page'>
        <div className='galleries'>
          {map(galleryHead => <GalleryHead item={galleryHead} key={galleryHead.id}/>, galleryHeads)}
          {fetching && <div className='gallery-head-spinner'><Spinner/></div>}
        </div>
        <Footer/>
      </div>
    )
  }
}

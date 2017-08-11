import { map, pipe, reduce } from 'ramda'
import fetchGallery from './fetch-gallery'
import toDomNode from './to-dom-node'

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

const renderSequentially = (sequence, current) => sequence
  .then(() => current
    .then(([{ id, section }]) =>
      toDomNode(`
        <a class="gallery-head" href="?r=${section}">
          <img src="${`https://i.imgur.com/${id}b.jpg`}" />
          <span class="gallery-head__name">${section}</span>
        </a>`))
    .then(img => document.querySelector('.galleries').appendChild(img)))

export default () => {
  const frontPage = toDomNode(`
    <div class="galleries"></div>
    <h1 class="loading">Loading...</h1>
    <footer class="footer">image copyrights: <a href="https://imgur.com/">imgur.com</a></footer>
  `)
  document.querySelector('.root').appendChild(frontPage)

  return pipe(
    map(fetchGallery),
    reduce(renderSequentially, Promise.resolve())
  )(galleries)
    .then(() => document.querySelector('.loading').remove());
}

import { compose, map, reduce } from 'ramda'
import fetchGallery from './fetch-gallery'
import toDomNode from './to-dom-node'

const galleries = ['brokengifs', 'wastedgifs', 'earthporn', 'reactiongifs', 'gifs', 'wallpapers', 'woahdude', 'perfecttiming', 'foodporn', 'unexpected']

const renderSequentially = (sequence, current) => sequence
  .then(() => current
    .then(([{ id, section }]) =>
      toDomNode(`
        <a class="gallery-head" href="?r=${section}">
          <img src="${`https://i.imgur.com/${id}b.jpg`}" />
          <span class="gallery-head__name">${section}</span>
        </a>`))
    .then(img => document.querySelector('.galleries').appendChild(img)))

export default () => compose(
  completed => completed.then(() => document.querySelector('.loading').remove()),
  reduce(renderSequentially, Promise.resolve()),
  map(fetchGallery))
(galleries)

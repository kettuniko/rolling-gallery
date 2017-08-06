import fetchGallery from './fetch-gallery'
import toDomNode from './to-dom-node'

const galleries = ['brokengifs', 'wastedgifs', 'earthporn', 'reactiongifs', 'gifs', 'wallpapers', 'woahdude', 'perfecttiming', 'foodporn', 'unexpected']

export default () => galleries
  .map((g) => fetchGallery(g))
  .reduce((sequence, current) => sequence
    .then(() => current
      .then(([{ id, section }]) =>
        toDomNode(`
          <a class="gallery-head" href="?r=${section}">
            <img src="${`https://i.imgur.com/${id}b.jpg`}" />
            <span class="gallery-head__name">${section}</span>
          </a>`))
      .then(img => document.querySelector('.galleries').appendChild(img))), Promise.resolve())
  .then(() => {
    document.querySelector('.loading').remove()
  })

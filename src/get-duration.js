import { composeP, multiply } from 'ramda'
import { fetchBlob } from './fetch'

const getObjectDuration = url =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.setAttribute('src', url)
    video.addEventListener('durationchange', () => {
      const { duration } = video
      if (duration) {
        resolve(duration)
      } else {
        reject('Could not get duration for video')
      }
    })
  })

export const getDuration = composeP(
  multiply(1000),
  getObjectDuration,
  window.URL.createObjectURL,
  fetchBlob
)

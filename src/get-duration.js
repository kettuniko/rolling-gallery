import getInfo from 'gif-info'
import { parse as parseQueryString } from 'query-string'
import { compose, composeP, multiply, propOr } from 'ramda'
import { fetchArrayBuffer } from './fetch'

const toMilliseconds = multiply(1000)
const stillImageDuration = compose(toMilliseconds, propOr(5, 'stillSeconds'), parseQueryString)
const animationDuration = ({ isBrowserDuration, durationChrome, duration }) => isBrowserDuration ? durationChrome : duration
const toDuration = imageInfo => imageInfo.animated ? animationDuration(imageInfo) : stillImageDuration(window.location.search)

export default composeP(toDuration, getInfo, fetchArrayBuffer)

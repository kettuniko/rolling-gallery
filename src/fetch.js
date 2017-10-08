import { get as axiosGet } from 'axios'
import { composeP, curry, flip, prop} from 'ramda'

const get = curry(composeP(prop('data'), flip(axiosGet)))

export const fetchBlob = get({ responseType: 'blob' })
export const fetchArrayBuffer = get({ responseType: 'arraybuffer' })

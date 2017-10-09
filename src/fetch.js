import { composeP } from 'ramda'

export const fetchBlob = composeP(r => r.blob(), window.fetch)
export const fetchJson = composeP(r => r.json(), window.fetch)

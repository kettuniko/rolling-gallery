import { composeP, invoker, } from 'ramda'

export const fetchBlob = composeP(invoker(0, 'blob'), window.fetch)
export const fetchJson = composeP(invoker(0, 'json'), window.fetch)

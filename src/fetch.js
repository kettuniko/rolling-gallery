import { composeP, invoker, } from 'ramda'

export const { fetch } = window
export const fetchJson = composeP(invoker(0, 'json'), fetch)
export const fetchHead = url => fetch(url, { method: 'HEAD', redirect: 'error' })

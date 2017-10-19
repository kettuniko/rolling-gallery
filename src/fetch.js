import { composeP, invoker, } from 'ramda'

export const { fetch } = window
export const fetchJson = composeP(invoker(0, 'json'), fetch)

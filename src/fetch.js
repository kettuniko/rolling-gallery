export const { fetch } = window

export const fetchJson = url => fetch(url, {
  headers: {
    Authorization: 'Client-ID 1400c78269df7bc'
  }
}).then(response => response.json())

export const fetchHead = url => fetch(url, { method: 'HEAD', redirect: 'error' })

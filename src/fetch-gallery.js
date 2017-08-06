const isDisplayAble = ({ link }) => link.includes('i.imgur.com')

export default (gallery, pageNumber = 0) =>
  window.fetch(`https://api.imgur.com/3/gallery/r/${gallery}/time/${pageNumber}`, {
    headers: {
      'Authorization': 'Client-ID 1400c78269df7bc'
    }
  }).then(response => response.json())
    .then(responseBody => responseBody.data)
    .then(images => images.filter(isDisplayAble))

// ==UserScript==
// @name       imgur roller
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://imgur.com/r/*/*
// @copyright  2012+, You
// @require
// ==/UserScript==


$.get("hit.json", function (response) {
  var hashes = _.map(response.data, function (img) {
    return img.hash
  })
  console.log(hashes)
})
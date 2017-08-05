// Extracts all script src's from an html file
// then minifies, and concatenates them into one file.
// Author: leathan
// License: MIT
process.argv[2] && ExtractBundle(process.argv[2]);
module.exports = ExtractBundle;
function ExtractBundle(file, verbose) {
  !file && !console.log("Provide a link.") && process.exit(1)
  const { minify } = require("uglify-es");
  const request = require('request')
  const fs = require('fs')
  const host = /(.*)\//.exec(file)[1];

  const results = [];
  var found = 0;

  // If their is no new data found in 15 seconds, atleast 1 server hung,
  // so if lastfound(15 seconds ago) === found(nowish) exit.
  (function forever(lastfound) {
    setTimeout(()=>{ if(found === lastfound) !console.log("Atleast 1 server hung.") && process.exit(1); else forever(found) }, 15000)
  })();

  request(file, (_, __, data) => {
    !data && !console.log("No data from link.") && process.exit(1)
    const sources = data.replace(/<!--[\s\S]*?-->/mg,'') // Remove comments
    .match(/<script.*?>.*<\/script>/g)               // Get all lines with scripts
    .map(_=>_.match(/src\s*=\s*"(.*)"/)[1]) // Return array of source locations.
    sources.map((source, i, arr) => {
      const url = /\/\//.test(source) ? source : host + source;
      (process.argv[3] || verbose) && !console.log("fetching " + url)
      request(url, (err, res, body) => {
        results[i] = minify(body).code || {error: true}
        if(results[i].error) !console.log("Error parsing " + url) && process.exit(1)
        if(++found === arr.length) {
          fs.writeFileSync('bundle.js', results.join(''))
          console.log('Saved output to ./bundle.js')
          process.exit(0);
        }
      })
    })
  })
}

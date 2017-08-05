# bundle-html-scripts

Bundle and compress all scripts from any local or remote server's html file

**As command line argument**
```javascript
bundle-html-scripts http://example.com/file.html
// OR
/path/to/bundle-html-scripts.js http://example.com/file.html
```

**In code**
```javascript
require('bundle-html-scripts')('http://example.com/file.html')
```

Both commands above will create a file `./bundle.js` on success.
On failure keep trying... after 10+ attempts open an issue including the link.

# Instalation

`npm install bundle-html-scripts` **||** `npm install -g bundle-html-scripts`

# Dependencies

1.) request
2.) uglify-js

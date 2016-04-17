// /
var speech = require('google-speech-api');

var opts = {
  file: './english.mp3',
  key: 'AIzaSyCvICiFExBcrAMXLnweOqk7rJMjD9Li9pQ'
};

speech(opts, function (err, results) {
  console.log(err);
  console.log(results);
  // [{result: [{alternative: [{transcript: '...'}]}]}]
});

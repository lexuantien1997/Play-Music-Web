const co = require('co');
const { request } = require('utils');
const rp = require('request-promise');
const lrcParser = require('lrc-parser');

// module.exports = function getSong(req, res, next) {
//   const { name, id } = req.query;
//   // TO DO: use async await when targeting node 8.0

//   co(function* () {
//     const html = yield request(`https://mp3.zing.vn/bai-hat/${name}/${id}.html`);
//     const regex = /media\/get-source\?type=audio&key=.{33}/; // get the resouce url
//     const match = html.match(regex);
//     if (!match) throw new Error("can't find the resource URL");

//     const [matchUrl] = match;
//     const resource = yield request(`https://mp3.zing.vn/xhr/${matchUrl}`);
//     const data = JSON.parse(resource).data;
//     // data.lyric now is a url
//     if (!data.lyric.trim()) {
//       data.lyric = []; // rewrite the {string} url to an array
//       return data;
//     }
//     console.log(data.lyric);
//     const lrcFile = yield request(data.lyric);
//     data.lyric = lrcParser(lrcFile).scripts;
//     return data;
//   })
//   .then(data => res.json(data))
//   .catch(err => next(err));
// };

/**
 * type: "video|audio"
 * code: "Zmjkt..."
 * 
 */
module.exports = function getSong(req, res, next) {
  const { code } = req.query;
  let type = 'audio';
  // TO DO: use async await when targeting node 8.0
  let origin_url = "https://mp3.zing.vn/xhr/media/"; // get when check network
  // with different code we still get code
  let param_uri = `get-source?type=${type}&key=${code}`;; // get when check network
  let final_uri = origin_url + param_uri;
  
  co(function* () {
    const response = yield request(final_uri);
    const  data  = JSON.parse(response).data;
    // data.lyric now is a url
    if (!data.lyric.trim()) {
      data.lyric = []; // rewrite the {string} url to an array
      res.json(data);
    }
    console.log(data.lyric);
    const lrcFile = yield request(data.lyric);
    data.lyric = lrcParser(lrcFile).scripts;
    res.json(data);
  })   
  .then(data => res.json(data))
  .catch(err => next(err));
};


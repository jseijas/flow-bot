import request from 'request';
import xml2js from 'xml2js';

class Wolfram {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  query(input, cb) {
    if (!this.apiKey) {
      return cb('Wolfram key not set');
    }
    let uri = 'http://api.wolframalpha.com/v2/query?input='
      + encodeURIComponent(input) + '&primary=true&appid=' + this.apiKey;
    request(uri, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return cb(error || 'Returned error from Wolfram');
      }
      xml2js.parseString(body, function(err, result) {
        if (err) {
          return cb(err);
        }
        let queryresult = result.queryresult;
        if (!queryresult) {
          return cb('Error in wolfram result');
        }
        let status = queryresult['$'];
        if (status.error !== 'false') {
          return cb('Error querying wolfram');
        }
        let podarr = queryresult['pod'];
        let pods = [];
        for (let i = 0; i < podarr.length; i++) {
          let currentpod = podarr[i];
          let pod = {
            title: currentpod['$'].title,
            primary: currentpod['$'].primary,
            subpods: []
          };
          for (let j = 0; j < currentpod.subpod.length; j++) {
            let currentsubpod = currentpod.subpod[j];
            pod.subpods.push({
              title: currentsubpod['$'].title,
              value: currentsubpod.plaintext,
              image: currentsubpod.img[0]['$'].src
            });
          }
          pods.push(pod);
        }
        return cb(undefined, pods);
      });
    });
  }

  queryAsCard(input, cb) {
    this.query(input, function(err, pods) {
      if (err) {
        return cb(null, {
          type: "text",
          text: "I am not able to give you a result :("
        });
      }
      let pod = pods[0];
      let card = {
        type: 'hero',
        title: pod.title
      }
      let subpod = pod.subpods[0];
      if (subpod.image) {
        card.image = subpod.image;
      }
      if (subpod.value) {
        if (!subpod.value.length) {
          card.text = subpod.value;
        } else {
          let s = '';
          for (let i = 0; i < subpod.value.length; i++) {
            if (i > 0) {
              s += '\n';
            }
            s += subpod.value[i];
          }
          card.text = s;
        }
      }
      return cb(null, card);
    });
  }
}

export default Wolfram;

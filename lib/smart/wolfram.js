'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wolfram = function () {
  function Wolfram(apiKey) {
    _classCallCheck(this, Wolfram);

    this.apiKey = apiKey;
  }

  _createClass(Wolfram, [{
    key: 'query',
    value: function query(input, cb) {
      if (!this.apiKey) {
        return cb('Wolfram key not set');
      }
      var uri = 'http://api.wolframalpha.com/v2/query?input=' + encodeURIComponent(input) + '&primary=true&appid=' + this.apiKey;
      (0, _request2.default)(uri, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          return cb(error || 'Returned error from Wolfram');
        }
        _xml2js2.default.parseString(body, function (err, result) {
          if (err) {
            return cb(err);
          }
          var queryresult = result.queryresult;
          if (!queryresult) {
            return cb('Error in wolfram result');
          }
          var status = queryresult['$'];
          if (status.error !== 'false') {
            return cb('Error querying wolfram');
          }
          if (status.success === 'false') {
            if (queryresult['didyoumeans']) {
              var didyoumean = queryresult['didyoumeans'][0].didyoumean[0]['_'];
              return cb(undefined, { success: false, didyoumean: didyoumean });
            } else {
              return cb(undefined, { success: false });
            }
          }
          var podarr = queryresult['pod'];
          var pods = [];
          var primary = void 0;
          for (var i = 0; i < podarr.length; i++) {
            var currentpod = podarr[i];
            var pod = {
              title: currentpod['$'].title,
              primary: currentpod['$'].primary,
              subpods: []
            };
            for (var j = 0; j < currentpod.subpod.length; j++) {
              var currentsubpod = currentpod.subpod[j];
              pod.subpods.push({
                title: currentsubpod['$'].title,
                value: currentsubpod.plaintext,
                image: currentsubpod.img[0]['$'].src
              });
            }
            if (pod.primary) {
              primary = pod;
            }
            pods.push(pod);
          }
          return cb(undefined, { primary: primary, pods: pods, success: true });
        });
      });
    }
  }, {
    key: 'queryAsCard',
    value: function queryAsCard(input, cb) {
      this.query(input, function (err, result) {
        if (err) {
          return cb(null, {
            type: "text",
            text: "I am not able to give you a result :("
          });
        }
        if (!result.sucess) {
          if (result.didyoumean) {
            return cb(null, {
              type: "text",
              text: "Perhaps you mean \"" + result.didyoumean + "\""
            });
          } else {
            return cb(null, {
              type: "text",
              text: "I am not able to give you a result :("
            });
          }
        }
        var pod = result.primary;
        var card = {
          type: 'hero',
          title: pod.title
        };
        var subpod = pod.subpods[0];
        if (subpod.image) {
          card.image = subpod.image;
        }
        if (subpod.value) {
          if (!subpod.value.length) {
            card.text = subpod.value;
          } else {
            var s = '';
            for (var i = 0; i < subpod.value.length; i++) {
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
  }]);

  return Wolfram;
}();

exports.default = Wolfram;
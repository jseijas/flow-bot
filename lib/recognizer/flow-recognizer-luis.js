'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowRecognizer = require('./flow-recognizer');

var _flowRecognizer2 = _interopRequireDefault(_flowRecognizer);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Flow Recognizer for the LUIS.ai NLP platform.
 */
var FlowRecognizerLuis = function (_FlowRecognizer) {
  _inherits(FlowRecognizerLuis, _FlowRecognizer);

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  function FlowRecognizerLuis(settings) {
    _classCallCheck(this, FlowRecognizerLuis);

    return _possibleConstructorReturn(this, (FlowRecognizerLuis.__proto__ || Object.getPrototypeOf(FlowRecognizerLuis)).call(this, settings));
  }

  /**
   * Given an utterance and a model, try to recognize the utterance,
   * returning the error (if exists), the intents and the entities recognized.
   * 
   * @param { String } utterance Utterance to be recognized.
   * @param { String } model Correct model for the recognition.
   * @param { Function } cb Callback Function.
   */


  _createClass(FlowRecognizerLuis, [{
    key: 'recognizeUterrance',
    value: function recognizeUterrance(utterance, model, cb) {
      try {
        var uri = model.trim();
        if (uri.lastIndexOf('&q=') != uri.length - 3) {
          uri += '&q=';
        }
        uri += encodeURIComponent(utterance || '');
        _request2.default.get(uri, function (err, res, body) {
          var result = void 0;
          try {
            if (!err) {
              result = JSON.parse(body);
              result.intents = result.intents || [];
              result.entities = result.entities || [];
              if (result.topScoringIntent && result.intents.length === 0) {
                result.intents.push(result.topScoringIntent);
              }
              if (result.intents.length === 1 && typeof result.intents[0].score !== 'number') {
                result.intents[0].score = 1.0;
              }
            }
          } catch (e) {
            err = e;
          }
          try {
            if (!err) {
              return cb(null, result.intents, result.entities);
            } else {
              return cb(err instanceof Error ? err : new Error(err.toString()));
            }
          } catch (e) {
            this.log('error', e.toString());
          }
        });
      } catch (err) {
        cb(err instanceof Error ? err : new Error(err.toString()));
      }
    }
  }]);

  return FlowRecognizerLuis;
}(_flowRecognizer2.default);

exports.default = FlowRecognizerLuis;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowRecognizer = require('./flow-recognizer');

var _flowRecognizer2 = _interopRequireDefault(_flowRecognizer);

var _nodeWit = require('node-wit');

var _nodeWit2 = _interopRequireDefault(_nodeWit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Flow Recognizer for the WIT.ai NLP platform.
 */
var FlowRecognizerWit = function (_FlowRecognizer) {
  _inherits(FlowRecognizerWit, _FlowRecognizer);

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  function FlowRecognizerWit(settings) {
    _classCallCheck(this, FlowRecognizerWit);

    var _this = _possibleConstructorReturn(this, (FlowRecognizerWit.__proto__ || Object.getPrototypeOf(FlowRecognizerWit)).call(this, settings));

    _this.apps = {};
    return _this;
  }

  /**
   * Gets an application to connect to WIT.ai, given the model.
   * The applications are cached, so an instance per model will exists.
   */


  _createClass(FlowRecognizerWit, [{
    key: 'getApp',
    value: function getApp(model) {
      if (!this.apps[model]) {
        this.apps[model] = new _nodeWit2.default.Wit({ accessToken: model });
      }
      return this.apps[model];
    }

    /**
     * Given an utterance and a model, try to recognize the utterance,
     * returning the error (if exists), the intents and the entities recognized.
     * 
     * @param { String } utterance Utterance to be recognized.
     * @param { String } model Correct model for the recognition.
     * @param { Function } cb Callback Function.
     */

  }, {
    key: 'recognizeUtterance',
    value: function recognizeUtterance(utterance, model, cb) {
      var app = this.getApp(model);
      try {
        app.message(utterance, {}).then(function (response) {
          if (response.error) {
            return cb(new Error(response.error));
          }
          var intents = [];
          var entities = [];
          for (var name in response.entities) {
            var entitylist = response.entities[name];
            if (name === 'intent') {
              for (var i = 0; i < entitylist.length; i++) {
                var entity = entitylist[i];
                intents.push({ score: entity.confidence, intent: entity.value });
              }
            } else {
              for (var _i = 0; _i < entitylist.length; _i++) {
                var _entity = entitylist[_i];
                var resultentity = {
                  entity: _entity.value,
                  score: _entity.confidence,
                  type: name,
                  startIndex: -1,
                  endIndex: -1
                };
                if (_entity.type === 'value') {
                  resultentity.startIndex = response._text.indexOf(_entity.value);
                  resultentity.endIndex = resultentity.startIndex + _entity.value.length - 1;
                }
                entities.push(resultentity);
              }
            }
          }
          return cb(null, intents, entities);
        }).catch(function (error) {
          return cb(error);
        });
      } catch (err) {
        return cb(err);
      }
    }
  }]);

  return FlowRecognizerWit;
}(_flowRecognizer2.default);

exports.default = FlowRecognizerWit;
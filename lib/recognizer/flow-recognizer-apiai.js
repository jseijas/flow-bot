'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowRecognizer = require('./flow-recognizer');

var _flowRecognizer2 = _interopRequireDefault(_flowRecognizer);

var _apiai = require('apiai');

var _apiai2 = _interopRequireDefault(_apiai);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Flow Recognizer for the API.ai NLP platform.
 */
var FlowRecognizerApiai = function (_FlowRecognizer) {
  _inherits(FlowRecognizerApiai, _FlowRecognizer);

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  function FlowRecognizerApiai(settings) {
    _classCallCheck(this, FlowRecognizerApiai);

    var _this = _possibleConstructorReturn(this, (FlowRecognizerApiai.__proto__ || Object.getPrototypeOf(FlowRecognizerApiai)).call(this, settings));

    _this.apps = {};
    return _this;
  }

  /**
   * Gets an application to connect to API.ai, given the model.
   * The applications are cached, so an instance per model will exists.
   */


  _createClass(FlowRecognizerApiai, [{
    key: 'getApp',
    value: function getApp(model) {
      if (!this.apps[model]) {
        this.apps[model] = new _apiai2.default(model);
      }
      return this.apps[model];
    }

    /** 
     * Gets the default entities.
     */

  }, {
    key: 'getDefaultEntities',
    value: function getDefaultEntities(result) {
      return [{
        entity: result.fulfillment.speech,
        type: 'fulfillment',
        startIndex: -1,
        endIndex: -1,
        score: 1
      }, {
        entity: result.actionIncomplete,
        type: 'actionIncomplete',
        startIndex: -1,
        endIndex: -1,
        score: 1
      }];
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
      var request = app.textRequest(utterance, { sessionId: _uuid2.default.v1() });
      request.on('response', function (response) {
        var result = response.result;
        var intent = void 0;
        var entities = void 0;
        if (result.source === 'domains') {
          entities = this.getDefaultEntities(result);
          intent = { score: result.score, intent: result.action, entities: entities };
        } else if (result.source === 'agent') {
          entities = this.getDefaultEntities(result);
          for (var key in result.parameters) {
            var entity = result.parameters[key];
            var length = entity.length;
            if (length > 0) {
              var startIndex = utterance.indexOf(entity);
              var entityFound = {
                entity: entity,
                type: key,
                startIndex: startIndex,
                endIndex: startIndex + length - 1,
                score: 1
              };
              entities.push(entityFound);
            }
          }
          intent = { score: result.score, intent: result.metadata.intentName, entities: entities };
        }
        cb(null, { score: 1, intent: intent.intent }, intent.entities);
      }.bind(this));
      request.on('error', function (error) {
        this.log('error', error.toString());
        cb(error);
      }.bind(this));
      request.end();
    }
  }]);

  return FlowRecognizerApiai;
}(_flowRecognizer2.default);

exports.default = FlowRecognizerApiai;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowRenderer = require('../flow-renderer');

var _flowRenderer2 = _interopRequireDefault(_flowRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for rendering a text card.
 */
var FlowRendererPrompt = function (_FlowRenderer) {
  _inherits(FlowRendererPrompt, _FlowRenderer);

  function FlowRendererPrompt(settings) {
    _classCallCheck(this, FlowRendererPrompt);

    var _this = _possibleConstructorReturn(this, (FlowRendererPrompt.__proto__ || Object.getPrototypeOf(FlowRendererPrompt)).call(this, settings));

    _this.type = 'prompt';
    return _this;
  }

  /**
   * Choice renderer.
   */


  _createClass(FlowRendererPrompt, [{
    key: 'renderChoice',
    value: function renderChoice(session, card) {
      var options = [];
      for (var i = 0; i < card.options.length; i++) {
        options.push(card.options[i].text);
      }
      var style = card.style ? { listStyle: this.builder.ListStyle[card.style] } : undefined;
      return this.builder.Prompts.choice(session, card.text, options, style);
    }

    /**
     * Transform the given card to the message builder.
     * 
     * @param { Object } session Chat session for building the message.
     * @param { Object } card Card to be transformed.
     */

  }, {
    key: 'transform',
    value: function transform(session, card) {
      var promptType = card.prompt ? card.prompt : 'text';
      if (promptType === 'choice') {
        return this.renderChoice(session, card);
      } else {
        return this.builder.Prompts[promptType](session, card.text);
      }
    }
  }]);

  return FlowRendererPrompt;
}(_flowRenderer2.default);

exports.default = FlowRendererPrompt;
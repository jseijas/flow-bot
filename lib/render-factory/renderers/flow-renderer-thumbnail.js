'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowRenderer = require('../flow-renderer');

var _flowRenderer2 = _interopRequireDefault(_flowRenderer);

var _flowRendererHero = require('./flow-renderer-hero');

var _flowRendererHero2 = _interopRequireDefault(_flowRendererHero);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for rendering a text card.
 */
var FlowRendererThumbnail = function (_FlowRenderer) {
  _inherits(FlowRendererThumbnail, _FlowRenderer);

  function FlowRendererThumbnail(settings) {
    _classCallCheck(this, FlowRendererThumbnail);

    var _this = _possibleConstructorReturn(this, (FlowRendererThumbnail.__proto__ || Object.getPrototypeOf(FlowRendererThumbnail)).call(this, settings));

    _this.type = 'thumbnail';
    return _this;
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */


  _createClass(FlowRendererThumbnail, [{
    key: 'transform',
    value: function transform(session, card) {
      var msg = new this.builder.Message(session);
      msg.attachments([_flowRendererHero2.default.buildCard(this.builder, session, card)]);
      return msg;
    }
  }]);

  return FlowRendererThumbnail;
}(_flowRenderer2.default);

exports.default = FlowRendererThumbnail;
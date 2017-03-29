'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowRenderer = require('../flow-renderer');

var _flowRenderer2 = _interopRequireDefault(_flowRenderer);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for rendering a text card.
 */
var FlowRendererHero = function (_FlowRenderer) {
  _inherits(FlowRendererHero, _FlowRenderer);

  function FlowRendererHero(settings) {
    _classCallCheck(this, FlowRendererHero);

    var _this = _possibleConstructorReturn(this, (FlowRendererHero.__proto__ || Object.getPrototypeOf(FlowRendererHero)).call(this, settings));

    _this.type = 'hero';
    return _this;
  }

  _createClass(FlowRendererHero, [{
    key: 'transform',


    /**
     * Transform the given card to the message builder.
     * 
     * @param { Object } session Chat session for building the message.
     * @param { Object } card Card to be transformed.
     */
    value: function transform(session, card) {
      var msg = new this.builder.Message(session);
      msg.attachments([FlowRendererHero.buildCard(this.builder, session, card)]);
      return msg;
    }
  }], [{
    key: 'buildCard',
    value: function buildCard(builder, session, card) {
      var result = void 0;
      if (card.type === 'hero') {
        result = new builder.HeroCard(session);
      } else if (card.type === 'thumbnail') {
        result = new builder.ThumbnailCard(session);
      } else {
        throw new Error('Unknown type for card');
      }
      if (card.title) {
        result.title(card.title);
      }
      if (card.subtitle) {
        result.subtitle(card.subtitle);
      }
      if (card.text) {
        result.text(card.text);
      }
      if (card.image) {
        var images = card.image;
        if (!_lodash2.default.isArray(images)) {
          images = [images];
        }
        var imagearr = [];
        for (var i = 0; i < images.length; i++) {
          imagearr.push(builder.CardImage.create(session, images[i]));
        }
        result.images(imagearr);
      }
      if (card.tap) {
        var taptype = card.tap.type.toLowerCase();
        if (taptype === 'openurl') {
          result.tap(builder.CardAction.openUrl(session, card.tap.url));
        } else if (taptype === 'imback') {
          result.tap(builder.CardAction.imBack(session, card.tap.value));
        }
      }
      if (card.buttons && card.buttons.length > 0) {
        var buttonarr = [];
        for (var _i = 0; _i < card.buttons.length; _i++) {
          var button = card.buttons[_i];
          var _taptype = button.type.toLowerCase();
          if (_taptype === 'openurl') {
            buttonarr.push(builder.CardAction.openUrl(session, button.url, button.title));
          } else if (_taptype === 'imback') {
            buttonarr.push(builder.CardAction.imBack(session, button.value, button.title));
          }
        }
        result.buttons(buttonarr);
      }
      return result;
    }
  }]);

  return FlowRendererHero;
}(_flowRenderer2.default);

exports.default = FlowRendererHero;
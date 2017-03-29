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
var FlowRendererReceipt = function (_FlowRenderer) {
  _inherits(FlowRendererReceipt, _FlowRenderer);

  function FlowRendererReceipt(settings) {
    _classCallCheck(this, FlowRendererReceipt);

    var _this = _possibleConstructorReturn(this, (FlowRendererReceipt.__proto__ || Object.getPrototypeOf(FlowRendererReceipt)).call(this, settings));

    _this.type = 'receipt';
    return _this;
  }

  _createClass(FlowRendererReceipt, [{
    key: 'setTile',
    value: function setTile(msg, card) {
      if (card.title) {
        msg.title(card.title);
      }
    }
  }, {
    key: 'setTax',
    value: function setTax(msg, card) {
      if (card.tax) {
        msg.tax(card.tax);
      }
    }
  }, {
    key: 'setTotal',
    value: function setTotal(msg, card) {
      if (card.total) {
        msg.total(card.total);
      }
    }
  }, {
    key: 'setFacts',
    value: function setFacts(session, msg, card) {
      if (card.facts && card.facts.length > 0) {
        var facts = [];
        for (var i = 0; i < card.facts; i++) {
          var fact = this.builder.Fact.create(session, card.facts[i].value, card.facts[i].key);
          facts.push(fact);
        }
        msg.facts(facts);
      }
    }
  }, {
    key: 'setItems',
    value: function setItems(session, msg, card) {
      if (card.items && card.items.length > 0) {
        var items = [];
        for (var i = 0; i < card.items; i++) {
          var item = this.builder.ReceiptItem.create(session, card.items[i].value, card.items[i].key);
          if (card.items[i].quantity) {
            item.quantity(card.items[i].quantity);
          }
          if (card.items[i].image) {
            item.image(this.builder.CardImage.create(session, card.items[i].image));
          }
        }
        msg.items(items);
      }
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
      var msg = new this.builder.ReceiptCard(session);
      this.setTitle(msg, card);
      this.setFacts(session, msg, card);
      this.setItems(session, msg, card);
      this.setTax(msg, card);
      this.setTotal(msg, card);
    }
  }]);

  return FlowRendererReceipt;
}(_flowRenderer2.default);

exports.default = FlowRendererReceipt;
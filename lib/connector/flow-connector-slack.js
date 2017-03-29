'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowConnector = require('./flow-connector');

var _flowConnector2 = _interopRequireDefault(_flowConnector);

var _client = require('@slack/client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for an Slack RTM connector for the Microsoft Bot Framework.
 * 
 * Currently is a draft, so it only works with text messages. 
 */
var FlowConnectorSlack = function (_FlowConnector) {
  _inherits(FlowConnectorSlack, _FlowConnector);

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Instance settings.
   */
  function FlowConnectorSlack(settings) {
    _classCallCheck(this, FlowConnectorSlack);

    var _this = _possibleConstructorReturn(this, (FlowConnectorSlack.__proto__ || Object.getPrototypeOf(FlowConnectorSlack)).call(this, settings));

    var botToken = settings.botToken || process.env.SLACK_BOT_TOKEN;
    _this.rtm = new _client.RtmClient(botToken);
    _this.web = new _client.WebClient(botToken);

    _this.rtm.on(_client.CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
      if (this.onAuthentication) {
        this.onAuthentication(this, rtmStartData);
      }
    });
    _this.rtm.on(_client.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENEND, function () {
      if (this.onConnectionOpened) {
        this.onConnectionOpened(this);
      }
    });
    _this.rtm.on(_client.RTM_EVENTS.MESSAGE, function (message) {
      if (this.onMessage) {
        this.onMessage(this, message);
      }
      this.listenMessage(message);
    }.bind(_this));
    _this.rtm.start();
    return _this;
  }

  /**
   * Listen a message from the RTM connection with slack.
   * 
   * @param { Object } message Message received.
   */


  _createClass(FlowConnectorSlack, [{
    key: 'listenMessage',
    value: function listenMessage(message) {
      var id = message.team + '-' + message.user + '-' + message.ts;
      var date = new Date(message.ts * 1000);
      var msg = this.getDefaultIncomingMessage('slack', id, date, message);
      msg.user.id = message.user;
      msg.text = message.text ? message.text || '' : '';
      msg.address.from.id = message.channel;
      msg.address.user = {};
      msg.address.user.id = message.user;
      this.onEventHandler([msg]);
    }

    /**
     * Get the output messages for sending to the client.
     * Gets the messages in Microsoft Bot Framework message format, and convert
     * them to the client format.
     * 
     * @param { Object } messages Input messages.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'getOutputMessages',
    value: function getOutputMessages(messages, cb) {
      var result = [];
      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        if (message.text) {
          result.push({
            text: message.text,
            address: message.address.from.id
          });
        }
      }
      cb(null, result);
    }

    /**
     * Sends one message to the client.
     * 
     * @param { Object } message Output message (client format).
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'sendMessage',
    value: function sendMessage(message, cb) {
      this.rtm.sendMessage(message.text, message.address);
      cb(null, message);
    }
  }]);

  return FlowConnectorSlack;
}(_flowConnector2.default);

exports.default = FlowConnectorSlack;
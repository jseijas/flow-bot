'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flowConnector = require('./flow-connector');

var _flowConnector2 = _interopRequireDefault(_flowConnector);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowConnectorFacebook = function (_FlowConnector) {
  _inherits(FlowConnectorFacebook, _FlowConnector);

  function FlowConnectorFacebook(settings) {
    _classCallCheck(this, FlowConnectorFacebook);

    return _possibleConstructorReturn(this, (FlowConnectorFacebook.__proto__ || Object.getPrototypeOf(FlowConnectorFacebook)).call(this, settings));
  }

  /**
   * Verify the request.
   * 
   * @param { Object } req Input request.
   * @param { Object } res Output response.
   * @param { Function } cb Function Callback.
   */


  _createClass(FlowConnectorFacebook, [{
    key: 'verifyRequest',
    value: function verifyRequest(req, res, cb) {
      var verifyToken = this.getQueryParameter(req, 'hub.verify_token');
      var challenge = this.getQueryParameter(req, 'hub.challenge');
      if (verifyToken === this.settings.verifyToken) {
        res.send(challenge);
        return cb();
      } else {
        res.send('Wrong token');
        return cb(new Error('Wrong token'));
      }
    }

    /**
     * Validate the body of an incoming message.
     * During the validation, the response can be used, so a message can be send
     * in return with a status.
     * 
     * @param { Object } req Input request.
     * @param { Object } res Output response.
     * @param { Function } cb Callback Function.
     */

  }, {
    key: 'validateBody',
    value: function validateBody(req, res, cb) {
      var hmac = _crypto2.default.createHmac('sha1', this.settings.appSecret);
      hmac.update(JSON.stringify(req.body));
      if (req.headers['x-hub-signature'] !== 'sha1=' + hmac.digest('hex')) {
        this.log('warn', 'Facebook wrong signature! ' + req.headers['x-hub-signature']);
        res.end(JSON.stringify({
          status: 'not ok', error: 'Message integrity check failed'
        }));
        return cb(new Error('Message integrity check failed'));
      }
      return cb();
    }

    /**
     * Generates a Microsoft message from a source facebook message entry.
     *
     * @param source { Object } Facebook message entry.
     * @returns { Object } Microsoft framework message.
     */

  }, {
    key: 'generateInputMessage',
    value: function generateInputMessage(source) {
      var time = source.timestamp;
      var date = new Date(time);
      var result = this.getDefaultIncomingMessage('facebook', time, date, source);
      result.user.id = source.sender.id;
      result.text = source.message ? source.message.text || '' : '';
      result.address.from.id = source.sender.id;
      result.address.conversation.id = source.sender.id;
      result.address.recipient.id = source.recipient.id;
      return result;
    }

    /**
     * Get the input messages from the request.
     * Gets the messages from the client format, and convert into the 
     * Microsoft Bot Framework message format.
     * 
     * @param { Object } req Input request.
     * @param { Object } res Output response.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'getInputMessages',
    value: function getInputMessages(req, res, cb) {
      var messages = _lodash2.default.isArray(req.body) ? req.body : [req.body];
      var result = [];
      for (var i = 0; i < messages.length; i++) {
        var msg = messages[i].entry[0];
        for (var j = 0; j < msg.messaging.length; j++) {
          result.push(this.generateInputMessage(msg.messaging[i]));
        }
      }
      return cb(null, result);
    }

    /**
     * Generates a Facebook message from a Microsoft message.
     *
     * @param source { Object } Microsoft message.
     * @returns { Object } Facebook message.
     */

  }, {
    key: 'generateOutputMessage',
    value: function generateOutputMessage(source) {
      var result = {
        recipient: {
          id: source.address.from.id
        },
        message: {
          text: source.text
        }
      };
      return result;
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
        result.push(this.generateOutputMessage(messages[i]));
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
      if (_lodash2.default.isArray(message)) {
        message = message[0];
      }
      var obj = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          'access_token': this.settings.accessToken
        },
        method: 'POST',
        json: message
      };
      (0, _request2.default)(obj, function (error, response) {
        if (error) {
          return cb(error);
        }
        if (response.body.error) {
          return cb(response.body.error);
        }
        return cb(null, response.body);
      });
    }
  }]);

  return FlowConnectorFacebook;
}(_flowConnector2.default);

exports.default = FlowConnectorFacebook;
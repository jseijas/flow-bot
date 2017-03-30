'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for a connector valid for the Microsoft Bot Framework.
 * 
 * This is an abstract class, so must be implemented.
 * 
 * The Microsoft Bot Framework injects 2 handlers: 
 * the event handler and the invoke handler.
 * 
 * A verify listener can be needed from the framework, the sons of this
 * class can modify the verify behaviour by overriding the "verifyRequest""
 * method.
 * 
 * A listen listener is used in order to receive messages from an endpoint.
 * The messages received at the listener can be validated overriding the
 * "validateBody" method. Then are dispatched by the dispatch method.
 * The dispatch method call to the method "getInputMessages" that must be
 * overrided and is the one that converts the received message to the 
 * format of Microsoft Bot Framework.
 * 
 * A send method is used in order to send messages to the channel. The
 * method "getOutputMessages" must be overrided, it is the one that transforms
 * from the Microsoft Bot Framework format into the channel format. Then
 * override the "sendMessage" method, that is the one that sends one message.
 */
var FlowConnector = function () {

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Instance settings.
   */
  function FlowConnector(settings) {
    _classCallCheck(this, FlowConnector);

    this.settings = settings || {};
    this.initialization();
  }

  /**
   * Initialization of the instance.
   */


  _createClass(FlowConnector, [{
    key: 'initialization',
    value: function initialization() {}

    /**
     * Logs a message if a logger exists.
     * 
     * @param { String } level Level of the message.
     * @param { String } message Message to be logged.
     */

  }, {
    key: 'log',
    value: function log(level, message) {
      if (this.settings.logger) {
        this.settings.logger.log(level, message);
      }
    }

    /**
     * Build the body of a request.
     * 
     * @param { Object } req Input request.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'retrieveBody',
    value: function retrieveBody(req, cb) {
      if (req.method !== 'POST') {
        return cb();
      }
      if (req.body) {
        return cb();
      }
      var requestData = '';
      req.on('data', function (chunk) {
        requestData += chunk;
      });
      req.on('end', function () {
        req.body = JSON.parse(requestData);
        return cb();
      });
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
      cb();
    }

    /**
     * Receives the event handler.
     * 
     * @param { Function } handler Event handler.
     */

  }, {
    key: 'onEvent',
    value: function onEvent(handler) {
      this.onEventHandler = handler;
    }

    /**
     * Receives the invoke handler.
     * 
     * @param { Function } handler Invoke handler.
     */

  }, {
    key: 'onInvoke',
    value: function onInvoke(handler) {
      this.onInvokeHandler = handler;
    }

    /**
     * Verify the request.
     * 
     * @param { Object } req Input request.
     * @param { Object } res Output response.
     * @param { Function } cb Function Callback.
     */

  }, {
    key: 'verifyRequest',
    value: function verifyRequest(req, res, cb) {
      res.status(200);
      res.end();
      cb();
    }

    /**
     * Verify listener. Returns a function for verifying the request.
     * 
     * @returns { Function } Verify function.
     */

  }, {
    key: 'verify',
    value: function verify() {
      return function (req, res) {
        _async2.default.series([this.retrieveBody.bind(this, req), this.verifyRequest.bind(this, req, res)], function (error) {
          this.log('error', error);
        }.bind(this));
      }.bind(this);
    }

    /**
     * Listen. Returns a function for listening.
     * 
     * @returns { Function } Listen function.
     */

  }, {
    key: 'listen',
    value: function listen() {
      return function (req, res) {
        _async2.default.series([this.retrieveBody.bind(this, req), this.validateBody.bind(this, req, res), this.dispatch.bind(this, req, res)], function (error) {
          this.log('error', error);
        }.bind(this));
      }.bind(this);
    }

    /**
     * Indicates if the message is an invoke message.
     * 
     * @param { Object } message Input message.
     * @return { Boolean } True if the message is an invoke message, false otherwise.
     */

  }, {
    key: 'isInvoke',
    value: function isInvoke(message) {
      return message && message.type && message.type.toLowerCase() === 'invoke';
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
      cb(null, req.body);
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
      cb(null, messages);
    }

    /**
     * Dispatcher of the messages. Dispatch the messages from the bot to the 
     * client.
     * 
     * @param { Object } req Input request.
     * @param { Object } res Output response.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'dispatch',
    value: function dispatch(req, res, cb) {
      try {
        this.getInputMessages(req, res, function (error, messages) {
          if (error) {
            return cb(error);
          }
          for (var i = 0; i < messages.length; i++) {
            var msg = messages[i];
            if (this.isInvoke(msg)) {
              this.onInvokeHandler(msg, function (err, body, status) {
                if (err) {
                  this.log('error', err);
                  res.status(500);
                  res.end();
                  return cb(err);
                }
                res.send(status || 200, body);
              });
            } else {
              this.onEventHandler([msg]);
              res.status(202);
              res.end();
              return cb();
            }
          }
          if (this.settings.autoResponse === true) {
            res.status(200);
            res.end();
          }
          cb();
        }.bind(this));
      } catch (err) {
        this.log('error', err);
        res.status(500);
        res.end();
        cb(err);
      }
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
      cb(null, message);
    }

    /**
     * Sends messages to the client.
     * The messages are in Microsoft Bot Framework format,
     * so must be converted to the client format, and then sent one by one.
     * 
     * @param { Object[] } messages Array of messages.
     * @param { Function } done Callback function.
     */

  }, {
    key: 'send',
    value: function send(messages, done) {
      this.getOutputMessages(messages, function (error, messages) {
        if (error) {
          return done();
        }
        _async2.default.mapSeries(messages, this.sendMessage.bind(this), function (error, res) {
          if (error) {
            this.log('error', error);
          }
          done();
        }.bind(this));
      }.bind(this));
    }

    /**
     * Get a query parameter from the request, by the name.
     * 
     * @param { Object } req Input request.
     * @param { String } name Name of the parameter.
     * @returns { String } Value of the parameter.
     */

  }, {
    key: 'getQueryParameter',
    value: function getQueryParameter(req, name) {
      var result = req[name];
      if (!result && req.query) {
        result = req.query[name];
      }
      return result;
    }
  }, {
    key: 'getDefaultIncomingMessage',
    value: function getDefaultIncomingMessage(channel, id, date, source) {
      return {
        type: 'message',
        id: id,
        timestamp: (0, _moment2.default)(date).format(),
        channelId: channel,
        user: {
          id: ''
        },
        text: '',
        attachment: [],
        entities: [],
        sourceEvent: source,
        address: {
          id: id,
          channelId: channel,
          from: {
            id: ''
          },
          recipient: {
            id: ''
          },
          conversation: {
            isGroup: false,
            id: ''
          }
        }
      };
    }
  }]);

  return FlowConnector;
}();

exports.default = FlowConnector;
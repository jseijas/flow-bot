import FlowConnector from './flow-connector';
import crypto from 'crypto';
import _ from 'lodash';
import request from 'request';

class FlowConnectorFacebook extends FlowConnector {
  constructor(settings) {
    super(settings);
  }

  /**
   * Verify the request.
   * 
   * @param { Object } req Input request.
   * @param { Object } res Output response.
   * @param { Function } cb Function Callback.
   */
  verifyRequest(req, res, cb) {
    let verifyToken = this.getQueryParameter(req, 'hub.verify_token');
    let challenge = this.getQueryParameter(req, 'hub.challenge');
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
  validateBody(req, res, cb) {
    let hmac = crypto.createHmac('sha1', this.settings.appSecret);
    hmac.update(JSON.stringify(req.body));
    if (req.headers['x-hub-signature'] !== `sha1=${hmac.digest('hex')}`) {
      this.log('warn', 'Facebook wrong signature! '+req.headers['x-hub-signature']);
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
  generateInputMessage(source) {
    var time = source.timestamp;
    var date = new Date(time);
    var result = this.getDefaultIncomingMessage('facebook', time, date, source);
    result.user.id = source.sender.id;
    result.text = source.message ? (source.message.text || '') : '';
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
  getInputMessages(req, res, cb) {
    let messages = _.isArray(req.body) ? req.body : [req.body];
    let result = [];
    for (let i = 0; i < messages.length; i++) {
      let msg = messages[i].entry[0];
      for (let j = 0; j < msg.messaging.length; j++) {
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
  generateOutputMessage(source) {
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
  getOutputMessages(messages, cb) {
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
  sendMessage(message, cb) {
    if (_.isArray(message)) {
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
    request(obj, function(error, response) {
      if (error) {
        return cb(error);
      }
      if (response.body.error) {
        return cb(response.body.error);
      }
      return cb(null, response.body);
    });
  }
  
}

export default FlowConnectorFacebook;
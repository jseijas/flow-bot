import FlowConnector from './flow-connector';
import { RtmClient } from '@slack/client';
import { CLIENT_EVENTS } from '@slack/client';
import { RTM_EVENTS } from '@slack/client';
import { WebClient } from '@slack/client';

/**
 * Class for an Slack RTM connector for the Microsoft Bot Framework.
 * 
 * Currently is a draft, so it only works with text messages. 
 */
class FlowConnectorSlack extends FlowConnector {

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Instance settings.
   */
  constructor(settings) {
    super(settings);
    let botToken = settings.botToken || process.env.SLACK_BOT_TOKEN;
    this.rtm = new RtmClient(botToken);
    this.web = new WebClient(botToken);

    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
      if (this.onAuthentication) {
        this.onAuthentication(this, rtmStartData);
      }
    });
    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENEND, function() {
      if (this.onConnectionOpened) {
        this.onConnectionOpened(this);
      }
    });
    this.rtm.on(RTM_EVENTS.MESSAGE, function(message) {
      if (this.onMessage) {
        this.onMessage(this, message);
      }
      this.listenMessage(message);
    }.bind(this));
    this.rtm.start();
  }

  /**
   * Listen a message from the RTM connection with slack.
   * 
   * @param { Object } message Message received.
   */
  listenMessage(message) {
    let id = message.team+'-'+message.user+'-'+message.ts;
    let date = new Date(message.ts*1000);
    let msg = this.getDefaultIncomingMessage('slack', id, date, message);
    msg.user.id = message.user;
    msg.text = message.text ? (message.text || '') : '';
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
  getOutputMessages(messages, cb) {
    let result = [];
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
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
  sendMessage(message, cb) {
    this.rtm.sendMessage(message.text, message.address);
    cb(null, message);
  }
}

export default FlowConnectorSlack;
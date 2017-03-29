import FlowConnector from './flow-connector';
import _ from 'lodash';

/**
 * Class for a Multi Connector. This is a connector, compatible with the 
 * Microsoft Bot Framework, that is able to act as a hub for different
 * connectors by channel.
 * 
 * Example: you can have your own connectors for facebook, slack, etc so 
 * the communication of your bot backend is direct with the channel without
 * going through the Microsoft servers, and you can be able to have the same
 * bot connected at the same time to the different channels. One of the 
 * connector that you can add is the builder.ChatConnector.
 * 
 * Each connector can be target several channels. That way, for example, you
 * can have a custom connector for facebook, but all the other channels going
 * through the builder.ChatConnector.
 * 
 * You can add a default connector by simply add the connector to a channel
 * called 'default'.
 */
class FlowMultiConnector extends FlowConnector {

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    this.connectors = {};
  }

  /**
   * Add a connector, telling the target channels. The channels
   * can be an array of channels, or only one channel name.
   * 
   * @param { String[] } channels List of channels.
   * @param { Object } connector Connector for that channels.
   */
  addConnector(channels, connector) {
    if (!_.isArray(channels)) {
      channels = [channels];
    }
    for (let i = 0; i < channels.length; i++) {
      this.connectors[channels[i]] = connector;
    }
    connector.onEvent(this.onEventHandler);
    connector.onInvoke(this.onInvokeHandler);
  }

  /**
   * Get a connector given the channel name. If the channel does not
   * have a connector, then return the default connector.
   * 
   * @param { String } name Channel name.
   * @returns { Object } Connector for the given channel.
   */
  getConnector(name) {
    return this.connectors[name] || this.connectors['default'];
  }

  /**
   * Inject the event handler from the Microsoft Bot Framework.
   * This inject the event to all the connectors provided.
   * 
   * @param { Function } handler Microsoft Bot Framework event handler.
   */
  onEvent(handler) {
    super.onEvent(handler);
    for (let name in this.connectors) {
      this.connectors[name].onEvent(handler);
    }
  }

  /**
   * Inject the invoke handler from the Microsoft Bot Framework.
   * This inject the invoke handler to all the connectors provided.
   * 
   * @param { Function } handler Microsoft Bot Framework invoke handler.
   */
  onInvoke(handler) {
    super.onInvoke(handler);
    for (let name in this.connectors) {
      this.connectors[name].onInvoke(handler);
    }
  }

  /**
   * Verify function. The difference with the normal connectors is that a 
   * channel name must be provided.
   * 
   * @param { String } name Channel Name.
   * @returns { Function } Returns the verify function for this channel.
   */
  verify(name) {
    return this.getConnector(name).verify();
  }

  /**
   * Listen function. The difference with the normal connectors is that a 
   * channel name must be provided.
   * 
   * @param { String } name Channel Name.
   * @returns { Function } Returns the listen function for this channel.
   */
  listen(name) {
    return this.getConnector(name).listen();
  }

  /**
   * Sends messages to the client.
   * The messages are in Microsoft Bot Framework format,
   * so must be converted to the client format, and then sent one by one.
   * 
   * @param { Object[] } messages Array of messages.
   * @param { Function } done Callback function.
   */
  send(messages, done) {
    var msg = _.isArray(messages) ? messages[0] : messages;
    var name = msg.address.channelId;
    return this.getConnector(name).send(messages, done);
  }
}

export default FlowMultiConnector;
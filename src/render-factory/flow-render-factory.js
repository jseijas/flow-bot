import _ from 'lodash';
import FlowRendererText from './renderers/flow-renderer-text';
import FlowRendererImage from './renderers/flow-renderer-image';
import FlowRendererHero from './renderers/flow-renderer-hero';
import FlowRendererThumbnail from './renderers/flow-renderer-thumbnail';
import FlowRendererCarousel from './renderers/flow-renderer-carousel';
import FlowRendererList from './renderers/flow-renderer-list';
import FlowRendererPrompt from './renderers/flow-renderer-prompt';
import FlowRendererReceipt from './renderers/flow-renderer-receipt';

/**
 * Class for the Flow Renderer Factory.
 */
class FlowRenderFactory {

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  constructor(settings) {
    this.settings = settings;
    this.renderers = {};
    this.addDefaultRenderers();
  }

  /**
   * Add a renderer to a channel.
   * 
   * @param { String } channel Channel name.
   * @param { Object } renderer Renderer instance.
   */
  addRendererByChannel(channel, renderer) {
    if (!this.renderers[channel]) {
      this.renderers[channel] = {};
    }
    this.renderers[channel][renderer.type] = renderer;
  }

  /**
   * Add a renderer. The renderer must include the information about
   * then channels and the card type.
   * 
   * @param { Object } renderer Renderer instance.
   */
  addRenderer(renderer) {
    let channels = renderer.channels || ['default'];
    if (!_.isArray(channels)) {
      channels = [channels];
    }
    for (let i = 0; i < channels.length; i++) {
      this.addRendererByChannel(channels[i], renderer);
    }
  }

  /**
   * Get a renderer given the channel and the card type.
   * 
   * @param { String } channel Channel name.
   * @param { String } type Type of the card.
   * @returns { Object } Renderer for this channel and card type.
   */
  getRenderer(channel, type) {
    let renderer;
    if (this.renderers[channel]) {
      renderer = this.renderers[channel][type];
    }
    if (!renderer) {
      if (this.renderers['default']) {
        renderer = this.renderers['default'][type];
      }
    }
    return renderer;
  }

  /**
   * Adds the default renderers to the factory.
   */
  addDefaultRenderers() {
    this.addRenderer(new FlowRendererText(this.settings));
    this.addRenderer(new FlowRendererImage(this.settings));
    this.addRenderer(new FlowRendererHero(this.settings));
    this.addRenderer(new FlowRendererThumbnail(this.settings));
    this.addRenderer(new FlowRendererCarousel(this.settings));
    this.addRenderer(new FlowRendererList(this.settings));
    this.addRenderer(new FlowRendererPrompt(this.settings));
    this.addRenderer(new FlowRendererReceipt(this.settings));
  }

  /**
   * Get the channel name from the session instance.
   */
  getChannel(session) {
    return session.message.source;
  }

  /**
   * Render the card.
   */
  render(session, card, locale, variables) {
    let channel = this.getChannel(session);
    let renderer = this.getRenderer(channel, card.type);
    if (!renderer) {
      throw new Error('Error: renderer not found');
    }
    return renderer.render(session, card, locale, variables);
  }
}

export default FlowRenderFactory;
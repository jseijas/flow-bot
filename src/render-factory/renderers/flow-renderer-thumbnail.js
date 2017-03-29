import FlowRenderer from '../flow-renderer';
import FlowRendererHero from './flow-renderer-hero';
import _ from 'lodash';

/**
 * Class for rendering a text card.
 */
class FlowRendererThumbnail extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'thumbnail';
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    let msg = new this.builder.Message(session);
    msg.attachments([FlowRendererHero.buildCard(this.builder, session, card)]);
    return msg;
  }
}

export default FlowRendererThumbnail;
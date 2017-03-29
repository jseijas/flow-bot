import FlowRenderer from '../flow-renderer';

/**
 * Class for rendering an image card.
 */
class FlowRendererImage extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'image';
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    let msg = new this.builder.Message(session);
    for (let i = 0; i < card.images.length; i++) {
      msg.addAttachment(card.images[i]);
    }
    return msg;
  }
}

export default FlowRendererImage;
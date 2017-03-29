import FlowRenderer from '../flow-renderer';

/**
 * Class for rendering a text card.
 */
class FlowRendererText extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'text';
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    return new this.builder.Message(session).text(card.text);
  }
}

export default FlowRendererText;


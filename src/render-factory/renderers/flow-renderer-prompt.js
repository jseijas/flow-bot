import FlowRenderer from '../flow-renderer';

/**
 * Class for rendering a text card.
 */
class FlowRendererPrompt extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'prompt';
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    let promptType = card.prompt ? card.prompt : 'text';
    return this.launchPrompt(session, card);
  }
}

export default FlowRendererPrompt;
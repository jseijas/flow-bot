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
   * Choice renderer.
   */
  renderChoice(session, card) {
    let options = [];
    for (let i = 0; i < card.options.length; i++) {
      options.push(card.options[i].text);
    }
    let style = card.style ? { listStyle: this.builder.ListStyle[card.style] } : undefined;
    return this.builder.Prompts.choice(session, card.text, options, style);
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    let promptType = card.prompt ? card.prompt : 'text';
    if (promptType === 'choice') {
      return this.renderChoice(session, card);
    } else {
      return this.builder.Prompts[promptType](session, card.text);
    }
  }
}

export default FlowRendererPrompt;
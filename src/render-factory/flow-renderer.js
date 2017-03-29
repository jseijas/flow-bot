/**
 * Abstract class for a renderer.
 */
class FlowRenderer {
  /**
   * Constructor of the class. The settings must include the message builder
   * and the flow-template.
   * 
   * @param { Object } settings Settings for constructing the class.
   */
  constructor(settings) {
    this.settings = settings;
    this.builder = this.settings.builder;
    this.template = this.settings.template;
  }

  /**
   * Translate the given card, to the given locale, using the variables.
   * 
   * @param { Object } card Instance of the card to be translated.
   * @param { String } locale Locale code of the target language.
   * @param { Object } variables Variables for templating the card.
   */
  translate(card, locale, variables) {
    return this.template.translate(card, locale, variables);
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    throw new Error('This abstract method must be overrided');
  }

  /**
   * Render a card to the given session.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Instance of the card to be rendered.
   * @param { String } locale Locale code of the target language.
   * @param { Object } variables Variables for templating the card.
   */
  render(session, card, locale, variables) {
    let translatedCard = this.translate(card, locale, variables);
    session.dialogData.lastCard = translatedCard;
    return this.transform(session, translatedCard);
  }
}

export default FlowRenderer;

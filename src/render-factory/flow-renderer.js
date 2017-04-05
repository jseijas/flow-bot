import _ from 'lodash';

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
   * Indicates if the card is a prompt.
   * 
   * @param { Object } card Input card.
   * @returns { Boolean } True if the card is a prompt, false otherwise. 
   */
  containsPrompt(card) {
    return (card.prompt && card.prompt !== '');
  }

  launchPrompt(session, card) {
    if (card.prompt === 'choice') {
      if (_.isString(card.optionsStr)) {
        let tokens = card.optionsStr.split('|');
        card.options = [];
        for (let j = 0; j < tokens.length; j++) {
          card.options.push({ tag: tokens[j], text: tokens[j] });
        }
      }
      let options = [];
      for (let i = 0; i < card.options.length; i++) {
        options.push(card.options[i].text);
      }
      let style = card.style ? { listStyle: this.builder.ListStyle[card.style] } : undefined;
      return this.builder.Prompts.choice(session, card.text, options, style);
    } else {
      return this.builder.Prompts[card.prompt](session, card.text);
    }
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
    let result = this.transform(session, translatedCard);
    if ((this.containsPrompt(translatedCard)) && (translatedCard.type !== 'prompt')) {
      this.launchPrompt(session, translatedCard);
    }
    return result;
  }
}

export default FlowRenderer;

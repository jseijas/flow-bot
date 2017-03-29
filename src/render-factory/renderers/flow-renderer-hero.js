import FlowRenderer from '../flow-renderer';
import _ from 'lodash';

/**
 * Class for rendering a text card.
 */
class FlowRendererHero extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'hero';
  }

  static buildCard(builder, session, card) {
    let result;
    if (card.type === 'hero') {
      result = new builder.HeroCard(session);
    } else if (card.type === 'thumbnail') {
      result = new builder.ThumbnailCard(session);
    } else {
      throw new Error('Unknown type for card');
    }
    if (card.title) {
      result.title(card.title);
    }
    if (card.subtitle) {
      result.subtitle(card.subtitle);
    }
    if (card.text) {
      result.text(card.text);
    }
    if (card.image) {
      let images = card.image;
      if (!_.isArray(images)) {
        images = [images];
      }
      let imagearr = [];
      for (let i = 0; i < images.length; i++) {
        imagearr.push(builder.CardImage.create(session, images[i]));
      }
      result.images(imagearr);
    }
    if (card.tap) {
      let taptype = card.tap.type.toLowerCase();
      if (taptype === 'openurl') {
        result.tap(builder.CardAction.openUrl(session, card.tap.url));
      } else if (taptype === 'imback') {
        result.tap(builder.CardAction.imBack(session, card.tap.value));
      }
    }
    if (card.buttons && card.buttons.length > 0) {
      let buttonarr = [];
      for (let i = 0; i < card.buttons.length; i++) {
        let button = card.buttons[i];
        let taptype = button.type.toLowerCase();
        if (taptype === 'openurl') {
          buttonarr.push(builder.CardAction.openUrl(session, button.url, button.title));
        } else if (taptype === 'imback') {
          buttonarr.push(builder.CardAction.imBack(session, button.value, button.title));
        }
      }
      result.buttons(buttonarr);
    }
    return result;
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

export default FlowRendererHero;
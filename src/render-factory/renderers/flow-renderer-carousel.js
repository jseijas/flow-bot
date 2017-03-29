import FlowRenderer from '../flow-renderer';
import FlowRendererHero from './flow-renderer-hero';
import _ from 'lodash';

/**
 * Class for rendering a carousel card.
 */
class FlowRendererCarousel extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'carousel';
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    let result = new this.builder.Message(session)
      .textFormat(this.builder.TextFormat.xml)
      .attachmentLayout(this.builder.AttachmentLayout.carousel);
    let arr = [];
    for (let i = 0; i < card.cards.length; i++) {
      let soncard = card.cards[i];
      if (_.isString(soncard)) {
        soncard = this.settings.parent.getCard(soncard);
      }
      arr.push(FlowRendererHero.buildCard(this.builder, session, soncard));
    }
    result.attachments(arr);
    return result;
  }
}

export default FlowRendererCarousel;


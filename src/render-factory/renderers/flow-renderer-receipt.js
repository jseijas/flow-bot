import FlowRenderer from '../flow-renderer';

/**
 * Class for rendering a text card.
 */
class FlowRendererReceipt extends FlowRenderer {
  constructor(settings) {
    super(settings);
    this.type = 'receipt';
  }

  setTile(msg, card) {
    if (card.title) {
      msg.title(card.title);
    }
  }

  setTax(msg, card) {
    if (card.tax) {
      msg.tax(card.tax);
    }
  }

  setTotal(msg, card) {
    if (card.total) {
      msg.total(card.total);
    }
  }

  setFacts(session, msg, card) {
    if (card.facts && card.facts.length > 0) {
      let facts = [];
      for (let i = 0; i < card.facts; i++) {
        let fact = this.builder.Fact.create(session, card.facts[i].value, card.facts[i].key);
        facts.push(fact);
      }
      msg.facts(facts);
    }
  }

  setItems(session, msg, card) {
    if (card.items && card.items.length > 0) {
      let items = [];
      for (let i = 0; i < card.items; i++) {
        let item = this.builder.ReceiptItem.create(session, card.items[i].value, card.items[i].key);
        if (card.items[i].quantity) {
          item.quantity(card.items[i].quantity);
        }
        if (card.items[i].image) {
          item.image(this.builder.CardImage.create(session, card.items[i].image));
        }
      }
      msg.items(items);
    }
  }

  /**
   * Transform the given card to the message builder.
   * 
   * @param { Object } session Chat session for building the message.
   * @param { Object } card Card to be transformed.
   */
  transform(session, card) {
    let msg =  new this.builder.ReceiptCard(session);
    this.setTitle(msg, card);
    this.setFacts(session, msg, card);
    this.setItems(session, msg, card);
    this.setTax(msg, card);
    this.setTotal(msg, card);
  }
}

export default FlowRendererReceipt;


/**
 * Abstract Class for a Microsoft Bot Framework Intent Recognizer.
 */
class FlowRecognizer {

  /**
   * Constructor of the class.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.initializeModels();
  }

  /**
   * Initialize the models by locale. If the model provided is a string,
   * then will be the default model for any locale.
   */
  initializeModels() {
    this.models = this.settings.models || {};
    if (typeof this.models === 'string') {
      let key = this.models;
      this.models = {};
      this.addModel('*', key);
    }
  }

  /**
   * Log a message.
   * 
   * @param { String } level Level of the message.
   * @param { String } message Content of the message.
   */
  log(level, message) {
    if (this.settings.logger) {
      this.settings.logger.log(level, message);
    }
  }

  /**
   * Add a model for a set of locales.
   * 
   * @param { String[] } locales Array of locales for the model.
   * @param { String } key Key of the model.
   */
  addModel(locales, key) {
    if (typeof locales === 'string') {
      locales = [locales];
    }
    for (let i = 0; i < locales.length; i++) {
      this.models[locales[i]] = key;
    }
  }

  /**
   * Gets the model given the locale. If the model for this locale does not 
   * exists, then return the default model.
   * 
   * @param { String } locale Locale of the model.
   * @returns { String } Model for the given locale.
   */
  getModel(locale) {
    locale = locale || '*';
    let model = this.models[locale];
    if (!model) {
      model = this.models['*'];
    }
    return model;
  }

  /**
   * Given an utterance and a model, try to recognize the utterance,
   * returning the error (if exists), the intents and the entities recognized.
   * 
   * @param { String } utterance Utterance to be recognized.
   * @param { String } model Correct model for the recognition.
   * @param { Function } cb Callback Function.
   */
  recognizeUtterance(utterance, model, cb) {
    return cb();
  }

  /**
   * Given a context of a message, try to recognize the intents and entities.
   * 
   * @param { Object } context Session context of the received message.
   * @param { Function } cb Callback Function.
   */
  recognize(context, cb) {
    let result = { score: 0.0, intent: null };
    if (context && context.message && context.message.text) {
      let utterance = context.message.text;
      let model = this.getModel(context.locale);
      if (model) {
        this.recognizeUtterance(utterance, model, function(error, intents, entities) {
          if (error) {
            return cb(error);
          }
          result.intents = intents;
          result.entities = entities;
          let top;
          for (let i = 0; i < intents.length; i++) {
            if (!top || intents[i].score > top.score) {
              top = intents[i];
            }
          }
          if (top) {
            result.score = top.score;
            result.intent = top.intent;
            switch(top.intent.toLowerCase()) {
            case 'builtin.intent.none':
            case 'none':
              result.score = 0.1;
              break;
            }
          }
          return cb(null, result);
        });
      } else {
        return cb(new Error('Model not found for locale '+context.locale));
      }
    } else {
      return cb(null, result); 
    }
  }
}

export default FlowRecognizer;


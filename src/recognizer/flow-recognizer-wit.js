import FlowRecognizer from './flow-recognizer';
import nodewit from 'node-wit';

/**
 * Flow Recognizer for the WIT.ai NLP platform.
 */
class FlowRecognizerWit extends FlowRecognizer{

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    this.apps = {};
  }

  /**
   * Gets an application to connect to WIT.ai, given the model.
   * The applications are cached, so an instance per model will exists.
   */
  getApp(model) {
    if (!this.apps[model]) {
      this.apps[model] = new nodewit.Wit({ accessToken: model });
    }
    return this.apps[model];
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
    let app = this.getApp(model);
    try {
      app.message(utterance, {})
      .then(function(response) {
        if (response.error) {
          return cb(new Error(response.error));
        }
        let intents = [];
        let entities = [];
        for (let name in response.entities) {
          let entitylist = response.entities[name];
          if (name === 'intent') {
            for (let i = 0; i < entitylist.length; i++) {
              let entity = entitylist[i];
              intents.push({ score: entity.confidence, intent: entity.value });
            }
          } else {
            for (let i = 0; i < entitylist.length; i++) {
              let entity = entitylist[i];
              let resultentity = {
                entity: entity.value,
                score: entity.confidence,
                type: name,
                startIndex: -1,
                endIndex: -1
              };
              if (entity.type === 'value') {
                resultentity.startIndex = response._text.indexOf(entity.value);
                resultentity.endIndex = resultentity.startIndex+entity.value.length -1;
              }
              entities.push(resultentity);
            }
          }
        }
        return cb(null, intents, entities);
      }).catch(function(error) {
        return cb(error);
      });
    } catch(err) {
      return cb(err);
    }
  }
}

export default FlowRecognizerWit; 


import FlowRecognizer from './flow-recognizer';
import request from 'request';

/**
 * Flow Recognizer for the LUIS.ai NLP platform.
 */
class FlowRecognizerLuis extends FlowRecognizer{

  /**
   * Constructor of the class.
   * 
   * @param { Object } settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
  }

  /**
   * Given an utterance and a model, try to recognize the utterance,
   * returning the error (if exists), the intents and the entities recognized.
   * 
   * @param { String } utterance Utterance to be recognized.
   * @param { String } model Correct model for the recognition.
   * @param { Function } cb Callback Function.
   */
  recognizeUterrance(utterance, model, cb) {
    try {
      let uri = model.trim();
      if (uri.lastIndexOf('&q=') != uri.length -3) {
        uri += '&q=';
      }
      uri += encodeURIComponent(utterance || '');
      request.get(uri, function(err, res, body) {
        let result;
        try {
          if (!err) {
            result = JSON.parse(body);
            result.intents = result.intents || [];
            result.entities = result.entities || [];
            if (result.topScoringIntent && result.intents.length === 0) {
              result.intents.push(result.topScoringIntent);
            }
            if (result.intents.length === 1 && typeof result.intents[0].score !== 'number') {
              result.intents[0].score = 1.0;
            }
          }
        } catch (e) {
          err = e;
        }
        try {
          if (!err) {
            return cb(null, result.intents, result.entities);
          } else {
            return cb(err instanceof Error ? err : new Error(err.toString()));
          }
        } catch(e) {
          this.log('error', e.toString());
        }
      });

    } catch (err) {
      cb(err instanceof Error ? err : new Error(err.toString()));
    }
  }
}

export default FlowRecognizerLuis;


'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract Class for a Microsoft Bot Framework Intent Recognizer.
 */
var FlowRecognizer = function () {

  /**
   * Constructor of the class.
   */
  function FlowRecognizer(settings) {
    _classCallCheck(this, FlowRecognizer);

    this.settings = settings || {};
    this.initializeModels();
  }

  /**
   * Initialize the models by locale. If the model provided is a string,
   * then will be the default model for any locale.
   */


  _createClass(FlowRecognizer, [{
    key: 'initializeModels',
    value: function initializeModels() {
      this.models = this.settings.models || {};
      if (typeof this.models === 'string') {
        var key = this.models;
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

  }, {
    key: 'log',
    value: function log(level, message) {
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

  }, {
    key: 'addModel',
    value: function addModel(locales, key) {
      if (typeof locales === 'string') {
        locales = [locales];
      }
      for (var i = 0; i < locales.length; i++) {
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

  }, {
    key: 'getModel',
    value: function getModel(locale) {
      locale = locale || '*';
      var model = this.models[locale];
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

  }, {
    key: 'recognizeUtterance',
    value: function recognizeUtterance(utterance, model, cb) {
      return cb();
    }

    /**
     * Given a context of a message, try to recognize the intents and entities.
     * 
     * @param { Object } context Session context of the received message.
     * @param { Function } cb Callback Function.
     */

  }, {
    key: 'recognize',
    value: function recognize(context, cb) {
      var result = { score: 0.0, intent: null };
      if (context && context.message && context.message.text) {
        var utterance = context.message.text;
        var model = this.getModel(context.locale);
        if (model) {
          this.recognizeUtterance(utterance, model, function (error, intents, entities) {
            if (error) {
              return cb(error);
            }
            result.intents = intents;
            result.entities = entities;
            var top = void 0;
            for (var i = 0; i < intents.length; i++) {
              if (!top || intents[i].score > top.score) {
                top = intents[i];
              }
            }
            if (top) {
              result.score = top.score;
              result.intent = top.intent;
              switch (top.intent.toLowerCase()) {
                case 'builtin.intent.none':
                case 'none':
                  result.score = 0.1;
                  break;
              }
            }
            return cb(null, result);
          });
        } else {
          return cb(new Error('Model not found for locale ' + context.locale));
        }
      } else {
        return cb(null, result);
      }
    }
  }]);

  return FlowRecognizer;
}();

exports.default = FlowRecognizer;
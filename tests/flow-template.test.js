/* global it, describe */
import { expect } from 'chai';
import FlowTemplate from '../src/template/flow-template';
import card from './cards/card.json';

describe('Flow Template', () => {

  describe('Constructor', () => {
    it('Should construct an instance', () => {
      let instance = new FlowTemplate({ localesPath: __dirname+'/locales' });
      expect(instance).to.exist;
    });
  });

  describe('Translate a phrase', () => {
    it('Should translate using variables', () => {
      let instance = new FlowTemplate({ localesPath: __dirname+'/locales' });
      let view = {
        user: {
          name: 'Jesús'
        }
      };
      let translated = instance.translatePhrase('Hello {{ user.name }}, how are you today?', 'es', view);
      let expected = 'Hola Jesús, ¿cómo andas?';
      expect(translated).to.equal(expected);
    });
  });

  describe('Translate an object', () => {
    it('Should translate an object using variables', () => {
      let instance = new FlowTemplate({ localesPath: __dirname+'/locales' });
      let view = {
        user: {
          name: 'Jesús'
        }
      };
      let translated = instance.translate(card, 'es', view);
      let expected = {
        greet: 'Hola',
        greetUser: 'Hola Jesús, ¿cómo andas?'
      };
      expect(translated).to.deep.equal(expected);        
      
    });
  });

});

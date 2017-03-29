import i18n from 'i18n';
import FlowUtils from '../util/flow-util';
import _ from 'lodash';

class FlowTemplate {

  constructor(settings) {
    this.settings = settings || {};
    this.initialize();
  }

  initialize() {
    if (!this.settings.localesPath) {
      this.settings.localesPath = __dirname + '/locales';
    }
    if (!this.settings.defaultLocale) {
      this.settings.defaultLocale = 'en';
    }
    i18n.configure({
      directory: this.settings.localesPath,
      updateFiles: false
    });
    i18n.setLocale(this.settings.defaultLocale);
  }

  setDefaultLocale(locale) {
    i18n.setLocale(locale);
  }

  translatePhrase(phrase, locale, variables) {
    let options = {
      phrase: phrase,
      locale: locale
    };
    return i18n.__(options, variables);
  }

  traverseFn(locale, variables, name, obj) {
    return this.translatePhrase(obj, locale, variables);
  }

  translate(obj, locale, variables) {
    let result = _.clone(obj);
    FlowUtils.traverse(['string'], result, this.traverseFn.bind(this, locale, variables));
    return result;
  }
}

export default FlowTemplate;
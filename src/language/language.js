import languageData from './languages.json';
import franc from 'franc';

class Language {
  constructor() {
    this.languagesIso3 = {};
    this.languagesIso2 = {};
    this.buildData();
  }

  buildData() {
    for (let i = 0; i < languageData.length; i++) {
      let language = {
        iso3: languageData[i]['alpha3'],
        iso2: languageData[i]['alpha2'],
        name: languageData[i]['name']
      }
      this.languagesIso3[language.iso3] = language;
      this.languagesIso2[language.iso2] = language;
    }
  }

  transformWhitelist(whitelist) {
    let result = [];
    for (let i = 0; i < whitelist.length; i++) {
      if (whitelist[i].length === 3) {
        result.push(whitelist[i]);
      } else {
        let language = this.languagesIso2[whitelist[i]];
        if (language) {
          result.push(language.iso3);
        }
      }
    }
    return result;
  }

  guess(utterance, whitelist, limit) {
    let scores;
    if (whitelist && whitelist.length && whitelist.length > 0) {
      let whitelistIso3 = this.transformWhitelist(whitelist);
      scores = franc.all(utterance, { whitelist: whitelistIso3 });
    } else {
      scores = franc.all(utterance);
    }
    let result = [];
    for (let i = 0; i < scores.length; i++) {
      let language = this.languagesIso3[scores[i][0]];
      if (language) {
        result.push({
          iso3: language.iso3,
          iso2: language.iso2,
          language: language.name,
          score: scores[i][1]
        });
        if (limit && result.length >= limit) {
          break;
        }
      }
    }
    return result;
  }
}

export default Language;
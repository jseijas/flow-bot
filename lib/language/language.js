'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _languages = require('./languages.json');

var _languages2 = _interopRequireDefault(_languages);

var _franc = require('franc');

var _franc2 = _interopRequireDefault(_franc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Language = function () {
  function Language() {
    _classCallCheck(this, Language);

    this.languagesIso3 = {};
    this.languagesIso2 = {};
    this.buildData();
  }

  _createClass(Language, [{
    key: 'buildData',
    value: function buildData() {
      for (var i = 0; i < _languages2.default.length; i++) {
        var language = {
          iso3: _languages2.default[i]['alpha3'],
          iso2: _languages2.default[i]['alpha2'],
          name: _languages2.default[i]['name']
        };
        this.languagesIso3[language.iso3] = language;
        this.languagesIso2[language.iso2] = language;
      }
    }
  }, {
    key: 'transformWhitelist',
    value: function transformWhitelist(whitelist) {
      var result = [];
      for (var i = 0; i < whitelist.length; i++) {
        if (whitelist[i].length === 3) {
          result.push(whitelist[i]);
        } else {
          var language = this.languagesIso2[whitelist[i]];
          if (language) {
            result.push(language.iso3);
          }
        }
      }
      return result;
    }
  }, {
    key: 'guess',
    value: function guess(utterance, whitelist, limit) {
      var scores = void 0;
      if (whitelist && whitelist.length && whitelist.length > 0) {
        var whitelistIso3 = this.transformWhitelist(whitelist);
        scores = _franc2.default.all(utterance, { whitelist: whitelistIso3 });
      } else {
        scores = _franc2.default.all(utterance);
      }
      var result = [];
      for (var i = 0; i < scores.length; i++) {
        var language = this.languagesIso3[scores[i][0]];
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
  }]);

  return Language;
}();

exports.default = Language;
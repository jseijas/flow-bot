'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _flowUtil = require('../util/flow-util');

var _flowUtil2 = _interopRequireDefault(_flowUtil);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowTemplate = function () {
  function FlowTemplate(settings) {
    _classCallCheck(this, FlowTemplate);

    this.settings = settings || {};
    this.initialize();
  }

  _createClass(FlowTemplate, [{
    key: 'initialize',
    value: function initialize() {
      if (!this.settings.localesPath) {
        this.settings.localesPath = __dirname + '/locales';
      }
      if (!this.settings.defaultLocale) {
        this.settings.defaultLocale = 'en';
      }
      _i18n2.default.configure({
        directory: this.settings.localesPath,
        updateFiles: false
      });
      _i18n2.default.setLocale(this.settings.defaultLocale);
    }
  }, {
    key: 'setDefaultLocale',
    value: function setDefaultLocale(locale) {
      _i18n2.default.setLocale(locale);
    }
  }, {
    key: 'translatePhrase',
    value: function translatePhrase(phrase, locale, variables) {
      var options = {
        phrase: phrase,
        locale: locale
      };
      return _i18n2.default.__(options, variables);
    }
  }, {
    key: 'traverseFn',
    value: function traverseFn(locale, variables, name, obj) {
      return this.translatePhrase(obj, locale, variables);
    }
  }, {
    key: 'translate',
    value: function translate(obj, locale, variables) {
      var result = _lodash2.default.clone(obj);
      _flowUtil2.default.traverse(['string'], result, this.traverseFn.bind(this, locale, variables));
      return result;
    }
  }]);

  return FlowTemplate;
}();

exports.default = FlowTemplate;
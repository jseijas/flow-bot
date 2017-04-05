'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _flowRenderFactory = require('./render-factory/flow-render-factory');

var _flowRenderFactory2 = _interopRequireDefault(_flowRenderFactory);

var _flowStorage = require('./storage/flow-storage');

var _flowStorage2 = _interopRequireDefault(_flowStorage);

var _flowMultiConnector = require('./connector/flow-multi-connector');

var _flowMultiConnector2 = _interopRequireDefault(_flowMultiConnector);

var _flowRequireManager = require('./require-manager/flow-require-manager');

var _flowRequireManager2 = _interopRequireDefault(_flowRequireManager);

var _flowTemplate = require('./template/flow-template');

var _flowTemplate2 = _interopRequireDefault(_flowTemplate);

var _language = require('./language/language');

var _language2 = _interopRequireDefault(_language);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for a bot using the Flow Bot Framework.
 */
var FlowBot = function () {

  /**
   * Constructor of the class.
   */
  function FlowBot(settings, cb) {
    _classCallCheck(this, FlowBot);

    this.settings = settings || {};
    this.languageManager = new _language2.default();
    this.setDefaultSettings();
    this.observers = {};
    this.builder = _botbuilder2.default;
    this.createStorage();
    this.createTemplate();
    this.createConnector();
    this.createBot();
    this.createObservers();
    this.createRenderFactory();
    this.cardManager = new _flowRequireManager2.default({ logger: settings.logger, pattern: '*.json' });
    this.actionManager = new _flowRequireManager2.default({ logger: settings.logger, pattern: '*.js' });
    this.dialogManager = new _flowRequireManager2.default({ logger: settings.logger, pattern: '*.flow' });
    this.pluginManager = new _flowRequireManager2.default({ logger: settings.logger, pattern: '*.js' });
    this.createCards(function (err) {
      if (err) {
        this.log('error', err);
      }
      this.log('info', 'now will load plugins');
      this.createPlugins(function (err) {
        if (err) {
          this.log('error', err);
        }
        this.log('info', 'now will load actions');
        this.createActions(function (err) {
          if (err) {
            this.log('error', err);
          }
          this.createDialogs(function (err) {
            if (err) {
              this.log('error', err);
            }
            this.buildDialogs();
            if (this.constructorMethod) {
              this.constructorMethod.method.bind(this)(function (err) {
                if (err) {
                  this.log('error', err);
                }
                if (cb) {
                  cb();
                }
              });
            } else {
              if (cb) {
                cb();
              }
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  _createClass(FlowBot, [{
    key: 'setDefaultSettings',
    value: function setDefaultSettings() {
      if (!this.settings.defaultLocale) {
        this.settings.defaultLocale = 'en';
      }
      if (!this.settings.botPath) {
        this.settings.botPath = './bot';
      }
      if (!this.settings.localesPath) {
        this.settings.localesPath = this.settings.botPath + '/locales';
      }
      if (!this.settings.cardPath) {
        this.settings.cardPath = this.settings.botPath + '/cards';
      }
      if (!this.settings.actionPath) {
        this.settings.actionPath = this.settings.botPath + '/actions';
      }
      if (!this.settings.pluginPath) {
        this.settings.pluginPath = this.settings.botPath + '/plugins';
      }
      if (!this.settings.dialogPath) {
        this.settings.dialogPath = this.settings.botPath + '/dialogs';
      }
    }
  }, {
    key: 'log',
    value: function log(level, message) {
      if (this.settings.logger) {
        this.settings.logger.log(level, message);
      } else {
        console.log(level.toUpperCase() + ': ' + message);
      }
    }
  }, {
    key: 'createStorage',
    value: function createStorage() {
      this.storage = this.settings.storage || new _flowStorage2.default();
      delete this.settings['storage'];
    }
  }, {
    key: 'createTemplate',
    value: function createTemplate() {
      if (!this.settings.template) {
        var opts = {
          localesPath: this.settings.localesPath,
          defaultLocale: this.settings.defaultLocale
        };
        try {
          this.settings.template = new _flowTemplate2.default(opts);
        } catch (err) {
          this.log('error', 'Error creating template and locales');
          this.log('error', err);
        }
      }
      this.template = this.settings.template;
      delete this.settings['template'];
    }
  }, {
    key: 'createConnector',
    value: function createConnector() {
      if (this.settings.connector) {
        return this.connector = this.settings.connector;
      }
      this.connector = new _flowMultiConnector2.default();
      if (this.settings.defaultConnector) {
        this.connector.addConnector('default', this.settings.defaultConnector);
      } else {
        var botAppId = this.settings.botAppId || process.env.BOT_APP_ID;
        var pass = this.settings.botAppPassword || process.env.BOT_APP_PASSWORD;
        var microsoftConnector = new _botbuilder2.default.ChatConnector({
          appId: botAppId,
          appPassword: pass
        });
        this.connector.addConnector('default', microsoftConnector);
      }
      if (this.settings.consoleConnector === true) {
        var consoleConnector = new _botbuilder2.default.ConsoleConnector();
        this.connector.addConnector('console', consoleConnector);
        consoleConnector.listen();
      }
    }
  }, {
    key: 'createBot',
    value: function createBot() {
      this.bot = new _botbuilder2.default.UniversalBot(this.connector);
    }
  }, {
    key: 'observeEvent',
    value: function observeEvent(name, message) {
      if (this.observers[name]) {
        for (var observer in this.observers[name]) {
          observer(message);
        }
      }
    }
  }, {
    key: 'createObservers',
    value: function createObservers() {
      var eventNames = ['contactRelationUpdate', 'deleteUserData', 'message', 'ping', 'typing', 'conversationUpdate'];
      for (var eventName in eventNames) {
        this.bot.on(eventName, this.observeEvent.bind(this, eventName));
      }
    }
  }, {
    key: 'createRenderFactory',
    value: function createRenderFactory() {
      this.renderFactory = new _flowRenderFactory2.default({ template: this.template, builder: _botbuilder2.default, parent: this });
    }
  }, {
    key: 'getAbsolutePath',
    value: function getAbsolutePath(relative) {
      return _path2.default.normalize(_path2.default.join(process.cwd(), relative));
    }
  }, {
    key: 'isPrompt',
    value: function isPrompt(item) {
      return item.type === 'prompt' || item.prompt && item.prompt !== '';
    }
  }, {
    key: 'isChoice',
    value: function isChoice(item) {
      return this.isPrompt(item) && item.prompt === 'choice';
    }
  }, {
    key: 'addCard',
    value: function addCard(item) {
      this.cardManager.addItem(item);
      if (this.isChoice(item) && _lodash2.default.isString(item.options)) {
        var tokens = item.options.split('|');
        item.options = [];
        for (var j = 0; j < tokens.length; j++) {
          item.options.push({ tag: tokens[j], text: tokens[j] });
        }
      }
    }
  }, {
    key: 'createCards',
    value: function createCards(cb) {
      this.log('info', 'Loading cards from folder');
      if (this.settings.cardPath) {
        this.log('info', 'Loading card from folder ' + this.settings.cardPath);
        this.cardManager.addFolder(this.settings.cardPath, function (error, items) {
          if (error) {
            return cb(error);
          }
          for (var name in this.cardManager.items) {
            var item = this.cardManager.items[name];
            if (this.isChoice(item) && _lodash2.default.isString(item.options)) {
              var tokens = item.options.split('|');
              item.options = [];
              for (var j = 0; j < tokens.length; j++) {
                item.options.push({ tag: tokens[j], text: tokens[j] });
              }
            }
          }
          return cb(error, items);
        }.bind(this));
      } else {
        this.log('info', 'No card folder defined');
        cb();
      }
    }
  }, {
    key: 'addAction',
    value: function addAction(item) {
      var action = {
        name: item.name,
        text: item.sourcec
      };
      this.actionManager.addItem(action);
    }
  }, {
    key: 'createActions',
    value: function createActions(cb) {
      this.log('info', 'Loading actions from folder');
      if (this.settings.actionPath) {
        this.log('info', 'Loading action from folder ' + this.settings.actionPath);
        this.actionManager.addFolder(this.settings.actionPath, function (err) {
          if (err) {
            return cb(err);
          }
          var constructorMethod = this.actionManager.getItem('constructor');
          if (constructorMethod && constructorMethod.method) {
            this.actionManager.removeItem('constructor');
            this.constructorMethod = constructorMethod;
          }
          return cb();
        }.bind(this));
      } else {
        this.log('info', 'No action folder defined');
        cb();
      }
    }
  }, {
    key: 'createPlugins',
    value: function createPlugins(cb) {
      this.log('info', 'Loading plugins from folder');
      if (this.settings.pluginPath) {
        this.log('info', 'Loading plugins from folder ' + this.settings.pluginPath);
        this.pluginManager.addFolder(this.settings.pluginPath, function (err) {
          if (err) {
            return cb(err);
          }
          for (var key in this.pluginManager.items) {
            try {
              var plugin = this.pluginManager.items[key];
              plugin.instance = new plugin.method(this);
            } catch (err) {
              this.log('error', 'Error creating plugin ' + key);
            }
          }
          return cb();
        }.bind(this));
      } else {
        this.log('info', 'No plugin folder defined');
        cb();
      }
    }
  }, {
    key: 'addDialog',
    value: function addDialog(item) {
      this.dialogManager.addItem(item);
    }
  }, {
    key: 'createDialogs',
    value: function createDialogs(cb) {
      this.log('info', 'Loading dialogs from folder');
      if (this.settings.dialogPath) {
        this.log('info', 'Loading dialogs from folder ' + this.settings.dialogPath);
        this.dialogManager.addFolder(this.settings.dialogPath, cb);
      } else {
        this.log('info', 'No dialog folder defined');
        cb();
      }
    }
  }, {
    key: 'parseFlow',
    value: function parseFlow(str) {
      var lines = str.text.split('\n');
      var result = [];
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') {
          continue;
        }
        var item = {};
        var tokens = line.split('->');
        item.name = tokens[0].trim();
        if (item.name.endsWith('*')) {
          item.repeat = true;
          item.name = item.name.slice(0, -1);
        }
        item.flow = [];
        if (tokens.length === 1) {
          var cardName = item.name.substring(1);
          if (cardName === '') {
            cardName = 'root';
          }
          item.flow.push(cardName);
        } else {
          tokens = tokens[1].split(',');
          for (var j = 0; j < tokens.length; j++) {
            item.flow.push(tokens[j].trim());
          }
        }
        result.push(item);
      }
      return result;
    }
  }, {
    key: 'buildItemDialog',
    value: function buildItemDialog(item) {
      var actionArr = [];
      actionArr.push(this.getVariables.bind(this));
      for (var i = 0; i < item.flow.length; i++) {
        var current = item.flow[i].trim();
        if (current !== '') {
          if (current[0] === '/') {
            actionArr.push(this.beginDialog.bind(this, current));
            actionArr.push(this.getVariables.bind(this));
          } else if (current.endsWith('()')) {
            current = current.substring(0, current.length - 2);
            var action = this.actionManager.getItem(current);
            if (!action || !action.method) {
              this.log('error', 'Action ' + current + ' does not exists');
              return;
            }
            actionArr.push(action.method.bind(this));
          } else {
            actionArr.push(this.sendCard.bind(this, current));
            var card = this.cardManager.getItem(current);
            if (this.isPrompt(card)) {
              actionArr.push(this.reactToPrompt.bind(this));
            }
          }
        }
      }
      if (item.repeat) {
        actionArr.push(this.replaceDialog.bind(this, item.name));
      } else {
        actionArr.push(this.endDialog.bind(this));
      }
      var finalName = item.name === 'root' ? '/' : item.name;
      if (!finalName.startsWith('/')) {
        finalName = '/' + finalName;
      }
      this.bot.dialog(finalName, actionArr);
      this.log('info', 'Built dialog ' + finalName);
    }
  }, {
    key: 'buildDialogs',
    value: function buildDialogs() {
      this.log('info', 'building dialogs');
      for (var name in this.dialogManager.items) {
        var item = this.dialogManager.items[name];
        if (item.flow) {
          item.name = name;
          this.buildItemDialog(item);
        } else {
          var items = this.parseFlow(item);
          for (var i = 0; i < items.length; i++) {
            this.buildItemDialog(items[i]);
          }
        }
      }
    }
  }, {
    key: 'addObserver',
    value: function addObserver(eventName, fn) {
      if (!this.observers[eventName]) {
        this.observers[eventName] = [];
      }
      this.observers[eventName].push(fn);
    }
  }, {
    key: 'getVariables',
    value: function getVariables(session, args, next) {
      session.dialogData.args = args;
      session.dialogData.view = {};
      session.dialogData.view.message = session.message;
      this.storage.getAllFromCollection('user', session.message.address.user.id, function (err, values) {
        session.dialogData.view.user = values;
        next(args);
      });
    }
  }, {
    key: 'getCard',
    value: function getCard(name) {
      return this.cardManager.getItem(name);
    }
  }, {
    key: 'sendCard',
    value: function sendCard(name, session, args, next) {
      var card = void 0;
      if (_lodash2.default.isString(name)) {
        card = this.cardManager.getItem(name);
      } else {
        card = name;
      }
      var locale = session.userData.locale || this.settings.defaultLocale || 'en';
      var isPrompt = this.isPrompt(card);
      card = this.renderFactory.render(session, card, locale, session.dialogData.view);
      if (!isPrompt) {
        session.send(card);
        next();
      }
    }
  }, {
    key: 'getDialog',
    value: function getDialog(name) {
      return this.bot.dialog(name);
    }
  }, {
    key: 'endDialog',
    value: function endDialog(session, args, next) {
      session.endDialog();
    }
  }, {
    key: 'beginDialog',
    value: function beginDialog(name, session, args, next) {
      session.beginDialog(name);
    }
  }, {
    key: 'replaceDialog',
    value: function replaceDialog(name, session, args, next) {
      session.replaceDialog(name);
    }
  }, {
    key: 'getResponse',
    value: function getResponse(prompt, response) {
      if (prompt.prompt === 'choice') {
        if (!_lodash2.default.isString(response)) {
          response = response.entity;
        }
        var responselow = response.toLowerCase();
        for (var i = 0; i < prompt.options.length; i++) {
          if (responselow === prompt.options[i].text.toLowerCase()) {
            return { tag: prompt.options[i].tag, text: response };
          }
        }
        return { tag: undefined, text: response };
      } else {
        return response;
      }
    }
  }, {
    key: 'endReactToPrompt',
    value: function endReactToPrompt(session, prompt, value, next) {
      if (prompt.isMenu) {
        value = value.startsWith('/') ? value : '/' + value;
        if (value === '/endDialog') {
          session.endDialog();
        } else {
          session.beginDialog(value);
        }
      } else {
        next();
      }
    }
  }, {
    key: 'getPlugin',
    value: function getPlugin(name) {
      var plugin = this.pluginManager.getItem(name);
      if (plugin && plugin.instance) {
        return plugin.instance;
      }
      return undefined;
    }
  }, {
    key: 'reactToPrompt',
    value: function reactToPrompt(session, args, next) {
      var prompt = session.dialogData.lastCard;
      var response = this.getResponse(prompt, args.response);
      session.dialogData.view.response = response;
      if (prompt.variable) {
        var variableName = prompt.variable;
        var tokens = variableName.split('.');
        var scope = void 0;
        var name = void 0;
        var key = void 0;
        if (tokens.length === 1) {
          scope = 'default';
          name = tokens[0];
        } else {
          scope = tokens[0];
          name = tokens[1];
        }
        if (scope === 'user') {
          key = session.message.address.user.id;
        } else {
          key = 'default';
        }
        var value = response.tag ? response.tag : response;
        if (scope === 'dialog') {
          if (!session.dialogData.view.dialog) {
            session.dialogData.view.dialog = {};
          }
          session.dialogData.view.dialog[name] = value;
          this.endReactToPrompt(session, prompt, value, next);
        } else {
          if (!session.dialogData.view.user) {
            session.dialogData.view.user = {};
          }
          session.dialogData.view.user[name] = value;
          this.storage.setToCollection(scope, key, name, value, function (err, item) {
            this.endReactToPrompt(session, prompt, value, next);
          }.bind(this));
        }
      } else {
        var _value = response.tag ? response.tag : response;
        this.endReactToPrompt(session, prompt, _value, next);
      }
    }
  }, {
    key: 'getUserVariable',
    value: function getUserVariable(session, name) {
      if (!session.dialogData.view.user) {
        return undefined;
      }
      return session.dialogData.view.user[name];
    }
  }, {
    key: 'setUserVariable',
    value: function setUserVariable(session, name, value, cb) {
      var key = session.message.address.user.id;
      if (!session.dialogData.view.user) {
        session.dialogData.view.user = {};
      }
      session.dialogData.view.user[name] = value;
      this.storage.setToCollection('user', key, name, value, cb);
    }
  }, {
    key: 'getVariables',
    value: function getVariables(session, args, next) {
      session.dialogData.args = args;
      session.dialogData.view = {};
      session.dialogData.view.message = session.message;
      this.storage.getAllFromCollection('user', session.message.address.user.id, function (err, values) {
        session.dialogData.view.user = values;
        next();
      });
    }
  }, {
    key: 'findEntity',
    value: function findEntity(intent, name) {
      return this.builder.EntityRecognizer.findEntity(intent.entities, name);
    }
  }, {
    key: 'resolveTime',
    value: function resolveTime(intent) {
      if (intent.entities) {
        return this.builder.EntityRecognizer.resolveTime(intent.entities);
      } else {
        return this.builder.EntityRecognizer.resolveTime([intent]);
      }
    }
  }, {
    key: 'parseTime',
    value: function parseTime(utterance) {
      return this.builder.EntityRecognizer.parseTime(utterance);
    }
  }, {
    key: 'findBestMatch',
    value: function findBestMatch(items, name) {
      return this.builder.EntityRecognizer.findBestMatch(items, name);
    }
  }, {
    key: 'guessLanguages',
    value: function guessLanguages(utterance, whitelist, limit) {
      return this.languageManager.guess(utterance, whitelist, limit);
    }
  }, {
    key: 'guessLanguage',
    value: function guessLanguage(utterance, whitelist) {
      return this.languageManager.guess(utterance, whitelist, 1)[0];
    }
  }]);

  return FlowBot;
}();

exports.default = FlowBot;
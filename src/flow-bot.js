import builder from 'botbuilder';
import path from 'path';
import _ from 'lodash';
import FlowRenderFactory from './render-factory/flow-render-factory';
import FlowStorage from './storage/flow-storage';
import FlowMultiConnector from './connector/flow-multi-connector';
import FlowRequireManager from './require-manager/flow-require-manager';
import FlowTemplate from './template/flow-template';
import Language from './language/language';

/**
 * Class for a bot using the Flow Bot Framework.
 */
class FlowBot {

  /**
   * Constructor of the class.
   */
  constructor(settings, cb) {
    this.settings = settings || {};
    this.languageManager = new Language();
    this.setDefaultSettings();
    this.observers = {};
    this.builder = builder;
    this.createStorage();
    this.createTemplate();
    this.createConnector();
    this.createBot();
    this.createObservers();
    this.createRenderFactory();
    this.cardManager = new FlowRequireManager({ logger: settings.logger, pattern: '*.json' });
    this.actionManager = new FlowRequireManager({ logger: settings.logger, pattern: '*.js' });
    this.dialogManager = new FlowRequireManager({ logger: settings.logger, pattern: '*.flow' });
    this.pluginManager = new FlowRequireManager({ logger: settings.logger, pattern: '*.js'});
    this.createCards(function(err) {
      if (err) {
        this.log('error', err);
      }
      this.log('info','now will load plugins');
      this.createPlugins(function(err) {
        if (err) {
          this.log('error', err);
        }
        this.log('info', 'now will load actions');
        this.createActions(function(err) {
          if (err) {
            this.log('error', err);
          }
          this.createDialogs(function(err) {
            if (err) {
              this.log('error', err);
            }
            this.buildDialogs();
            if (this.constructorMethod) {
              this.constructorMethod.method.bind(this)(function(err){
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

  setDefaultSettings() {
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

  log(level, message) {
    if (this.settings.logger) {
      this.settings.logger.log(level, message);
    } else {
      console.log(level.toUpperCase() + ': ' + message);
    }
  }

  createStorage() {
    this.storage = this.settings.storage || new FlowStorage();
    delete this.settings['storage'];
  }

  createTemplate() {
    if (!this.settings.template) {
      let opts = {
        localesPath: this.settings.localesPath,
        defaultLocale: this.settings.defaultLocale
      };
      try {
        this.settings.template = new FlowTemplate(opts);
      } catch (err) {
        this.log('error', 'Error creating template and locales');
        this.log('error', err);
      }
    }
    this.template = this.settings.template;
    delete this.settings['template'];
  }

  createConnector() {
    if (this.settings.connector) {
      return this.connector = this.settings.connector;
    }
    this.connector = new FlowMultiConnector();
    if (this.settings.defaultConnector) {
      this.connector.addConnector('default', this.settings.defaultConnector);
    } else {
      let botAppId = this.settings.botAppId || process.env.BOT_APP_ID;
      let pass = this.settings.botAppPassword || process.env.BOT_APP_PASSWORD;
      let microsoftConnector = new builder.ChatConnector({
        appId: botAppId,
        appPassword: pass
      });
      this.connector.addConnector('default', microsoftConnector);
    }
    if (this.settings.consoleConnector === true) {
      let consoleConnector = new builder.ConsoleConnector();
      this.connector.addConnector('console', consoleConnector);
      consoleConnector.listen();
    }
  }

  createBot() {
    this.bot = new builder.UniversalBot(this.connector);
  }

  observeEvent(name, message) {
    if (this.observers[name]) {
      for (let observer in this.observers[name]) {
        observer(message);
      }
    }
  }

  createObservers() {
    let eventNames = ['contactRelationUpdate', 'deleteUserData', 'message', 'ping', 'typing', 'conversationUpdate'];
    for (let eventName in eventNames) {
      this.bot.on(eventName, this.observeEvent.bind(this,eventName));
    }
  }

  createRenderFactory() {
    this.renderFactory = new FlowRenderFactory({ template: this.template, builder: builder, parent: this });
  }

  getAbsolutePath(relative) {
    return path.normalize(path.join(process.cwd(),relative));
  }

  isPrompt(item) {
    return ((item.type === 'prompt') || ((item.prompt) && (item.prompt !== '')));
  }

  isChoice(item) {
    return this.isPrompt(item) && item.prompt === 'choice';
  }

  addCard(item) {
    this.cardManager.addItem(item);
    if (this.isChoice(item) && _.isString(item.options)) {
      let tokens = item.options.split('|');
      item.options = [];
      for (let j = 0; j < tokens.length; j++) {
        item.options.push({ tag: tokens[j], text: tokens[j] });
      }
    }
  }

  createCards(cb) {
    this.log('info', 'Loading cards from folder');
    if (this.settings.cardPath) {
      this.log('info', `Loading card from folder ${this.settings.cardPath}`);
      this.cardManager.addFolder(this.settings.cardPath, function(error, items) {
        if (error) {
          return cb(error);
        }
        for (let name in this.cardManager.items) {
          let item = this.cardManager.items[name];
          if (this.isChoice(item) && _.isString(item.options)) {
            let tokens = item.options.split('|');
            item.options = [];
            for (let j = 0; j < tokens.length; j++) {
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

  addAction(item) {
    let action = {
      name: item.name,
      text: item.sourcec
    };
    this.actionManager.addItem(action);
  }

  createActions(cb) {
    this.log('info', 'Loading actions from folder');
    if (this.settings.actionPath) {
      this.log('info', `Loading action from folder ${this.settings.actionPath}`);
      this.actionManager.addFolder(this.settings.actionPath, function(err) {
        if (err) {
          return cb(err);
        }
        let constructorMethod = this.actionManager.getItem('constructor');
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

  createPlugins(cb) {
    this.log('info', 'Loading plugins from folder');
    if (this.settings.pluginPath) {
      this.log('info', `Loading plugins from folder ${this.settings.pluginPath}`);
      this.pluginManager.addFolder(this.settings.pluginPath, function(err) {
        if (err) {
          return cb(err);
        }
        for (var key in this.pluginManager.items) {
          try {
            let plugin = this.pluginManager.items[key];
            plugin.instance = new plugin.method(this); 
          } catch (err) {
            this.log('error', 'Error creating plugin '+key);
          }
        }
        return cb(); 
      }.bind(this));
    } else {
      this.log('info', 'No plugin folder defined');
      cb();
    }
  }

  addDialog(item) {
    this.dialogManager.addItem(item);
  }

  createDialogs(cb) {
    this.log('info', 'Loading dialogs from folder');
    if (this.settings.dialogPath) {
      this.log('info', `Loading dialogs from folder ${this.settings.dialogPath}`);
      this.dialogManager.addFolder(this.settings.dialogPath, cb);
    } else {
      this.log('info', 'No dialog folder defined');
      cb();
    }
  }

  parseFlow(str) {
    let lines = str.text.split('\n');
    let result = [];
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line === '') {
        continue;
      }
      let item = {};
      let tokens = line.split('->');
      item.name = tokens[0].trim();
      if (item.name.endsWith('*')) {
        item.repeat = true;
        item.name = item.name.slice(0, -1);
      }
      item.flow = [];
      if (tokens.length === 1) {
        let cardName = item.name.substring(1);
        if (cardName === '') {
          cardName = 'root';
        }
        item.flow.push(cardName);
      } else {
        tokens = tokens[1].split(',');
        for (let j = 0; j < tokens.length; j++) {
          item.flow.push(tokens[j].trim());
        }
      }
      result.push(item);
    }
    return result;
  }

  buildItemDialog(item) {
    let actionArr = [];
    actionArr.push(this.getVariables.bind(this));
    for (let i = 0; i < item.flow.length; i++) {
      let current = item.flow[i].trim();
      if (current !== '') {
        if (current[0] === '/') {
          actionArr.push(this.beginDialog.bind(this, current));
          actionArr.push(this.getVariables.bind(this));
        } else if (current.endsWith('()')) {
          current = current.substring(0, current.length-2);
          let action = this.actionManager.getItem(current);
          if (!action || !action.method) {
            this.log('error', 'Action '+current+' does not exists');
            return;
          } 
          actionArr.push(action.method.bind(this));
        } else {
          actionArr.push(this.sendCard.bind(this, current));
          let card = this.cardManager.getItem(current);
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
    let finalName = item.name === 'root' ? '/' : item.name;
    if (!finalName.startsWith('/')) {
      finalName = '/'+finalName;
    }
    this.bot.dialog(finalName, actionArr);
    this.log('info', `Built dialog ${finalName}`);
  }

  buildDialogs() {
    this.log('info', 'building dialogs');
    for (let name in this.dialogManager.items) {
      let item = this.dialogManager.items[name];
      if (item.flow) {
        item.name = name;
        this.buildItemDialog(item);
      }
      else {
        let items = this.parseFlow(item);
        for (let i = 0; i < items.length; i++) {
          this.buildItemDialog(items[i]);
        }
      }
    }    
  }

  addObserver(eventName, fn) {
    if (!this.observers[eventName]) {
      this.observers[eventName] = [];
    }
    this.observers[eventName].push(fn);
  }

  getVariables(session, args, next) {
    session.dialogData.args = args;
    session.dialogData.view = {};
    session.dialogData.view.message = session.message;
    this.storage.getAllFromCollection('user', session.message.address.user.id, function(err, values) {
      session.dialogData.view.user = values;
      next();
    });
  }

  getCard(name) {
    return this.cardManager.getItem(name);
  }

  sendCard(name, session, args, next) {
    let card;
    if (_.isString(name)) {
      card = this.cardManager.getItem(name);
    } else {
      card = name;
    }
    let locale = session.userData.locale || this.settings.defaultLocale || 'en';
    let isPrompt = this.isPrompt(card);
    card = this.renderFactory.render(session, card, locale, session.dialogData.view);
    if (!isPrompt) {
      session.send(card);
      next();
    }
  }

  getDialog(name) {
    return this.bot.dialog(name);
  }

  endDialog(session, args, next) {
    session.endDialog();
  }

  beginDialog(name, session, args, next) {
    session.beginDialog(name);
  }

  replaceDialog(name, session, args, next) {
    session.replaceDialog(name);
  }

  getResponse(prompt, response) {
    if (prompt.prompt === 'choice') {
      if (!_.isString(response)) {
        response = response.entity;
      }
      let responselow = response.toLowerCase();
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

  endReactToPrompt(session, prompt, value, next) {
    if (prompt.isMenu) {
      value = value.startsWith('/') ? value : '/'+value;
      if (value === '/endDialog') {
        session.endDialog();
      } else {
        session.beginDialog(value);
      }
    } else {
      next();
    }
  }

  getPlugin(name) {
    let plugin = this.pluginManager.getItem(name);
    if (plugin && plugin.instance) {
      return plugin.instance;
    }
    return undefined;
  }

  reactToPrompt(session, args, next) {
    let prompt = session.dialogData.lastCard;
    let response = this.getResponse(prompt, args.response);
    session.dialogData.view.response = response;
    if (prompt.variable) {
      let variableName = prompt.variable;
      let tokens = variableName.split('.');
      let scope;
      let name;
      let key;
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
      let value = response.tag ? response.tag : response;
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
        this.storage.setToCollection(scope, key, name, value, function(err, item) {
          this.endReactToPrompt(session, prompt, value, next);
        }.bind(this));
      }
    } else {
      let value = response.tag ? response.tag : response;
      this.endReactToPrompt(session, prompt, value, next);
    }
  }

  findEntity(intent, name) {
    return this.builder.EntityRecognizer.findEntity(intent.entities, name);
  } 

  resolveTime(intent) {
    if (intent.entities) {
      return this.builder.EntityRecognizer.resolveTime(intent.entities);
    } else {
      return this.builder.EntityRecognizer.resolveTime([intent]);
    }
  }

  parseTime(utterance) {
    return this.builder.EntityRecognizer.parseTime(utterance);
  }
  
  findBestMatch(items, name) {
    return this.builder.EntityRecognizer.findBestMatch(items, name);
  }

  guessLanguages(utterance, whitelist, limit) {
    return this.languageManager.guess(utterance, whitelist, limit);
  }

  guessLanguage(utterance, whitelist) {
    return this.languageManager.guess(utterance, whitelist, 1)[0];
  }
}

export default FlowBot;

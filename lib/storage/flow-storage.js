'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _memoryCollection = require('./memory-collection');

var _memoryCollection2 = _interopRequireDefault(_memoryCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for a set of collections. Each collection can be added
 * separately and can be a different data source than the other
 * ones.
 * 
 * By default, memory collections are created, but a collectionClass
 * can be passed in the settings, being the class that must be instantiated
 * for creating each collection. Also, a default collection settings can
 * be passed, as well as a list of collection names.
 */
var FlowStorage = function () {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings for constructing the instance.
   */
  function FlowStorage(settings) {
    _classCallCheck(this, FlowStorage);

    this.settings = settings || {};
    this.collections = {};
    this.createCollections();
  }

  /**
   * Add a collection to the storage.
   * 
   * @param { Object } collection Collection to be added to the storage.
   */


  _createClass(FlowStorage, [{
    key: 'addCollection',
    value: function addCollection(collection) {
      this.collections[collection.name] = collection;
    }

    /**
     * Get a collection given its name.
     * 
     * @param { String } name Name of the collection.
     * @returns { Object } Collection given its name, undefined if not found.
     */

  }, {
    key: 'getCollection',
    value: function getCollection(name) {
      return this.collections[name];
    }

    /**
     * Create the collections defined at the settings when constructing 
     * the instance.
     */

  }, {
    key: 'createCollections',
    value: function createCollections() {
      var _this = this;

      var collectionClass = this.settings.collectionClass || _memoryCollection2.default;
      var collectionNames = this.settings.collectionNames || ['user', 'channel'];
      var collectionSettings = this.settings.collectionSettings || {};
      collectionNames.forEach(function (name) {
        collectionSettings.name = name;
        var collection = new collectionClass(collectionSettings);
        _this.addCollection(collection);
      });
    }

    /**
     * Get the variables instance given the collection name and the key.
     * 
     * @param { String } collectionName Name of the collection.
     * @param { String } key Identifier of the object.
     * @param { Function } cb Callback function. 
     */

  }, {
    key: 'getAllFromCollection',
    value: function getAllFromCollection(collectionName, key, cb) {
      var collection = this.getCollection(collectionName);
      if (!collection) {
        return cb('The collection does not exists');
      }
      return collection.getAll(key, cb);
    }

    /**
     * Set the variables instance given the collection name and the key.
     * 
     * @param { String } collectionName Name of the collection
     * @param { String } key Identifier of the object.
     * @param { Object } data Data to save.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'setAllToCollection',
    value: function setAllToCollection(collectionName, key, data, cb) {
      var collection = this.getCollection(collectionName);
      if (!collection) {
        return cb('The collection does not exists');
      }
      return collection.setAll(key, data, cb);
    }

    /**
     * Delete the variables instance given the key.
     * 
     * @param { String } collectionName Name of the collection.
     * @param { String } key Identifier of the object.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'deleteAllFromCollection',
    value: function deleteAllFromCollection(collectionName, key, cb) {
      var collection = this.getCollection(collectionName);
      if (!collection) {
        return cb('The collection does not exists');
      }
      return collection.deleteAll(key, cb);
    }

    /**
     * Gets the value of one variable, given the key and the variable name.
     * 
     * @param { String } collectionName Name of the collection.
     * @param { String } key Identifier of the object.
     * @param { String } name Variable name.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'getFromCollection',
    value: function getFromCollection(collectionName, key, name, cb) {
      var collection = this.getCollection(collectionName);
      if (!collection) {
        return cb('The collection does not exists');
      }
      return collection.get(key, name, cb);
    }

    /**
     * Sets the value of one variable, given the key and the variable name.
     * 
     * @param { String } collectionName Name of the collection.
     * @param { String } key Identifier of the object.
     * @param { String } name Variable name.
     * @param { String } data Value of the variable to be setted.
     * @param { Function } cb Callback function. 
     */

  }, {
    key: 'setToCollection',
    value: function setToCollection(collectionName, key, name, data, cb) {
      var collection = this.getCollection(collectionName);
      if (!collection) {
        return cb('The collection does not exists');
      }
      return collection.set(key, name, data, cb);
    }

    /**
     * Delete the value of one variable, given the key and the variable name.
     * 
     * @param { String } collectionName Name of the collection.
     * @param { String } key Identifier of the object.
     * @param { String } name Variable name.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'deleteFromCollection',
    value: function deleteFromCollection(collectionName, key, name, cb) {
      var collection = this.getCollection(collectionName);
      if (!collection) {
        return cb('The collection does not exists');
      }
      return collection.delete(key, name, cb);
    }
  }]);

  return FlowStorage;
}();

exports.default = FlowStorage;
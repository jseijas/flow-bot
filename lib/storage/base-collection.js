'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class for a collection.
 * A collection stores variable objects by key, and is able
 * to retrieve all the information in one shot or get only one
 * of the variables.
 */
var BaseCollection = function () {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Instance settings.
   */
  function BaseCollection(settings) {
    _classCallCheck(this, BaseCollection);

    this.name = settings.name;
  }

  /**
   * Get the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  /*eslint-disable no-unused-vars*/


  _createClass(BaseCollection, [{
    key: 'getAll',
    value: function getAll(key, cb) {
      /*eslint-enable no-unused-vars*/
      throw new Error('Method getAll must be overrided.');
    }

    /**
     * Set the variables instance given the key.
     * 
     * @param { String } key Identifier of the object.
     * @param { Object } data Data to save.
     * @param { Function } cb Callback function.
     */
    /*eslint-disable no-unused-vars*/

  }, {
    key: 'setAll',
    value: function setAll(key, data, cb) {
      /*eslint-enable no-unused-vars*/
      throw new Error('Method setAll must be overrided.');
    }

    /**
     * Delete the variables instance given the key.
     * 
     * @param { String } key Identifier of the object.
     * @param { Function } cb Callback function.
     */
    /*eslint-disable no-unused-vars*/

  }, {
    key: 'deleteAll',
    value: function deleteAll(key, cb) {
      /*eslint-enable no-unused-vars*/
      throw new Error('Method deleteAll must be overrided.');
    }

    /**
     * Gets the value of one variable, given the key and the variable name.
     * 
     * @param { String } key Identifier of the object.
     * @param { String } name Variable name.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'get',
    value: function get(key, name, cb) {
      this.getAll(key, function (err, obj) {
        if (err) {
          return cb(err);
        }
        if (!obj) {
          return cb(null, undefined);
        }
        return cb(null, obj[name]);
      });
    }

    /**
     * Sets the value of one variable, given the key and the variable name.
     * 
     * @param { String } key Identifier of the object.
     * @param { String } name Variable name.
     * @param { String } data Value of the variable to be setted.
     * @param { Function } cb Callback function. 
     */

  }, {
    key: 'set',
    value: function set(key, name, data, cb) {
      var _this = this;

      this.getAll(key, function (err, obj) {
        /*if (err) {
          return cb(err);
        }*/
        if (!obj) {
          obj = {};
        }
        obj[name] = data;
        _this.setAll(key, obj, cb);
      });
    }

    /**
     * Delete the value of one variable, given the key and the variable name.
     * 
     * @param { String } key Identifier of the object.
     * @param { String } name Variable name.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'delete',
    value: function _delete(key, name, cb) {
      var _this2 = this;

      this.getAll(key, function (err, obj) {
        if (err) {
          return cb(err);
        }
        if (!obj) {
          return cb(null, undefined);
        }
        delete obj[name];
        _this2.setAll(key, obj, cb);
      });
    }
  }]);

  return BaseCollection;
}();

exports.default = BaseCollection;
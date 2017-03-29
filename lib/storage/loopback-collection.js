'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseCollection = require('./base-collection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for a collection of variables that is stored in a loopback model.
 */
var LoopbackCollection = function (_BaseCollection) {
  _inherits(LoopbackCollection, _BaseCollection);

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings of the collection.
   */
  function LoopbackCollection(settings) {
    _classCallCheck(this, LoopbackCollection);

    var _this = _possibleConstructorReturn(this, (LoopbackCollection.__proto__ || Object.getPrototypeOf(LoopbackCollection)).call(this, settings));

    if (!settings.model) {
      throw new Error('A loopback model must be provided');
    }
    _this.model = settings.model;
    return _this;
  }

  /**
   * Given a key, build an id that contains the collection name. 
   * That way, the same table can store documents of different collections.
   * 
   * @param { String } key Key of the instance.
   */


  _createClass(LoopbackCollection, [{
    key: 'buildId',
    value: function buildId(key) {
      return this.name + '_' + key;
    }

    /**
     * Get the variables instance given the key.
     * 
     * @param { String } key Identifier of the object.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'getAll',
    value: function getAll(key, cb) {
      this.model.findById(this.buildId(key), function (err, item) {
        if (err) {
          return cb(null, undefined);
        }
        return cb(null, item);
      });
    }

    /**
     * Set the variables instance given the key.
     * 
     * @param { String } key Identifier of the object.
     * @param { Object } data Data to save.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'setAll',
    value: function setAll(key, data, cb) {
      var id = this.buildId(key);
      var dataClone = _lodash2.default.clone(data);
      dataClone.id = id;
      this.model.upsert(dataClone, function (err, item) {
        return cb(err, item);
      });
    }

    /**
     * Delete the variables instance given the key.
     * 
     * @param { String } key Identifier of the object.
     * @param { Function } cb Callback function.
     */

  }, {
    key: 'deleteAll',
    value: function deleteAll(key, cb) {
      var id = this.buildId(key);
      this.model.destroyById(id, function (err) {
        return cb(err);
      });
    }
  }]);

  return LoopbackCollection;
}(_baseCollection2.default);

exports.default = LoopbackCollection;
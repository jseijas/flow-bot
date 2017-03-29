'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseCollection = require('./base-collection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _jfs = require('jfs');

var _jfs2 = _interopRequireDefault(_jfs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for a collection of variables that is stored in memory.
 */
var MemoryCollection = function (_BaseCollection) {
  _inherits(MemoryCollection, _BaseCollection);

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings of the collection.
   */
  function MemoryCollection(settings) {
    _classCallCheck(this, MemoryCollection);

    var _this = _possibleConstructorReturn(this, (MemoryCollection.__proto__ || Object.getPrototypeOf(MemoryCollection)).call(this, settings));

    _this.db = new _jfs2.default(settings.name, { type: 'memory' });
    return _this;
  }

  /**
   * Get the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */


  _createClass(MemoryCollection, [{
    key: 'getAll',
    value: function getAll(key, cb) {
      return this.db.get(key, cb);
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
      return this.db.save(key, data, cb);
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
      return this.db.delete(key, cb);
    }
  }]);

  return MemoryCollection;
}(_baseCollection2.default);

exports.default = MemoryCollection;
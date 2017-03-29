'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Static class for the utils.
 */
var FlowUtil = function () {
  function FlowUtil() {
    _classCallCheck(this, FlowUtil);
  }

  _createClass(FlowUtil, null, [{
    key: 'mustExecute',
    value: function mustExecute(types, value) {
      if (!types || _lodash2.default.isArray(types) && types.length === 0) {
        return true;
      }
      return types.indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) >= 0;
    }
  }, {
    key: 'traverse',
    value: function traverse(types, name, obj, fn) {
      if (!fn) {
        fn = obj;
        obj = name;
        name = '';
      }
      if (_lodash2.default.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          var objName = name + '[' + i + ']';
          if (FlowUtil.mustExecute(types, obj[i])) {
            obj[i] = fn(objName, obj[i]);
          }
          FlowUtil.traverse(types, objName, obj[i], fn);
        }
      } else if (_lodash2.default.isPlainObject(obj)) {
        for (var propname in obj) {
          var _objName = name === '' ? propname : name + '.' + propname;
          if (FlowUtil.mustExecute(types, obj[propname])) {
            obj[propname] = fn(_objName, obj[propname]);
          }
          FlowUtil.traverse(types, _objName, obj[propname], fn);
        }
      }
    }
  }]);

  return FlowUtil;
}();

exports.default = FlowUtil;
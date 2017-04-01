'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowRequireManager = function () {
  function FlowRequireManager(settings) {
    _classCallCheck(this, FlowRequireManager);

    this.settings = settings || {};
    this.items = {};
  }

  _createClass(FlowRequireManager, [{
    key: 'log',
    value: function log(level, message) {
      if (this.settings.logger) {
        this.settings.logger.log(level, message);
      }
    }
  }, {
    key: 'getAbsolutePath',
    value: function getAbsolutePath(relative) {
      return _path2.default.normalize(_path2.default.join(process.cwd(), relative));
    }
  }, {
    key: 'addItem',
    value: function addItem(item) {
      this.log('info', 'Adding item ' + item.name);
      this.items[item.name] = item;
    }
  }, {
    key: 'removeItem',
    value: function removeItem(name) {
      this.log('info', 'Removing item ' + name);
      delete this.items[name];
    }
  }, {
    key: 'getItem',
    value: function getItem(name) {
      return this.items[name];
    }
  }, {
    key: 'addFolder',
    value: function addFolder(folder, cb) {
      (0, _glob2.default)(folder + '/' + this.settings.pattern, {}, function (err, files) {
        if (err) {
          return cb(err);
        }
        for (var i = 0; i < files.length; i++) {
          var extension = _path2.default.extname(files[i]);
          var content = void 0;
          var absolutePath = this.getAbsolutePath(files[i]);
          if (extension === '.json' || extension === '.js') {
            content = require(absolutePath);
          } else {
            content = _fs2.default.readFileSync(absolutePath, 'utf8');
          }
          if (content) {
            if (!_lodash2.default.isArray(content)) {
              var name = content.name;
              if (_lodash2.default.isFunction(content)) {
                content = {
                  method: content
                };
              } else if (_lodash2.default.isString(content)) {
                content = {
                  text: content
                };
              }
              if (!name) {
                name = _path2.default.basename(files[i], extension).toLowerCase();
              }
              content.name = name;
              content = [content];
            }
            for (var j = 0; j < content.length; j++) {
              this.addItem(content[j]);
            }
          } else {
            this.log('warning', 'Content not found for file ' + files[i]);
          }
        }
        return cb();
      }.bind(this));
    }
  }]);

  return FlowRequireManager;
}();

exports.default = FlowRequireManager;
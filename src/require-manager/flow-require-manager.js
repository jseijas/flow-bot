import glob from 'glob';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

class FlowRequireManager {

  constructor(settings) {
    this.settings = settings || {};
    this.items = {};
  }

  log(level, message) {
    if (this.settings.logger) {
      this.settings.logger.log(level, message);
    }
  }

  getAbsolutePath(relative) {
    return path.normalize(path.join(process.cwd(), relative));
  }

  addItem(item) {
    this.log('info', `Adding item ${item.name}`);
    this.items[item.name] = item;
  }

  removeItem(name) {
    this.log('info', `Removing item ${name}`);
    delete this.cards[name];
  }

  getItem(name) {
    return this.items[name];
  }

  addFolder(folder, cb) {
    glob(folder+'/'+this.settings.pattern, {}, function(err, files) {
      if (err) {
        return cb(err);
      }
      for (let i = 0; i < files.length; i++) {
        let extension = path.extname(files[i]);
        let content;
        let absolutePath = this.getAbsolutePath(files[i]);
        if (extension === '.json' || extension === '.js') {
          content = require(absolutePath);
        } else {
          content = fs.readFileSync(absolutePath, 'utf8');
        }
        if (content) {
          if (!_.isArray(content)) {
            if (!content.name) {
              let name = path.basename(files[i], extension).toLowerCase();
              if (_.isFunction(content)) {
                content = {
                  method: content
                };
              } else if (_.isString(content)) {
                content = {
                  text: content
                };
              }
              content.name = name;
            }
            content = [content];
          }
          for (let j = 0; j < content.length; j++) {
            this.addItem(content[j]);
          }
        } else {
          this.log('warning', `Content not found for file ${files[i]}`);
        }
      }
      return cb();
    }.bind(this));
  }
}

export default FlowRequireManager;

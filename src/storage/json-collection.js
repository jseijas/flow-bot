import BaseCollection from './base-collection';
import Store from 'jfs';

/**
 * Class for a collection of variables that is stored in json files.
 */
class JsonCollection extends BaseCollection {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings of the collection.
   */
  constructor(settings) {
    super(settings);
    settings.path = settings.path || './data';
    this.db = new Store(settings.path+'/'+settings.name, settings.store);
  }

  /**
   * Get the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  getAll(key, cb) {
    this.db.get(key, function(err, result) {
      if (err) {
        if (err.message === 'could not load data') {
          return cb(null, undefined);
        }
        return cb(err);
      }
      return cb(null, result);
    });
  }

  /**
   * Set the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Object } data Data to save.
   * @param { Function } cb Callback function.
   */
  setAll(key, data, cb) {
    return this.db.save(key, data, cb);
  }

  /**
   * Delete the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  deleteAll(key, cb) {
    return this.db.delete(key, cb);
  }
}

export default JsonCollection;
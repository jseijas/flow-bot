import BaseCollection from './base-collection';
import Store from 'jfs';

/**
 * Class for a collection of variables that is stored in memory.
 */
class MemoryCollection extends BaseCollection {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings of the collection.
   */
  constructor(settings) {
    super(settings);
    this.db = new Store(settings.name, { type:'memory' });
  }

  /**
   * Get the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  getAll(key, cb) {
    return this.db.get(key, cb);
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

export default MemoryCollection;
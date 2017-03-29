import BaseCollection from './base-collection';
import _ from 'lodash';

/**
 * Class for a collection of variables that is stored in a loopback model.
 */
class LoopbackCollection extends BaseCollection {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings of the collection.
   */
  constructor(settings) {
    super(settings);
    if (!settings.model) {
      throw new Error('A loopback model must be provided');
    }
    this.model = settings.model;
  }

  /**
   * Given a key, build an id that contains the collection name. 
   * That way, the same table can store documents of different collections.
   * 
   * @param { String } key Key of the instance.
   */
  buildId(key) {
    return this.name+'_'+key;
  }

  /**
   * Get the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  getAll(key, cb) {
    this.model.findById(this.buildId(key), function(err, item) {
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
  setAll(key, data, cb) {
    let id = this.buildId(key);
    let dataClone = _.clone(data);
    dataClone.id = id;
    this.model.upsert(dataClone, function(err, item){
      return cb(err, item);
    });
  }

  /**
   * Delete the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  deleteAll(key, cb) {
    let id = this.buildId(key);
    this.model.destroyById(id, function(err) {
      return cb(err);
    });
  }
}

export default LoopbackCollection;

/**
 * Base class for a collection.
 * A collection stores variable objects by key, and is able
 * to retrieve all the information in one shot or get only one
 * of the variables.
 */
class BaseCollection {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Instance settings.
   */
  constructor(settings) {
    this.name = settings.name;
  }

  /**
   * Get the variables instance given the key.
   * 
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  /*eslint-disable no-unused-vars*/
  getAll(key, cb) {
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
  setAll(key, data, cb) {
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
  deleteAll(key, cb) {
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
  get(key, name, cb) {
    this.getAll(key, (err, obj) => {
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
  set(key, name, data, cb) {
    this.getAll(key, (err, obj) => {
      /*if (err) {
        return cb(err);
      }*/
      if (!obj) {
        obj = {};
      }
      obj[name] = data;
      this.setAll(key, obj, cb);
    });
  }

  /**
   * Delete the value of one variable, given the key and the variable name.
   * 
   * @param { String } key Identifier of the object.
   * @param { String } name Variable name.
   * @param { Function } cb Callback function.
   */
  delete(key, name, cb) {
    this.getAll(key, (err, obj) => {
      if (err) {
        return cb(err);
      }
      if (!obj) {
        return cb(null, undefined);
      }
      delete obj[name];
      this.setAll(key, obj, cb);
    });
  }
}

export default BaseCollection;
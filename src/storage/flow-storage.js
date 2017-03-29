import MemoryCollection from './memory-collection';

/**
 * Class for a set of collections. Each collection can be added
 * separately and can be a different data source than the other
 * ones.
 * 
 * By default, memory collections are created, but a collectionClass
 * can be passed in the settings, being the class that must be instantiated
 * for creating each collection. Also, a default collection settings can
 * be passed, as well as a list of collection names.
 */
class FlowStorage {

  /**
   * Constructor of the class.
   * 
   * @constructor
   * @param { Object } settings Settings for constructing the instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.collections = {};
    this.createCollections();
  }

  /**
   * Add a collection to the storage.
   * 
   * @param { Object } collection Collection to be added to the storage.
   */
  addCollection(collection) {
    this.collections[collection.name] = collection;
  }

  /**
   * Get a collection given its name.
   * 
   * @param { String } name Name of the collection.
   * @returns { Object } Collection given its name, undefined if not found.
   */
  getCollection(name) {
    return this.collections[name];
  }

  /**
   * Create the collections defined at the settings when constructing 
   * the instance.
   */
  createCollections() {
    let collectionClass = this.settings.collectionClass || MemoryCollection;
    let collectionNames = this.settings.collectionNames || ['user', 'channel'];
    let collectionSettings = this.settings.collectionSettings || {};
    collectionNames.forEach((name) => {
      collectionSettings.name = name;
      let collection = new collectionClass(collectionSettings);
      this.addCollection(collection);
    });
  }

  /**
   * Get the variables instance given the collection name and the key.
   * 
   * @param { String } collectionName Name of the collection.
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function. 
   */
  getAllFromCollection(collectionName, key, cb) {
    let collection = this.getCollection(collectionName);
    if (!collection) {
      return cb('The collection does not exists');
    }
    return collection.getAll(key, cb);
  }

  /**
   * Set the variables instance given the collection name and the key.
   * 
   * @param { String } collectionName Name of the collection
   * @param { String } key Identifier of the object.
   * @param { Object } data Data to save.
   * @param { Function } cb Callback function.
   */
  setAllToCollection(collectionName,key, data, cb) {
    let collection = this.getCollection(collectionName);
    if (!collection) {
      return cb('The collection does not exists');
    }
    return collection.setAll(key, data, cb);
  }

  /**
   * Delete the variables instance given the key.
   * 
   * @param { String } collectionName Name of the collection.
   * @param { String } key Identifier of the object.
   * @param { Function } cb Callback function.
   */
  deleteAllFromCollection(collectionName, key, cb) {
    let collection = this.getCollection(collectionName);
    if (!collection) {
      return cb('The collection does not exists');
    }
    return collection.deleteAll(key, cb);
  }

  /**
   * Gets the value of one variable, given the key and the variable name.
   * 
   * @param { String } collectionName Name of the collection.
   * @param { String } key Identifier of the object.
   * @param { String } name Variable name.
   * @param { Function } cb Callback function.
   */
  getFromCollection(collectionName, key, name, cb) {
    let collection = this.getCollection(collectionName);
    if (!collection) {
      return cb('The collection does not exists');
    }
    return collection.get(key, name, cb);
  }

  /**
   * Sets the value of one variable, given the key and the variable name.
   * 
   * @param { String } collectionName Name of the collection.
   * @param { String } key Identifier of the object.
   * @param { String } name Variable name.
   * @param { String } data Value of the variable to be setted.
   * @param { Function } cb Callback function. 
   */
  setToCollection(collectionName, key, name, data, cb) {
    let collection = this.getCollection(collectionName);
    if (!collection) {
      return cb('The collection does not exists');
    }
    return collection.set(key, name, data, cb);
  }

  /**
   * Delete the value of one variable, given the key and the variable name.
   * 
   * @param { String } collectionName Name of the collection.
   * @param { String } key Identifier of the object.
   * @param { String } name Variable name.
   * @param { Function } cb Callback function.
   */
  deleteFromCollection(collectionName, key, name, cb) {
    let collection = this.getCollection(collectionName);
    if (!collection) {
      return cb('The collection does not exists');
    }
    return collection.delete(key, name, cb);
  }
}

export default FlowStorage;
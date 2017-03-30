/* global it, describe */
import { expect } from 'chai';
import FlowStorage from '../src/storage/flow-storage';
import MemoryCollection from '../src/storage/memory-collection';

describe('Flow Storage', () => {

  describe('Constructor', () => {
    it('Should construct an instance', () => {
      let instance = new FlowStorage();
      expect(instance).to.exist;
      expect(instance.getCollection('user')).to.exist;
      expect(instance.getCollection('channel')).to.exist;
    });
  });

  describe('Add collection', () => {
    it('Should be able to add a new collection', () => {
      let collection = new MemoryCollection({ name: 'test'});
      let instance = new FlowStorage();
      instance.addCollection(collection);
      expect(instance.getCollection('test')).to.equal(collection);
    });
  });

});

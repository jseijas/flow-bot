/* global it, describe, afterEach */
import { expect } from 'chai';
import JsonCollection from '../src/storage/json-collection';

describe('Json collection', ()  => {

  afterEach(function(done) {
    let instance = new JsonCollection({ name: 'test' });
    instance.deleteAll(1, function() {
      instance.deleteAll(2, function() {
        done();
      });
    });
  });

  describe('Construction', () => {

    it('Should construct an instance', () => {
      let instance = new JsonCollection({ name: 'test' });
      expect(instance).to.exist;
      expect(instance.db).to.exist;
    });

  });

  describe('Set object', () => {

    it('Should be able to save an object', (done) => {
      let obj = { id: 1, firstname: 'Jesus', lastname: 'Seijas' };
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj.id, obj, (err, result) => {
        expect(err).to.not.exist;
        expect(result).to.exist;
        expect(result).to.equal(obj.id);
        done();
      });
    });

    it('Should be able to save an object even if value is empty', (done) => {
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(1, undefined, (err, result) => {
        expect(err).to.not.exist;
        expect(result).to.exist;
        expect(result).to.equal(1);
        done();
      });
    });

  });

  describe('Get object', () => {
  
    it('Should be able to get an object', (done) => {
      let obj = { id: 1, firstname: 'Jesus', lastname: 'Seijas'};
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj.id, obj, (err) => {
        expect(err).to.not.exist;
        instance.getAll(obj.id, (err, result) => {
          expect(err).to.not.exist;
          expect(result).to.exist;
          expect(result.id).to.equal(obj.id);
          expect(result.firstname).to.equal(obj.firstname);
          expect(result.lastname).to.equal(obj.lastname);
          done();
        });
      });
    });

    it('Should be able to get the correct object', (done) => {
      let obj1 = { id: 1, firstname: 'Jesus', lastname: 'Seijas'};
      let obj2 = { id: 2, firstname: 'Manolo', lastname: 'Povedilla'};
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj1.id, obj1, (err) => {
        expect(err).to.not.exist;
        instance.setAll(obj2.id, obj2, (err) => {
          expect(err).to.not.exist;
          instance.getAll(obj1.id, (err, result) => {
            expect(err).to.not.exist;
            expect(result.id).to.equal(obj1.id);
            expect(result.firstname).to.equal(obj1.firstname);
            expect(result.lastname).to.equal(obj1.lastname);
            instance.getAll(obj2.id, (err, result) => {
              expect(err).to.not.exist;
              expect(result.id).to.equal(obj2.id);
              expect(result.firstname).to.equal(obj2.firstname);
              expect(result.lastname).to.equal(obj2.lastname);
              done();
            });
          });
        });
      });
    });

    it('Should return undefined if not inserted', (done) => {
      let instance = new JsonCollection({ name: 'test' });
      instance.getAll(1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.not.exist;
        done();
      });
    });
    
  });

  describe('Delete object', () => {

    it('Should be able to delete an object', (done) => {
      let obj = { id: 1, firstname: 'Jesus', lastname: 'Seijas'};
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj.id, obj, (err) => {
        expect(err).to.not.exsit;
        instance.getAll(obj.id, (err, result) => {
          expect(err).to.not.exist;
          expect(result).to.exist;
          instance.deleteAll(obj.id, (err) => {
            expect(err).to.not.exist;
            instance.getAll(obj.id, (err, result) => {
              expect(err).to.not.exist;
              expect(result).to.not.exist;
              done();
            });
          });
        });
      });
    });

  });

  describe('Get one property', () => {
    it('Should be able to get a property', (done) => {
      let obj = { id: 1, firstname: 'Jesus', lastname: 'Seijas'};
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj.id, obj, (err) => {
        expect(err).to.not.exsit;
        instance.get(obj.id, 'firstname', (err, result) => {
          expect(err).to.not.exist;
          expect(result).to.exist;
          expect(result).to.equal(obj.firstname);
          done();
        });
      });
    });
  });

  describe('Set one property', () => {
    it('Should be able to set a property', (done) => {
      let obj = { id: 1, firstname: 'Jesus', lastname: 'Seijas'};
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj.id, obj, (err) => {
        expect(err).to.not.exsit;
        instance.set(obj.id, 'firstname', 'Manolo', (err) => {
          expect(err).to.not.exist;
          instance.getAll(obj.id, (err, result) => {
            expect(err).to.not.exsit;
            expect(result).to.exist;
            expect(result.id).to.equal(obj.id);
            expect(result.firstname).to.equal('Manolo');
            expect(result.lastname).to.equal(obj.lastname);
            done();
          });
        });
      });
    });
  });

  describe('Delete one property', () => {
    it('Should be able to delete a property', (done) => {
      let obj = { id: 1, firstname: 'Jesus', lastname: 'Seijas'};
      let instance = new JsonCollection({ name: 'test' });
      instance.setAll(obj.id, obj, (err) => {
        expect(err).to.not.exist;
        instance.delete(obj.id, 'firstname', (err) => {
          expect(err).to.not.exist;
          instance.getAll(obj.id, (err, result) => {
            expect(err).to.not.exsit;
            expect(result).to.exist;
            expect(result.id).to.equal(obj.id);
            expect(result.firstname).to.not.exist;
            expect(result.lastname).to.equal(obj.lastname);
            done();
          });
        });
      });
    });
  });

});
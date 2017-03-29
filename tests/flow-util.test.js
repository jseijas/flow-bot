/* global it, describe */
import { expect } from 'chai';
import FlowUtil from '../src/util/flow-util';
import _ from 'lodash';

function checkNames(names, name, value) {
  names.push(name);
  return value;
}

var srcobj = {
  prop1: 'Prop 1',
  prop2: 'Prop 2',
  prop3: ['A', 'B', 'C', 4, 5],
  prop4: {
    prop41: 'Prop 41',
    prop42: ['a', 'b']
  }
};

describe('Flow Util', () => {

  describe('traverse', () => {
    it('Should visit all the properties of the object', () => {

      var obj = _.clone(srcobj);
      var names = [];
      FlowUtil.traverse([],obj, checkNames.bind(this, names));
      expect(names).to.deep.equal(['prop1', 'prop2', 'prop3', 'prop3[0]', 'prop3[1]', 'prop3[2]', 'prop3[3]', 'prop3[4]', 'prop4', 'prop4.prop41', 'prop4.prop42', 'prop4.prop42[0]', 'prop4.prop42[1]']);
    });

    it('Must allow to define a type to visit', () => {

      var obj = _.clone(srcobj);
      var names = [];
      FlowUtil.traverse(['string'],obj, checkNames.bind(this, names));
      expect(names).to.deep.equal(['prop1', 'prop2', 'prop3[0]', 'prop3[1]', 'prop3[2]', 'prop4.prop41', 'prop4.prop42[0]', 'prop4.prop42[1]']);
    });
  });

});

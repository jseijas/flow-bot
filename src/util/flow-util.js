import _ from 'lodash';

/**
 * Static class for the utils.
 */
class FlowUtil {

  static mustExecute(types, value) {
    if (!types || (_.isArray(types) && types.length === 0)) {
      return true;
    }
    return (types.indexOf(typeof value) >= 0);
  }

  static traverse(types, name, obj, fn) {
    if (!fn) {
      fn = obj;
      obj = name;
      name = '';
    }
    if (_.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        let objName = name + '[' + i + ']';
        if (FlowUtil.mustExecute(types, obj[i])) {
          obj[i] = fn(objName, obj[i]);
        }
        FlowUtil.traverse(types, objName, obj[i], fn);
      }
    } else if (_.isPlainObject(obj)) {
      for (var propname in obj) {
        let objName = name === '' ? propname : name + '.' + propname;
        if (FlowUtil.mustExecute(types, obj[propname])) {
          obj[propname] = fn(objName, obj[propname]);
        }
        FlowUtil.traverse(types, objName, obj[propname], fn); 
      }
    }
  }

}

export default FlowUtil;

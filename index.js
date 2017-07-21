'use strict';

const dotProp = require('dot-prop');

/**
 * Extends the object with values parsed from process.env object using the '_'
 * char as delimitator for nested properties.
 * @param  {object} obj The object to extend with environment variables
 * @param  {string} namespace Restrict envs parsed to those in that path
 */
function extend(obj, namespace) {
  const prefix = namespace
    .replace(/\./g, '_')
    .toUpperCase();

  Object.keys(process.env)
    .filter(key => {
      return key.startsWith(prefix);
    })
    .sort((a, b) => a.length - b.length)
    .forEach(key => {
      const val = JSON.parse(process.env[key]);
      let start = prefix.length;

      if (key.length > prefix.length && key[prefix.length] === '_') {
        start += 1;
      }
      const path = key
        .substring(start)
        .replace(/_/g, '.')
        .toLowerCase();

      dotProp.set(obj, path, val);
    });
}

module.exports = extend;

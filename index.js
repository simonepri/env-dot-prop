'use strict';

const dotProp = require('dot-prop');

/**
 * Extends the object with values parsed from process.env object using the '_'
 * char as delimitator for nested properties.
 * @param  {object} obj The object to extend with environment variables
 * @param  {string} prefix Restrict envs parsed to those starting with this prefix
 */
function extend(obj, prefix) {
  Object.keys(process.env)
    .filter(key => {
      return key.startsWith(prefix);
    })
    .forEach(key => {
      const val = JSON.parse(process.env[key]);

      const path = key
        .slice(prefix.length)
        .replace(/_/g, '.')
        .toLowerCase();

      dotProp.set(obj, path, val);
    });
}

module.exports = {
  extend
};

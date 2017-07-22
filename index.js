'use strict';

const dotProp = require('dot-prop');

/**
 * Converts a dot-path to an underscore-path.
 * @param  {string} path Lowercased string separated by dots
 * @return {string} Capitalized string separated by underscores
 */
function toUnderscore(path) {
  return path
    .replace(/\./g, '_')
    .toUpperCase();
}

/**
 * Converts an underscore-path to an dot-path.
 * @param  {string} env Capitalized string separated by underscores
 * @return {string} Lowercased string separated by dots
 */
function toDot(env) {
  return env
    .replace(/_/g, '.')
    .toLowerCase();
}

/**
 * Returns the values of env keys at the path specified.
 * @param  {string} path Dot separated path
 * @param  {} [defaultValue] Default value to return if there aren't keys in
 * the path provided
 * @return {} The value at the path specified
 */
function get(path, defaultValue) {
  let obj;
  const prefix = toUnderscore(path);

  Object.keys(process.env)
    .filter(key => key.startsWith(prefix))
    .sort((a, b) => a.length - b.length)
    .forEach(key => {
      const val = JSON.parse(process.env[key]);
      let start = prefix.length;

      if (key.length > prefix.length && key[prefix.length] === '_') {
        start += 1;
      }
      const path = toDot(key.substring(start));
      console.log(path);
      if (path === '') {
        obj = val;
      } else {
        if (typeof obj !== 'object') {
          obj = {};
        }
        dotProp.set(obj, path, val);
      }
    });

  if (obj === undefined) {
    return defaultValue;
  }
  return obj;
}

/**
 * Sets an env key at the path specified. If nested keys are present they will
 * be deleted.
 * @param  {string} path Dot separated path
 * @param  {} value Value to set
 */
function set(path, value) {
  const prefix = toUnderscore(path);
  del(path);
  process.env[prefix] = value;
}

/**
 * Deletes an env key at the path specified. If nested keys are present they will
 * be deleted too.
 * @param  {string} path Dot separated path
 */
function del(path) {
  const prefix = toUnderscore(path);
  Object.keys(process.env)
    .filter(key => key.startsWith(prefix))
    .forEach(key => {
      delete process.env[key];
    });
}

/**
 * Returns wheather an env key exists at the path specified.
 * @param  {string} path Dot separated path
 * @return {} true if at least an env key with that path exists
 */
function has(path) {
  const prefix = toUnderscore(path);
  return Object.keys(process.env)
    .filter(key => key.startsWith(prefix))
    .length > 0;
}

module.exports = {
  get,
  set,
  del,
  has
};

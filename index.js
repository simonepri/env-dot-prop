'use strict';

const dotProp = require('dot-prop');
const circularJSON = require('circular-json');

/**
 * Converts a dot-path to an underscore-path.
 * @private
 * @param  {string} path String separated by dots.
 * @return {string} String separated by underscores.
 */
function toUnderscore(path) {
  return transform(path, '.', '_');
}

/**
 * Converts an underscore-path to a dot-path.
 * @private
 * @param  {string} env String separated by underscores.
 * @return {string} String separated by dots.
 */
function toDot(env) {
  return transform(env, '_', '.');
}

/**
 * Returns the values of env keys at the path specified.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {string} [defaultValue] Default value to return if there aren't keys in
 * the path provided.
 * @param  {object} [opts] Additional options.
 * @param  {boolean} [opts.parse] If true the value returned is parsed using circular-json.
 * @return {string} The value at the path specified.
 * @param  {boolean} [opts.caseSensitive] If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 */
function get(path, defaultValue, opts) {
  let obj;
  const args = [].slice.call(arguments);
  path = args.shift();
  if (typeof args[args.length - 1] === 'object') {
    opts = args.pop();
  }
  defaultValue = stringify(args.pop());

  keys(path, opts)
    .sort((a, b) => a.length - b.length)
    .forEach(key => {
      let dotp = toDot(key, opts);
      if (!opts || !opts.caseSensitive) {
        dotp = dotp.toLowerCase();
      }

      const val = parse(process.env[key], opts);
      if (dotp === '') {
        obj = val;
      } else {
        if (typeof obj !== 'object') {
          obj = {};
        }
        dotProp.set(obj, dotp, val);
      }
    });

  let prefix = path;
  if (!opts || !opts.caseSensitive) {
    prefix = prefix.toLowerCase();
  }
  if (path === '') {
    return parse(obj, opts);
  }
  return parse(dotProp.get(obj, prefix, defaultValue), opts);
}

/**
 * Sets an env key at the path specified. If nested keys are present they will
 * be deleted.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {string} value Value to set.
 * @param  {object} [opts] Additional options.
 * @param  {boolean} [opts.stringify] If true the value passed is stringified using circular-json.
 * @param  {boolean} [opts.caseSensitive] If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 */
function set(path, value, opts) {
  let env = toUnderscore(path);
  if (!opts || !opts.caseSensitive) {
    env = env.toUpperCase();
  }

  del(path, opts);
  process.env[env] = stringify(value, opts);
}

/**
 * Deletes an env key at the path specified. If nested keys are present they will
 * be deleted too.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {object} [opts] Additional options.
 * @param  {boolean} [opts.caseSensitive] If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 */
function del(path, opts) {
  return keys(path, opts)
    .forEach(key => {
      delete process.env[key];
    });
}

/**
 * Returns whether an env key exists at the path specified.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {object} [opts] Additional options.
 * @return {boolean} true if at least an env key with that path exists.
 * @param  {boolean} [opts.caseSensitive] If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 */
function has(path, opts) {
  return keys(path, opts).length > 0;
}

function transform(str, from, to) {
  let out = '';
  const escaped = '\\' + to;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === to) {
      out += escaped;
    } else if (str[i] === from) {
      out += to;
    } else if (str[i] === '\\' && i + 1 < str.length && str[i + 1] === from) {
      out += from;
      i++;
    } else {
      out += str[i];
    }
  }
  return out;
}

function keys(path, opts) {
  let env = toUnderscore(path);

  if (!opts || !opts.caseSensitive) {
    env = env.toUpperCase();
    return Object.keys(process.env)
      .filter(key => key.toUpperCase().startsWith(env));
  }
  return Object.keys(process.env)
    .filter(key => key.startsWith(env));
}

function parse(str, opts) {
  if (typeof str !== 'string') {
    return str;
  }

  let ret;
  if (opts && opts.parse) {
    try {
      ret = circularJSON.parse(str);
    } catch (err) {
      ret = String(str);
    }
  } else {
    ret = String(str);
  }
  return ret;
}

function stringify(val, opts) {
  if (typeof val === 'string') {
    return val;
  }

  let ret;
  if (opts && opts.stringify) {
    try {
      ret = circularJSON.stringify(val);
    } catch (err) {
      ret = String(val);
    }
  } else {
    ret = String(val);
  }
  return ret;
}

module.exports = {
  get: get,
  set: set,
  delete: del,
  has: has
};

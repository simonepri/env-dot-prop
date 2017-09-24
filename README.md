# env-dot-prop
[![Travis CI](https://travis-ci.org/simonepri/env-dot-prop.svg?branch=master)](https://travis-ci.org/simonepri/env-dot-prop) [![Codecov](https://img.shields.io/codecov/c/github/simonepri/env-dot-prop/master.svg)](https://codecov.io/gh/simonepri/env-dot-prop) [![npm](https://img.shields.io/npm/dm/env-dot-prop.svg)](https://www.npmjs.com/package/env-dot-prop) [![npm version](https://img.shields.io/npm/v/env-dot-prop.svg)](https://www.npmjs.com/package/env-dot-prop) [![npm dependencies](https://david-dm.org/simonepri/env-dot-prop.svg)](https://david-dm.org/simonepri/env-dot-prop) [![npm dev dependencies](https://david-dm.org/simonepri/env-dot-prop/dev-status.svg)](https://david-dm.org/simonepri/env-dot-prop#info=devDependencies)
> ♻️ Get, set, or delete nested properties of process.env using a dot path


## Install

```
$ npm install --save env-dot-prop
```

## Usage

```js
const envDotProp = require('env-dot-prop');

// Let's assume process.env contains the following keys
process.env = {
  FOO_BAR: 'unicorn',
  'FOO_DOT.DOT': 'pony',
  'FOO_UND\\_UND': 'whale'
};

console.log(process.env);
// => { FOO_BAR: 'unicorn', 'FOO_DOT.DOT': 'pony', 'FOO_UND\_UND': 'whale' }
envDotProp.get('');
// => { foo: { bar: 'unicorn', 'dot.dot': 'pony', und_und: 'whale' } }

// getter
envDotProp.get('foo.bar');
// => 'unicorn'

envDotProp.get('foo.notDefined.deep');
// => undefined

envDotProp.get('foo.notDefined.deep', 'default value');
// => 'default value'

envDotProp.get('foo.dot\\.dot');
// => 'pony'

// setter
envDotProp.set('foo.bar', 'b');
envDotProp.get('foo.bar');
// => 'b'

envDotProp.get('');
// => { foo: { bar: 'b', 'dot.dot': 'pony', und_und: 'whale' } }

envDotProp.set('foo.baz.e', 'x');
envDotProp.get('foo.baz.e');
// => 'x'
envDotProp.get('foo.baz');
// => { e: 'x' }

envDotProp.get('');
// => { foo: { bar: 'b', baz: { e: 'x' }, 'dot.dot': 'pony', und_und: 'whale' } }

// has
envDotProp.has('foo.bar');
// => true

// deleter
envDotProp.delete('foo.bar');
envDotProp.get('foo');
// => { baz: { e: 'x' }, 'dot.dot': 'pony', und_und: 'whale' }

envDotProp.delete('foo.baz.e');
envDotProp.get('foo.baz');
// => undefined

envDotProp.set('parse', 42);
envDotProp.get('parse');
// => '42'
envDotProp.get('parse', {parse: true});
// => 42

envDotProp.get('');
// => { parse: '42', foo: { 'dot.dot': 'pony', und_und: 'whale' } }
console.log(process.env);
// => { 'FOO_DOT.DOT': 'pony', 'FOO_UND\_UND': 'whale', PARSE: '42' }
```

## API

<a name="get"></a>

## get(path, [defaultValue], [opts]) ⇒ <code>string</code>
Returns the values of env keys at the path specified.

**Returns**: <code>string</code> - The value at the path specified.   

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Dot separated path. |
| [defaultValue] | <code>string</code> | Default value to return if there aren't keys in the path provided. |
| [opts] | <code>object</code> | Additional options. |
| [opts.parse] | <code>boolean</code> | If true the value returned is parsed using [`circular-json`](https://github.com/WebReflection/circular-json). |
| [opts.caseSensitive] | <code>boolean</code> | If true no case conversion is performed from the dot path provided to the env key search.<br>Eg: 'tesT.kEy' will look for `tesT_kEy` environment variable instead of `TEST_KEY`. |

<a name="set"></a>

## set(path, value, [opts])
Sets an env key at the path specified. If nested keys are present they will be deleted.
Assigning a property on `process.env` will implicitly convert the value to a string.
See the [node documentation](https://nodejs.org/api/process.html#process_process_env) for more information.


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Dot separated path. |
| value | <code>string</code> | Value to set. |
| [opts] | <code>object</code> | Additional options. |
| [opts.stringify] | <code>boolean</code> | If true the value passed is stringified using [`circular-json`](https://github.com/WebReflection/circular-json). |
| [opts.caseSensitive] | <code>boolean</code> | If true no case conversion is performed from the dot path provided to the env key search.<br>Eg: 'tesT.kEy' will look for `tesT_kEy` environment variable instead of `TEST_KEY`. |

<a name="del"></a>

## del(path, [opts])
Deletes an env key at the path specified. If nested keys are present they will
be deleted too.


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Dot separated path. |
| [opts] | <code>object</code> | Additional options. |
| [opts.caseSensitive] | <code>boolean</code> | If true no case conversion is performed from the dot path provided to the env key search.<br>Eg: 'tesT.kEy' will look for `tesT_kEy` environment variable instead of `TEST_KEY`. |

<a name="has"></a>

## has(path, [opts]) ⇒ <code>boolean</code>
Returns whether an env key exists at the path specified.

**Returns**: <code>boolean</code> - true if at least an env key with that path exists.   

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Dot separated path. |
| [opts] | <code>object</code> | Additional options. |
| [opts.caseSensitive] | <code>boolean</code> | If true no case conversion is performed from the dot path provided to the env key search.<br>Eg: 'tesT.kEy' will look for `tesT_kEy` environment variable instead of `TEST_KEY`. |

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/env-dot-prop/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

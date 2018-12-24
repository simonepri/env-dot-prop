<h1 align="center">
  <a href="https://github.com/simonepri/env-dot-prop"><img src="./media/env-dot-prop.png" alt="env-dot-prop" /></a>
</h1>
<p align="center">
  <!-- CI - TravisCI -->
  <a href="https://travis-ci.com/simonepri/env-dot-prop">
    <img src="https://img.shields.io/travis/com/simonepri/env-dot-prop/master.svg?label=MacOS%20%26%20Linux" alt="Mac/Linux Build Status" />
  </a>
  <!-- CI - AppVeyor -->
  <a href="https://ci.appveyor.com/project/simonepri/env-dot-prop">
    <img src="https://img.shields.io/appveyor/ci/simonepri/env-dot-prop/master.svg?label=Windows" alt="Windows Build status" />
  </a>
  <!-- Coverage - Codecov -->
  <a href="https://codecov.io/gh/simonepri/env-dot-prop">
    <img src="https://img.shields.io/codecov/c/github/simonepri/env-dot-prop/master.svg" alt="Codecov Coverage report" />
  </a>
  <!-- DM - Snyk -->
  <a href="https://snyk.io/test/github/simonepri/env-dot-prop?targetFile=package.json">
    <img src="https://snyk.io/test/github/simonepri/env-dot-prop/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" />
  </a>
  <!-- DM - David -->
  <a href="https://david-dm.org/simonepri/env-dot-prop">
    <img src="https://david-dm.org/simonepri/env-dot-prop/status.svg" alt="Dependency Status" />
  </a>

  <br/>

  <!-- Code Style - XO-Prettier -->
  <a href="https://github.com/xojs/xo">
    <img src="https://img.shields.io/badge/code_style-XO+Prettier-5ed9c7.svg" alt="XO Code Style used" />
  </a>
  <!-- Test Runner - AVA -->
  <a href="https://github.com/avajs/ava">
    <img src="https://img.shields.io/badge/test_runner-AVA-fb3170.svg" alt="AVA Test Runner used" />
  </a>
  <!-- Test Coverage - Istanbul -->
  <a href="https://github.com/istanbuljs/nyc">
    <img src="https://img.shields.io/badge/test_coverage-NYC-fec606.svg" alt="Istanbul Test Coverage used" />
  </a>
  <!-- Init - ni -->
  <a href="https://github.com/simonepri/ni">
    <img src="https://img.shields.io/badge/initialized_with-ni-e74c3c.svg" alt="NI Scaffolding System used" />
  </a>
  <!-- Release - np -->
  <a href="https://github.com/sindresorhus/np">
    <img src="https://img.shields.io/badge/released_with-np-6c8784.svg" alt="NP Release System used" />
  </a>

  <br/>

  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/env-dot-prop">
    <img src="https://img.shields.io/npm/v/env-dot-prop.svg" alt="Latest version on npm" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/env-dot-prop/tree/master/license">
    <img src="https://img.shields.io/github/license/simonepri/env-dot-prop.svg" alt="Project license" />
  </a>
</p>
<p align="center">
  ♻️ Get, set, or delete nested properties of process.env using a dot path
  <br/>

  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>

## Background

This package aim to let you access to your environment variables as if they were JavaScript object.
See [this guide][12factorsguide] to understand how to use this package to create a [12 Factor compliant][12factors] configuration system for you app.

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

envDotProp.set('n1', 42, {stringify: false});
envDotProp.get('n1', {parse: false});
// => 42
envDotProp.get('n1', {parse: true});
// => 42

envDotProp.set('n2', 42, {stringify: true});
envDotProp.get('n2', {parse: false});
// => '42'
envDotProp.get('n2', {parse: true});
// => 42

envDotProp.set('n3', 42);
envDotProp.get('n3');
// => 42

envDotProp.set('n4', '42');
envDotProp.get('n4');
// => '42'

envDotProp.get('');
// => { n1: '42', n1: 42, n3: 42, n4: '42', foo: { 'dot.dot': 'pony', und_und: 'whale' } }
console.log(process.env);
// => { 'FOO_DOT.DOT': 'pony', 'FOO_UND\_UND': 'whale', N1: '42', N2: 42, N3: 42, N4: '42' }
```

## API

<a name="get"></a>

## get(path, [defaultValue], [opts]) ⇒ <code>any</code>
Gets the values of environment variables at the path specified.

**Kind**: global function  
**Returns**: <code>any</code> - The values of environment variables associated with the path specified.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | Dot separated path. |
| [defaultValue] | <code>any</code> |  | Default value to return if there is not any environment variable that matches the path provided. |
| [opts] | <code>Object</code> |  | Additional options. |
| [opts.parse] | <code>boolean</code> | <code>false</code> | If true the value retrieved is converted to the proper type. |
| [opts.caseSensitive] | <code>boolean</code> | <code>false</code> | If true no case conversion will be performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY. |

<a name="set"></a>

## set(path, value, [opts])
Sets an env key at the path specified. If nested keys are present they will
be deleted.

**Kind**: global function  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | Dot separated path. |
| value | <code>string</code> |  | Value to set. |
| [opts] | <code>object</code> |  | Additional options. |
| [opts.stringify] | <code>boolean</code> | <code>false</code> | If true the value provided is converted to string. |
| [opts.caseSensitive] | <code>boolean</code> | <code>false</code> | If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY. |

<a name="del"></a>

## del(path, [opts])
Deletes an env key at the path specified.
If nested keys are present they will be deleted too.

**Kind**: global function  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | A dot separated path. |
| [opts] | <code>object</code> |  | Additional options. |
| [opts.caseSensitive] | <code>boolean</code> | <code>false</code> | If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY. |

<a name="has"></a>

## has(path, [opts]) ⇒ <code>boolean</code>
Returns whether an env key exists at the path specified.

**Kind**: global function  
**Returns**: <code>boolean</code> - true if exists at least one environment variables with that
path prefix.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | Dot separated path. |
| [opts] | <code>object</code> |  | Additional options. |
| [opts.caseSensitive] | <code>boolean</code> | <code>false</code> | If true no case conversion is performed from the dot path provided to the env key search. Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY. |

## Authors

- **Simone Primarosa** - *Github* ([@simonepri][github:simonepri]) • *Twitter* ([@simoneprimarosa][twitter:simoneprimarosa])

See also the list of [contributors][contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [license][license] file for details.


<!-- Links -->
[start]: https://github.com/simonepri/env-dot-prop#start-of-content
[new issue]: https://github.com/simonepri/env-dot-prop/issues/new
[contributors]: https://github.com/simonepri/env-dot-prop/contributors

[license]: https://github.com/simonepri/env-dot-prop/tree/master/license

[github:simonepri]: https://github.com/simonepri
[twitter:simoneprimarosa]: http://twitter.com/intent/user?screen_name=simoneprimarosa

[12factors]: https://12factor.net/config
[12factorsguide]: https://github.com/simonepri/env-dot-prop/wiki/Create-a-12-factor-compliant-configuration-system

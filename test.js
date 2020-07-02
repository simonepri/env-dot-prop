const test = require('ava');
const m = require('.');

test.beforeEach(t => {
  t.context.env = Object.assign({}, process.env);
  process.env = {};
});

test.afterEach(t => {
  process.env = t.context.env;
});

test.serial('should get the envs correctly when parse is enabled', t => {
  process.env.TEST = 5;
  t.is(m.get('test', {parse: true}), 5);
  process.env.TEST = 0.5;
  t.is(m.get('test', {parse: true}), 0.5);
  process.env.TEST = true;
  t.is(m.get('test', {parse: true}), true);
  process.env.TEST = Infinity;
  t.is(m.get('test', {parse: true}), Infinity);
  process.env.TEST = -Infinity;
  t.is(m.get('test', {parse: true}), -Infinity);
  process.env.TEST = undefined;
  t.is(m.get('test', {parse: true}), undefined);
  process.env.TEST = null;
  t.is(m.get('test', {parse: true}), null);
  process.env.TEST = NaN;
  t.is(m.get('test', {parse: true}), NaN);
  process.env.TEST = [];
  t.deepEqual(m.get('test', {parse: true}), []);
  process.env.TEST = [1, '2', {a: 3, b: 4}, true, null];
  t.deepEqual(m.get('test', {parse: true}), [1, '2', {a: 3, b: 4}, true, null]);
  process.env.TEST = {};
  t.deepEqual(m.get('test', {parse: true}), {});
  process.env.TEST = {a: 42};
  t.deepEqual(m.get('test', {parse: true}), {a: 42});
  const a = {b: 5};
  a.a = a;
  process.env.TEST = a;
  t.deepEqual(m.get('test', {parse: true}), a);

  process.env.TEST = '5';
  t.is(m.get('test', {parse: true}), 5);
  process.env.TEST = '0.5';
  t.is(m.get('test', {parse: true}), 0.5);
  process.env.TEST = 'true';
  t.is(m.get('test', {parse: true}), true);
  process.env.TEST = 'Infinity';
  t.is(m.get('test', {parse: true}), Infinity);
  process.env.TEST = '-Infinity';
  t.is(m.get('test', {parse: true}), -Infinity);
  process.env.TEST = 'undefined';
  t.is(m.get('test', {parse: true}), undefined);
  process.env.TEST = 'null';
  t.is(m.get('test', {parse: true}), null);
  process.env.TEST = 'NaN';
  t.is(m.get('test', {parse: true}), NaN);
  process.env.TEST = '[]';
  t.deepEqual(m.get('test', {parse: true}), []);
  process.env.TEST = '[1,"2",{"a":3,"b":4},true,null]';
  t.deepEqual(m.get('test', {parse: true}), [1, '2', {a: 3, b: 4}, true, null]);
  process.env.TEST = '{}';
  t.deepEqual(m.get('test', {parse: true}), {});
  process.env.TEST = '{"a":42}';
  t.deepEqual(m.get('test', {parse: true}), {a: 42});
  process.env.TEST = '}{';
  t.is(m.get('test', {parse: true}), '}{');
});

test.serial('should set the envs correctly when stringify is enabled', t => {
  m.set('test', 5, {stringify: true});
  t.is(process.env.TEST, '5');
  m.set('test', 0.5, {stringify: true});
  t.is(process.env.TEST, '0.5');
  m.set('test', true, {stringify: true});
  t.is(process.env.TEST, 'true');
  m.set('test', Infinity, {stringify: true});
  t.is(process.env.TEST, 'Infinity');
  m.set('test', -Infinity, {stringify: true});
  t.is(process.env.TEST, '-Infinity');
  m.set('test', undefined, {stringify: true});
  t.is(process.env.TEST, 'undefined');
  m.set('test', null, {stringify: true});
  t.is(process.env.TEST, 'null');
  m.set('test', NaN, {stringify: true});
  t.is(process.env.TEST, 'NaN');
  m.set('test', {}, {stringify: true});
  t.is(process.env.TEST, '{}');
  m.set('test', {a: 42}, {stringify: true});
  t.is(process.env.TEST, '{"a":42}');
  m.set('test', [], {stringify: true});
  t.is(process.env.TEST, '[]');
  m.set('test', [1, '2', {a: 3, b: 4}, true, null], {stringify: true});
  t.is(process.env.TEST, '[1,"2",{"a":3,"b":4},true,null]');

  m.set('test', '5', {stringify: true});
  t.is(process.env.TEST, '5');
  m.set('test', '0.5', {stringify: true});
  t.is(process.env.TEST, '0.5');
  m.set('test', 'Infinity', {stringify: true});
  t.is(process.env.TEST, 'Infinity');
  m.set('test', '-Infinity', {stringify: true});
  t.is(process.env.TEST, '-Infinity');
  m.set('test', 'undefined', {stringify: true});
  t.is(process.env.TEST, 'undefined');
  m.set('test', 'null', {stringify: true});
  t.is(process.env.TEST, 'null');
  m.set('test', 'NaN', {stringify: true});
  t.is(process.env.TEST, 'NaN');
  m.set('test', '{}', {stringify: true});
  t.is(process.env.TEST, '{}');
  m.set('test', '{"a":42}', {stringify: true});
  t.is(process.env.TEST, '{"a":42}');
  m.set('test', '[]', {stringify: true});
  t.is(process.env.TEST, '[]');
  m.set('test', '[1,"2",{"a":3,"b":4},true,null]', {stringify: true});
  t.is(process.env.TEST, '[1,"2",{"a":3,"b":4},true,null]');

  const a = {b: 5};
  a.a = a;
  t.throws(() => m.set('test', a, {stringify: true}));
});

test.serial('should get the envs correctly when parse is disabled', t => {
  process.env.TEST = 5;
  t.is(m.get('test', {parse: false}), 5);
  process.env.TEST = 0.5;
  t.is(m.get('test', {parse: false}), 0.5);
  process.env.TEST = true;
  t.is(m.get('test', {parse: false}), true);
  process.env.TEST = Infinity;
  t.is(m.get('test', {parse: false}), Infinity);
  process.env.TEST = -Infinity;
  t.is(m.get('test', {parse: false}), -Infinity);
  process.env.TEST = undefined;
  t.is(m.get('test', {parse: false}), undefined);
  process.env.TEST = null;
  t.is(m.get('test', {parse: false}), null);
  process.env.TEST = NaN;
  t.is(m.get('test', {parse: false}), NaN);
  process.env.TEST = [];
  t.deepEqual(m.get('test', {parse: false}), []);
  process.env.TEST = [1, '2', {a: 3, b: 4}, true, null];
  t.deepEqual(m.get('test', {parse: false}), [
    1,
    '2',
    {a: 3, b: 4},
    true,
    null
  ]);
  process.env.TEST = {};
  t.deepEqual(m.get('test', {parse: false}), {});
  process.env.TEST = {a: 42};
  t.deepEqual(m.get('test', {parse: false}), {a: 42});
  const a = {b: 5};
  a.a = a;
  process.env.TEST = a;
  t.deepEqual(m.get('test', {parse: false}), a);

  process.env.TEST = '5';
  t.is(m.get('test', {parse: false}), '5');
  process.env.TEST = '0.5';
  t.is(m.get('test', {parse: false}), '0.5');
  process.env.TEST = 'true';
  t.is(m.get('test', {parse: false}), 'true');
  process.env.TEST = 'Infinity';
  t.is(m.get('test', {parse: false}), 'Infinity');
  process.env.TEST = '-Infinity';
  t.is(m.get('test', {parse: false}), '-Infinity');
  process.env.TEST = 'undefined';
  t.is(m.get('test', {parse: false}), 'undefined');
  process.env.TEST = 'null';
  t.is(m.get('test', {parse: false}), 'null');
  process.env.TEST = 'NaN';
  t.is(m.get('test', {parse: false}), 'NaN');
  process.env.TEST = '[]';
  t.is(m.get('test', {parse: false}), '[]');
  process.env.TEST = '[1,"2",{"a":3,"b":4},true,null]';
  t.is(m.get('test', {parse: false}), '[1,"2",{"a":3,"b":4},true,null]');
  process.env.TEST = '{}';
  t.is(m.get('test', {parse: false}), '{}');
  process.env.TEST = '{"a":42}';
  t.is(m.get('test', {parse: false}), '{"a":42}');
});

test.serial('should set the envs correctly when stringify is disabled', t => {
  m.set('test', 5, {stringify: false});
  t.is(process.env.TEST, 5);
  m.set('test', 0.5, {stringify: false});
  t.is(process.env.TEST, 0.5);
  m.set('test', Infinity, {stringify: false});
  t.is(process.env.TEST, Infinity);
  m.set('test', -Infinity, {stringify: false});
  t.is(process.env.TEST, -Infinity);
  m.set('test', undefined, {stringify: false});
  t.is(process.env.TEST, undefined);
  m.set('test', NaN, {stringify: false});
  t.is(process.env.TEST, NaN);
  m.set('test', [], {stringify: false});
  t.deepEqual(process.env.TEST, []);
  m.set('test', [1, '2', {a: 3, b: 4}, true, null], {stringify: false});
  t.deepEqual(process.env.TEST, [1, '2', {a: 3, b: 4}, true, null]);

  m.set('test', '5', {stringify: false});
  t.is(process.env.TEST, '5');
  m.set('test', '0.5', {stringify: false});
  t.is(process.env.TEST, '0.5');
  m.set('test', 'Infinity', {stringify: false});
  t.is(process.env.TEST, 'Infinity');
  m.set('test', '-Infinity', {stringify: false});
  t.is(process.env.TEST, '-Infinity');
  m.set('test', 'undefined', {stringify: false});
  t.is(process.env.TEST, 'undefined');
  m.set('test', 'NaN', {stringify: false});
  t.is(process.env.TEST, 'NaN');
  m.set('test', '[]', {stringify: false});
  t.is(process.env.TEST, '[]');
  m.set('test', '[1,"2",{"a":3,"b":4},true,null]', {stringify: false});
  t.is(process.env.TEST, '[1,"2",{"a":3,"b":4},true,null]');

  const a = {b: 5};
  a.a = a;
  m.set('test', a, {stringify: false});
  t.deepEqual(process.env.TEST, a);
});

test.serial('should return an object for nested envs', t => {
  process.env.TEST_ONE = '5';
  t.is(typeof m.get('test'), 'object');
  t.is(m.get('test', {parse: false}).one, '5');
});

test.serial('should return a value for full env path', t => {
  process.env.TEST_ONE = '5';
  t.is(m.get('test.one', {parse: false}), '5');
});

test.serial('should return the default value', t => {
  t.is(m.get('i.n.v.a.l.i.d', 42), 42);
  t.deepEqual(m.get('i.n.v.a.l.i.d', {a: 1}, {}), {a: 1});
  t.is(m.get('i.n.v.a.l.i.d', {}), undefined);
});

test.serial(
  "should return false if the environment variable doesn't exists",
  t => {
    t.is(m.has('i.n.v.a.l.i.d'), false);
  }
);

test.serial('should return true if the environment variable exists', t => {
  m.set('v.a.l.i.d', false);
  t.is(m.has('v.a.l.i.d'), true);
});

test.serial('should delete existing environment variable', t => {
  process.env.EXISTING_KEY = '0';
  m.delete('existing.key');
  t.is(process.env.EXISTING_KEY, undefined);
});

test.serial('should delete inexistent environment variable', t => {
  m.delete('inexistent.key');
  t.is(process.env.INEXISTING_KEY, undefined);
});

test.serial('should allow keys containing dots', t => {
  process.env['..'] = 'ciao';
  t.is(m.get('\\.\\.'), 'ciao');
});

test.serial('should allow keys containing underscores', t => {
  process.env['\\_\\_'] = 'hola';
  t.is(m.get('__'), 'hola');
});

test.serial('should allow to get non-capitalized env keys', t => {
  process.env.UnIcOrNs_will_RULE_tHe_W0rlD = 'true';
  t.is(m.get('unicorns.will.rule.the.w0rld', {parse: false}), 'true');
  t.is(m.get('unicorns.will.rule.the.w0rld', {caseSensitive: true}), undefined);
  t.is(
    m.get('UnIcOrNs.will.RULE.tHe.W0rlD', {caseSensitive: true, parse: false}),
    'true'
  );
});

test.serial('should work with the empty string env variable', t => {
  process.env = {
    '': 'test'
  };
  t.is(m.get(''), 'test');
  process.env = {
    _a: 'a',
    _b: 'b'
  };
  t.deepEqual(m.get(''), {'': {a: 'a', b: 'b'}});
  m.set('', 'only this should exists');
  t.is(m.get(''), 'only this should exists');
});

test.serial('should work if some env vars overlap', t => {
  process.env = {
    KEY: 'this must be ignored',
    KEY_A: 'a',
    KEY_B: 'b'
  };
  t.deepEqual(m.get(''), {key: {a: 'a', b: 'b'}});
  t.deepEqual(m.get('key'), {a: 'a', b: 'b'});
});

test.serial('should pass readme examples', t => {
  process.env = {
    FOO_BAR: 'unicorn',
    'FOO_DOT.DOT': 'pony',
    'FOO_UND\\_UND': 'whale'
  };
  t.deepEqual(m.get(''), {
    foo: {bar: 'unicorn', 'dot.dot': 'pony', und_und: 'whale'}
  });
  t.is(m.get('foo.bar'), 'unicorn');
  t.is(m.get('foo.notDefined.deep'), undefined);
  t.is(m.get('foo.notDefined.deep', 'default value'), 'default value');
  t.is(m.get('foo.dot\\.dot'), 'pony');
  m.set('foo.bar', 'b');
  t.is(m.get('foo.bar'), 'b');
  t.deepEqual(m.get(''), {
    foo: {bar: 'b', 'dot.dot': 'pony', und_und: 'whale'}
  });
  m.set('foo.baz.e', 'x');
  t.is(m.get('foo.baz.e'), 'x');
  t.deepEqual(m.get('foo.baz'), {e: 'x'});
  t.deepEqual(m.get(''), {
    foo: {bar: 'b', baz: {e: 'x'}, 'dot.dot': 'pony', und_und: 'whale'}
  });
  t.is(m.has('foo.bar'), true);
  m.delete('foo.bar');
  t.deepEqual(m.get('foo'), {
    baz: {e: 'x'},
    'dot.dot': 'pony',
    und_und: 'whale'
  });
  m.delete('foo.baz.e');
  t.is(m.get('foo.baz'), undefined);
  m.set('n2', 42, {stringify: false});
  t.is(m.get('n2', {parse: false}), 42);
  t.is(m.get('n2', {parse: true}), 42);
  m.set('n1', 42, {stringify: true});
  t.is(m.get('n1', {parse: false}), '42');
  t.is(m.get('n1', {parse: true}), 42);
  m.set('n3', 42);
  t.is(m.get('n3'), 42);
  m.set('n4', '42');
  t.is(m.get('n4'), '42');
  t.deepEqual(m.get(''), {
    foo: {'dot.dot': 'pony', und_und: 'whale'},
    n1: '42',
    n2: 42,
    n3: 42,
    n4: '42'
  });
});

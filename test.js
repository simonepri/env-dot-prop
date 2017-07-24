import test from 'ava';
import m from '.';

test('should return an object for nested envs', t => {
  process.env.TEST_ONE = 5;
  t.is(typeof m.get('test'), 'object');
  t.is(m.get('test').one, '5');
  delete process.env.TEST_ONE;
});

test('should return a value for full env path', t => {
  process.env.TEST_ONE = 5;
  t.is(m.get('test.one'), '5');
  delete process.env.TEST_ONE;
});

test('should return the default value', t => {
  t.is(m.get('a.b', 0), '0');
});

test('should set the environment variable', t => {
  m.set('a.b', 0);
  t.is(process.env.A_B, '0');
  delete process.env.A_B;
});

test('should return false if the environment variable doesn\'t exists', t => {
  t.is(m.has('a.b'), false);
});

test('should return true if the environment variable exists', t => {
  m.set('key', false);
  t.is(m.has('key'), true);
  delete process.env.A_B;
});

test('should delete existing environment variable', t => {
  process.env.EXISTING_KEY = 0;
  m.delete('existing.key');
  t.is(process.env.EXISTING_KEY, undefined);
});

test('should delete inexistent environment variable', t => {
  m.delete('inexistent.key');
  t.is(process.env.INEXISTING_KEY, undefined);
});

test('should allow keys containing dots', t => {
  process.env['..'] = 'ciao';
  t.is(m.get('\\.\\.'), 'ciao');
  delete process.env['..'];
});

test('should allow keys containing underscores', t => {
  process.env['\\_\\_'] = 'hola';
  t.is(m.get('__'), 'hola');
  delete process.env['\\_\\_'];
});

test('should allow to get non-capitalized env keys', t => {
  process.env.UnIcOrNs_will_RULE_tHe_W0rlD = 'true';
  t.is(m.get('unicorns.will.rule.the.w0rld'), 'true');
  t.is(m.get('unicorns.will.rule.the.w0rld', {caseSensitive: true}), 'undefined');
  t.is(m.get('UnIcOrNs.will.RULE.tHe.W0rlD', {caseSensitive: true}), 'true');
  delete process.env.UnIcOrNs_will_RULE_tHe_W0rlD;
});

test('should parse a boolean with the parse option', t => {
  process.env.test = 'true';
  t.is(m.get('test'), 'true');
  t.is(m.get('test', {parse: true}), true);
  delete process.env.test;
});

test('should parse a number with the parse option', t => {
  process.env.test = '5';
  t.is(m.get('test'), '5');
  t.is(m.get('test', {parse: true}), 5);
  delete process.env.test;
});

test('shouldn\'t parse a string with the parse option', t => {
  process.env.test = 'hello';
  t.is(m.get('test'), 'hello');
  t.is(m.get('test', {parse: true}), 'hello');
  delete process.env.test;
});

test('should parse an object with the parse option', t => {
  process.env.test = '{"hero": "superman"}';
  t.is(m.get('test'), '{"hero": "superman"}');
  t.is(m.get('test', {parse: true}).hero, 'superman');
  delete process.env.test;
});

test('should stringify an object with the stringify option', t => {
  m.set('test', {value: 42});
  t.is(m.get('test', {parse: true}), '[object Object]');
  m.set('test', {value: 42}, {stringify: true});
  t.deepEqual(m.get('test', {parse: true}), {value: 42});
  delete process.env.test;
});

test('shouldn\'t stringify a string with the stringify option', t => {
  m.set('test', 'hello world');
  t.is(m.get('test'), 'hello world');
  m.set('test', 'hello world', {stringify: true});
  t.deepEqual(m.get('test'), 'hello world');
  delete process.env.test;
});

test('should pass README examples', t => {
  const env = process.env;
  process.env = {
    FOO_BAR: 'unicorn',
    'FOO_DOT.DOT': 'pony',
    'FOO_UND\\_UND': 'whale'
  };
  t.deepEqual(m.get(''), {foo: {bar: 'unicorn', 'dot.dot': 'pony', und_und: 'whale'}});
  t.is(m.get('foo.bar'), 'unicorn');
  t.is(m.get('foo.notDefined.deep'), 'undefined');
  t.is(m.get('foo.notDefined.deep', 'default value'), 'default value');
  t.is(m.get('foo.dot\\.dot'), 'pony');
  m.set('foo.bar', 'b');
  t.is(m.get('foo.bar'), 'b');
  t.deepEqual(m.get(''), {foo: {bar: 'b', 'dot.dot': 'pony', und_und: 'whale'}});
  m.set('foo.baz.e', 'x');
  t.is(m.get('foo.baz.e'), 'x');
  t.deepEqual(m.get('foo.baz'), {e: 'x'});
  t.deepEqual(m.get(''), {foo: {bar: 'b', baz: {e: 'x'}, 'dot.dot': 'pony', und_und: 'whale'}});
  t.is(m.has('foo.bar'), true);
  m.delete('foo.bar');
  t.deepEqual(m.get('foo'), {baz: {e: 'x'}, 'dot.dot': 'pony', und_und: 'whale'});
  m.delete('foo.baz.e');
  t.is(m.get('foo.baz'), 'undefined');
  m.set('parse', 42);
  t.is(m.get('parse'), '42');
  t.is(m.get('parse', {parse: true}), 42);
  t.deepEqual(m.get(''), {foo: {'dot.dot': 'pony', und_und: 'whale'}, parse: '42'});
  process.env = env;
});

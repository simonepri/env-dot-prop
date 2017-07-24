import test from 'ava';
import m from '.';

test('Should return an object for nested envs', t => {
  process.env.TEST_ONE = 5;
  t.is(typeof m.get('test'), 'object');
  t.is(m.get('test').one, 5);
  delete process.env.TEST_ONE;
});

test('Should return a value for full env path', t => {
  process.env.TEST_ONE = 5;
  t.is(m.get('test.one'), 5);
  delete process.env.TEST_ONE;
});

test('should return the default value', t => {
  t.is(m.get('a.b', 0), 0);
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

test('should pass README examples', t => {
  process.env = {
    FOO_BAR: 'unicorn',
    'FOO_DOT.DOT': 'pony',
    'FOO_UND\\_UND': 'whale'
  };

  t.is(m.get('foo.bar'), 'unicorn');
  t.is(m.get('foo.notDefined.deep'), undefined);
  t.is(m.get('foo.notDefined.deep', 'default value'), 'default value');
  t.is(m.get('foo.dot\\.dot'), 'pony');
  m.set('foo.bar', 'b');
  t.is(m.get('foo.bar'), 'b');
  m.set('foo.baz.e', 'x');
  t.is(m.get('foo.baz.e'), 'x');
  t.deepEqual(m.get('foo.baz'), {e: 'x'});
  t.is(m.has('foo.bar'), true);
  m.delete('foo.baz.e');
  t.is(m.get('foo.baz'), undefined);
});

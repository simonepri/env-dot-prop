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

test('Default value', t => {
  t.is(m.get('a.b', 0), 0);
});

test('Set environment variable', t => {
  m.set('a.b', 0);
  t.is(process.env.A_B, '0');
  delete process.env.A_B;
});

test('Check whether environment variable exists', t => {
  t.is(m.has('a.b', 0), false);
});

test('Delete environment variable exists', t => {
  process.env.A_B = 0;
  m.delete('a.b');
  t.is(process.env.A_B, undefined);
});

test('Transform fails', t => {
  process.env['..'] = 'ciao';
  t.is(m.get('..'), undefined);
  delete process.env['..'];
});

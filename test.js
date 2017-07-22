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

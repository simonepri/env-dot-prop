import test from 'ava';
import m from '.';

test('empty test', t => {
  const obj = {};
  process.env.TEST_ONE = 5;

  m.extend(obj, 'TEST');
  console.log(obj);
  t.is(obj.one, 5);
  delete process.env.TEST_ONE;
});

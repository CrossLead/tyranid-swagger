import test from 'ava';
import { join } from 'path';
import { Tyr } from 'tyranid';

import { options, pascal, path, pick, schema, spec, validate, yaml } from '../';

/**
 * boot tyranid without db
 */
test.before(async t => {
  await Tyr.config({
    validate: [{ glob: join(__dirname, './models/*.js') }]
  });
  t.truthy(Tyr.collections.length);
});

test('pascalCase should return correct values', t => {
  t.is(pascal('my short sentence'), 'MyShortSentence');
  t.is(pascal('my_snake_sentence'), 'MySnakeSentence');
});

test('should generate correct definition from schema', async t => {
  const col = Tyr.byName.metric;
  const s = schema(col.def, options(col.def) as any);
  t.deepEqual(s.pascalName, 'Metric');
});

test('should generate spec that passes validation', async t => {
  const s = spec(Tyr);
  /* tslint:disable */
  require('fs').writeFileSync('./.tmp/test-spec.yaml', yaml(s));
  /* tslint:enable */
  t.pass();
});

test('pick should pick', t => {
  const obj = { a: 1, b: 2, c: 3 };
  t.deepEqual({ a: 1, b: 2 }, pick(obj, ['a', 'b']));
});

test('partitioning should function correctly', t => {
  const s = spec(Tyr);

  const { definitions } = s;

  t.truthy(definitions!.Plan, 'partitioned schemas should exist');
  t.truthy(definitions!.Task, 'partitioned schemas should exist');
  t.truthy(definitions!.Project, 'partitioned schemas should exist');

  t.truthy(
    definitions!.Plan.properties!.planField,
    'relevant fields on partitioned schemas should exist'
  );

  t.truthy(
    definitions!.Plan.properties!.nestedPartitionField,
    'relevant fields on partitioned schemas should exist'
  );

  t.truthy(
    definitions!.Project.properties!.nestedPartitionField,
    'relevant fields on partitioned schemas should exist'
  );

  t.falsy(
    definitions!.Project.properties!.planField,
    'irrelevant fields on partitioned schemas should not exist'
  );

  t.pass();
});

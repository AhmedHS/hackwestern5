import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | schedule_task', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:schedule-task');
    assert.ok(route);
  });
});

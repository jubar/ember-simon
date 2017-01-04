import { moduleFor, test } from 'ember-qunit';

moduleFor('service:simon', 'Unit | Service | simon', {
  // needs: ['service:foo']
});

test('New game reset values', function(assert) {
  let service = this.subject();
  service.newGame();

  assert.ok(service.get('isPlaying'), 'User is playing.');
  assert.notOk(service.get('isGameOver'), 'Game over is false.');
  assert.equal(service.get('currentIndex'), 0, 'Current index is 0.');
  assert.equal(service.get('sequence.length'), 1, 'Has one value in the sequence.');
});

test('End game reset values', function(assert) {
  let service = this.subject();
  service.newGame();
  service.endGame(5);

  assert.notOk(service.get('isPlaying'), 'User is not playing.');
  assert.ok(service.get('isGameOver'), 'The game is over.');
});

test('Values should be between 1 and 4', function(assert) {
  let service = this.subject();
  let value = service.getNewValue();
  assert.ok(value >= 1 && value <= 4, 'Value is correct.');
});

test('Check movement with a correct value increment sequence', function(assert) {
  let service = this.subject();
  service.newGame();
  service.set('sequence', [1]);

  let result = service.checkMovement(1);
  assert.ok(result, 'First value is correct.');
  assert.equal(service.get('currentIndex'), 0, 'Current index is 0.');
  assert.equal(service.get('sequence.length'), 2, 'Added one item into the sequence.');
});

test('Check movement with a correct value increment the index', function(assert) {
  let service = this.subject();
  service.newGame();
  service.set('sequence', [1, 2]);
  service.checkMovement(1);

  assert.equal(service.get('currentIndex'), 1, 'Current index was incremented.');
});

test('Check movement with an incorrect value', function(assert) {
  let service = this.subject();
  service.newGame();
  service.set('sequence', [1]);
  let result = service.checkMovement(2);

  assert.notOk(result, 'The value is incorrect.');
  assert.ok(service.get('isGameOver'), 'Game over.');
  assert.notOk(service.get('isPlaying'), 'Is not playing.');
});

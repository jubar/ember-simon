import Ember from 'ember';
import { task } from 'ember-concurrency';
import { animate } from 'ember-simon/utils/animate';
import { EKMixin, getCode, keyDown } from 'ember-keyboard';

const { Component, inject: { service }, computed, observer } = Ember;

export default Component.extend(EKMixin, {
  tagName: '',
  simon: service(),
  sequence: computed.alias('simon.sequence'),
  gameOver: computed.alias('simon.isGameOver'),

  animateMovement: task(function * (value) {
    let animElement = Ember.$(`#btn-${value}`);
    let body = Ember.$('body');

    body.addClass(`color-${value}`);

    yield animate(animElement, 'simon-btn__active');

    body.removeClass(`color-${value}`);
    this.get('simon').checkMovement(value);
  }).enqueue(),

  didSequenceChange: observer('simon.sequence.[]', function() {
    this.get('onSequenceChange')();
  }),

  didGameOver: observer('simon.isGameOver', function() {
    this.get('onGameOver')();
  }),

  move: Ember.on(
    keyDown('KeyH'),
    keyDown('KeyJ'),
    keyDown('KeyK'),
    keyDown('KeyL'),
    keyDown('Enter'),
    function(e) {
      switch (getCode(e)) {
        case 'KeyH':
          this.get('animateMovement').perform(1);
          break;
        case 'KeyJ':
          this.get('animateMovement').perform(2);
          break;
        case 'KeyK':
          this.get('animateMovement').perform(3);
          break;
        case 'KeyL':
          this.get('animateMovement').perform(4);
          break;
      }
    }
  ),

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);
  }
});

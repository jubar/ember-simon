/*jshint loopfunc: true */
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, getCode, keyDown } from 'ember-keyboard';

const { Component, inject: { service }, computed, observer } = Ember;

export default Component.extend(EKMixin, {
  simon: service(),
  isPlayingSequence: false,
  isPlaying: computed.alias('simon.isPlaying'),
  sequence: computed.alias('simon.sequence'),
  gameOver: computed.alias('simon.isGameOver'),

  playSequence: task(function * () {
    this.set('isPlayingSequence', true);
    // Wait some milliseconds before to start the new sequence
    yield timeout(800);
    let index = 0;
    let endsAt = this.get('sequence.length') - 1;
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    while (index <= endsAt) {
      let currentValue = this.get('sequence').objectAt(index);

      Ember.$(`#btn-${currentValue}`)
        .addClass('simon-btn__active')
        .one(animationEnd, function() {
          Ember.$(`#btn-${currentValue}`).removeClass('simon-btn__active');
        });
      yield timeout(500);
      index++;
    }

    this.set('isPlayingSequence', false);
  }).drop(),

  animateMovement: task(function * (value) {
    if (this.get('isPlayingSequence')) {
      return;
    }

    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    Ember.$(`#btn-${value}`)
      .addClass('simon-btn__active')
      .one(animationEnd, function() {
        Ember.$(`#btn-${value}`).removeClass('simon-btn__active');
      });
    yield timeout(500);
    this.get('simon').checkMovement(value);
  }).enqueue(),

  didSequenceChange: observer('simon.sequence.[]', function() {
    this.get('playSequence').perform();
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
        case 'Enter':
          this.get('simon').newGame();
          break;
      }
    }
  ),

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);
  },

  actions: {
    newGame() {
      this.get('simon').newGame();
    },

    didChoose(color) {
      this.get('animateMovement').perform(color);
    }
  }
});

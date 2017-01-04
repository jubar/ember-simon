/*jshint loopfunc: true */
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { Component, inject: { service }, computed, observer } = Ember;

export default Component.extend({
  simon: service(),
  isPlayingSequence: false,
  isPlaying: computed.alias('simon.isPlaying'),
  sequence: computed.alias('simon.sequence'),
  gameOver: computed.alias('simon.isGameOver'),

  playSequence: task(function * () {
    this.set('isPlayingSequence', true);
    // Wait some milliseconds before to start the new sequence
    yield timeout(500);
    let index = 0;
    let endsAt = this.get('sequence.length') - 1;
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    while (index <= endsAt) {
      let currentValue = this.get('sequence').objectAt(index);
      this.$(`#btn-${currentValue}`)
        .addClass('simon-btn__active')
        .one(animationEnd, () => {
          Ember.$(`#btn-${currentValue}`).removeClass('simon-btn__active');
        });
      yield timeout(700);
      index++;
    }

    this.set('isPlayingSequence', false);
  }).drop(),

  animateMovement: task(function * (value) {
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    Ember.$(`#btn-${value}`)
      .addClass('simon-btn__active')
      .one(animationEnd, () => {
        Ember.$(`#btn-${value}`).removeClass('simon-btn__active');
      });
    yield timeout(700);
    this.get('simon').checkMovement(value);
  }).restartable(),

  didSequenceChange: observer('simon.sequence.[]', function() {
    this.get('playSequence').perform();
  }),

  actions: {
    newGame() {
      this.get('simon').newGame();
    },

    didChoose(color) {
      this.get('animateMovement').perform(color);
    }
  }
});

/*jshint loopfunc: true */
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { animate } from 'ember-simon/utils/animate';

const { Component, inject: { service }, computed } = Ember;

export default Component.extend({
  tagName: '',
  simon: service(),
  showIntro: false,
  sequence: computed.alias('simon.sequence'),

  playSequence: task(function * () {
    // Wait some milliseconds before to start the new sequence
    yield timeout(500);
    let index = 0;
    let endsAt = this.get('sequence.length') - 1;
    let body = Ember.$('body');

    while (index <= endsAt) {
      let currentValue = this.get('sequence').objectAt(index);
      let animElement = Ember.$(`#btn-${currentValue}`);

      body.addClass(`color-${currentValue}`);

      yield animate(animElement, 'simon-btn__active');

      body.removeClass(`color-${currentValue}`);
      index++;
    }

    this.get('onSequenceCompleted')();
  }).drop(),

  init() {
    this._super(...arguments);

    if (this.get('sequence').length === 1) {
      this.set('showIntro', true);
    } else {
      this.set('showIntro', false);
      this.get('playSequence').perform();
    }
  },

  actions: {
    startSequence() {
      this.get('playSequence').perform();
    }
  }
});

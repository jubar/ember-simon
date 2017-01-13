/*jshint loopfunc: true */
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { animate } from 'ember-simon/utils/animate';

const { Component } = Ember;

export default Component.extend({
  value: '',
  steps: ['3', '2', '1', 'GO!'],

  animateStep: task(function * () {
    yield timeout(300);
    let i = 0;
    let endsAt = this.get('steps').length - 1;
    let animElement = Ember.$('.steps');

    while(i <= endsAt) {
      let currentValue = this.get('steps').objectAt(i);
      this.set('value', currentValue);

      animElement.removeClass('hide');

      yield animate(animElement, 'zoomInDown');

      if (i < endsAt) {
        animElement.addClass('hide');
      }

      i++;
    }

    yield animate(animElement, 'bounceOut go');

    animElement.addClass('hide');

    this.get('onIntroEnds')();
  }).drop(),

  init() {
    this._super(...arguments);
    this.get('animateStep').perform();
  }
});

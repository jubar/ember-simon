/*jshint loopfunc: true */
import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { Component } = Ember;

export default Component.extend({
  value: '',
  steps: ['3', '2', '1', 'GO!'],

  animateStep: task(function * () {
    yield timeout(300);
    let i = 0;
    let endsAt = this.get('steps').length - 1;
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    let animElement = Ember.$('.steps');

    while(i <= endsAt) {
      let currentValue = this.get('steps').objectAt(i);
      this.set('value', currentValue);

      animElement.removeClass('hide').addClass('zoomInDown')
        .one(animationEnd, () => {
          animElement.removeClass('zoomInDown');
          if (i < endsAt) {
            animElement.addClass('hide');
          }
        });
      yield timeout(1300);
      i++;
    }

    animElement.addClass('bounceOut go')
      .one(animationEnd, () => {
        animElement.removeClass('zoomInDown bounceOut go').addClass('hide');
      });

    yield timeout(600);

    this.get('onIntroEnds')();
  }).drop(),

  init() {
    this._super(...arguments);
    this.get('animateStep').perform();
  }
});

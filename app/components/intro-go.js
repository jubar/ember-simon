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

    while(i <= endsAt) {
      let currentValue = this.get('steps').objectAt(i);
      this.set('value', currentValue);

      Ember.$('.steps').removeClass('hide').addClass('zoomInDown')
        .one(animationEnd, () => {
          Ember.$('.steps').removeClass('zoomInDown');
          if (i < endsAt) {
            Ember.$('.steps').addClass('hide');
          }
        });
      yield timeout(1300);
      i++;
    }

    Ember.$('.steps').addClass('bounceOut go')
      .one(animationEnd, () => {
        Ember.$('.steps').removeClass('zoomInDown bounceOut go').addClass('hide');
      });

    yield timeout(600);

    this.get('onIntroEnds')();
  }).drop(),

  init() {
    this._super(...arguments);
    this.get('animateStep').perform();
  }
});

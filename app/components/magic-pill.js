import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, keyDown } from 'ember-keyboard';

const { Component, computed, computed: { alias }, inject: { service } } = Ember;

export default Component.extend(EKMixin, {
  simon: service(),
  classNames: ['pill'],

  letter: alias('pill.letter'),
  posX: alias('pill.posX'),
  posY: alias('pill.posY'),
  speed: alias('pill.speed'), // Milliseconds

  posCollitionY: computed(function() {
    return Ember.$(window).height() - 50;
  }), // Position of the collition.

  movePill: task(function * () {
    let animElement = this.$();
    while(this.get('posY') <= this.get('posCollitionY')) {
      animElement.css('transform', `translateY(${this.get('posY')}px)`);
      yield timeout(this.get('speed'));
      this.incrementProperty('posY', 50);
    }
    console.log('Perdiste');
    Ember.$('.simon-btn').addClass('sepia');
    this.get('simon').destroyPill();
  }).drop(),

  move: Ember.on(
    keyDown('KeyA'),
    function() {
      console.log('Zafamos!');
      this.get('simon').destroyPill();
    }
  ),

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);
    this.get('movePill').perform();
  }
});

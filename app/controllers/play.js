import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  actions: {
    didSequenceChange() {
      this.transitionToRoute('play-sequence');
    },

    didGameOver() {
      this.transitionToRoute('game-over');
    }
  }
});

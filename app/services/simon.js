import Ember from 'ember';

const { Service } = Ember;

export default Service.extend({
  isPlaying: false,
  isGameOver: false,
  currentIndex: 0,
  sequence: Ember.A(),

  getNewValue() {
    // TODO: Research a better way to generate random values.
    return Math.floor((Math.random()*4)+1);
  },

  checkMovement(value) {
    let currentIndex = this.get('currentIndex');
    let currentValue = this.get('sequence').objectAt(currentIndex);

    if (value === currentValue) {
      if (currentIndex === this.get('sequence.length') - 1) {
        this.set('currentIndex', 0);
        this.get('sequence').pushObject(this.getNewValue());
      } else {
        this.incrementProperty('currentIndex');
      }
      return true;
    } else {
      this.endGame();
      return false;
    }
  },

  endGame() {
    this.setProperties({
      isGameOver: true,
      isPlaying: false
    });
  },

  newGame() {
    this.setProperties({
      isPlaying: true,
      currentIndex: 0,
      isGameOver: false,
      sequence: Ember.A([this.getNewValue()])
    });
  },

});

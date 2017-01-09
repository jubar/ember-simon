import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
  simon: service(),

  beforeModel() {
    if (this.get('simon.isPlaying')) {
      this.transitionTo('play-sequence');
    }
  }
});

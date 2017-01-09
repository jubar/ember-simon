import Ember from 'ember';

const { Controller, inject: { service }, computed } = Ember;

export default Controller.extend({
  simon: service(),
  sequence: computed.alias('simon.sequence'),
  currentIndex: computed.alias('simon.currentIndex')
});

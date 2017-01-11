import Ember from 'ember';

const { Controller, inject: { service }, computed } = Ember;

export default Controller.extend({
  simon: service(),

  pills: computed.alias('simon.pills')
});

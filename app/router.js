import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('play');
  this.route('play-sequence');
  this.route('game-over');
});

export default Router;

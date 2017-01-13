import Ember from 'ember';

const ANIMATION_END_EVENT = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
const { RSVP } = Ember;

export function animate(element, cssClass) {
  return new RSVP.Promise(function(resolve) {
    element
      .one(ANIMATION_END_EVENT, function() {
        element.removeClass(cssClass);
        resolve();
      })
      .addClass(cssClass);
  });
}

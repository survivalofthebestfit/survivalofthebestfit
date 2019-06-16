import $ from 'jquery';
import EVENTS from '~/public/game/controllers/constants/events';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class {
    constructor(options) {
        this.$el = $('#js-endgame-overlay');
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.set('#js-endgame-overlay', {y: 50, opacity: 0});
        TweenLite.to('#js-endgame-overlay', 0.3, {y: 0, opacity: 1, ease: Power1.easeOut});
    }

    hide() {
        TweenLite.to('#js-endgame-overlay', 0.2, {y: 20, opacity: 0, ease: Power1.easeOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        this._removeEventListeners();
        this.hide();
    }
}


import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {waitForSeconds, setCanvasBackground, getDateString} from '~/public/game/controllers/common/utils';

export default class extends UIBase {
    constructor(options) {
        super();
        this._removeEventListeners();
        this.$el = $('#TransitionOverlay');
        this.$conversationBox = this.$el.find('.conversationBox');
        this.$date = this.$el.find('.header__date');
        if (options && options.show) {
            this.$date.html(`${getDateString()}`);
            this.show();
            this._addEventListeners();
            // setTimeout(() => this.exit(),1000); // debugging only
        }
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.EXIT_TRANSITION_STAGE, this.exit.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.EXIT_TRANSITION_STAGE, this.exit.bind(this));
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        TweenLite.to('#TransitionOverlay', 0.4, {opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    exit() {
        setCanvasBackground({color: 'pink'});
        $('body').addClass(CLASSES.TRAINING_BACKGROUND);
        this.$el.addClass('pink-background');
        this.hide();
        waitForSeconds(0.6).then(() => {
            TweenLite.delayedCall(0.7, () => {
                gameFSM.nextStage();
            });
        });
    }

    destroy() {
        super.dispose();
        this._removeEventListeners();
        this.$el.remove();
    }
}

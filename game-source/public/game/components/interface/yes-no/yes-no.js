import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import {CLASSES, EVENTS, SOUNDS} from '~/public/game/controllers/constants';
import * as state from '~/public/game/controllers/common/state';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {spotlight} from '~/public/game/components/pixi/manual-stage/office';
import {eventEmitter, pixiApp, officeStageContainer} from '~/public/game/controllers/game/gameSetup.js';
import {isMobile} from '~/public/game/controllers/common/utils.js';
import {OFFICE_PEOPLE_CONTAINER} from '~/public/game/controllers/constants/pixi-containers.js';
import * as sound from '~/public/game/controllers/game/sound.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$id = '.js-yes-no';
        this.$el = $('.js-yes-no'); // This should be a single element
        this.$yesButton = this.$el.find('.js-yes');
        this.$noButton = this.$el.find('.js-no');
        this._addEventListeners();
        this.hasBeenClicked = false;
        this.shownOnce = false;
        this.personHeight = 100;
    }

    _acceptClicked(e) {
        // whenever you want to log an event in Google Analytics, just call one of these functions with appropriate names
        gtag('event', 'accept', {
            'event_category': 'default',
            'event_label': 'accept/reject',
        });
        if (!this.hasBeenClicked) {
            eventEmitter.emit(EVENTS.HIDE_MANUAL_INSTRUCTIONS, {});
            this.hasBeenClicked = true;
        };
        this.$yesButton.addClass(CLASSES.ACCEPTED);
        if (candidateInSpot != null) {
            eventEmitter.emit(EVENTS.ACCEPTED, {});
            this.hide();
        }
    }

    _rejectClicked(e) {
        sound.play(SOUNDS.BUTTON_CLICK);
        // whenever you want to log an event in Google Analytics, just call one of these functions with appropriate names
        gtag('event', 'reject', {
            'event_category': 'default',
            'event_label': 'accept/reject',
        });
        if (!this.hasBeenClicked) {
            eventEmitter.emit(EVENTS.HIDE_MANUAL_INSTRUCTIONS, {});
            this.hasBeenClicked = true;
        };
        this.$noButton.addClass(CLASSES.REJECTED);
        if (candidateInSpot != null) {
            eventEmitter.emit(EVENTS.REJECTED, {});
            this.hide();
        }
    }

    _addEventListeners() {
        this.$yesButton.click(this._acceptClicked.bind(this));
        this.$noButton.click(this._rejectClicked.bind(this));
        eventEmitter.on(EVENTS.MANUAL_STAGE_DONE, this._stageEndHandler, this);
        eventEmitter.on(EVENTS.CHANGE_SPOTLIGHT_STATUS, this._spotlightStatusHandler, this);
    };

    _removeEventListeners() {
        this.$yesButton.off();
        this.$noButton.off();
        eventEmitter.off(EVENTS.MANUAL_STAGE_DONE, this._stageEndHandler, this);
        eventEmitter.off(EVENTS.CHANGE_SPOTLIGHT_STATUS, this._spotlightStatusHandler, this);
    }

    _stageEndHandler() {
        if (state.get('hiring-stage-success') && state.get('hiring-stage-number') >= 2) {
            console.log('we are done with manual hiring, destroy yes and no buttons');
            this.destroy();
        }
    }

    _spotlightStatusHandler({spotlightOccupied, spotlightFill}) {
        const {height} = officeStageContainer.getChildByName(OFFICE_PEOPLE_CONTAINER).getChildAt(0);
        this.personHeight = height;
        if (spotlightOccupied) {
            spotlightFill ? '' : this.hide();
        } else {
            spotlightFill ? this.show() : '';
        }
    }

    show() {
        this.$el.css({
            'top': `${spotlight.y - this.personHeight - (isMobile() ? 20 : 40 )}px`, // get person height
            'left': `${spotlight.x + 10}px`,
        });
        TweenLite.set(this.$id, {y: 5, xPercent: -50, opacity: 0});
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to(this.$id, 0.2, {y: 0, opacity: 1, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.removeClass(CLASSES.IS_INACTIVE);
        });
    }

    hide() {
        TweenLite.to(this.$id, 0.3, {y: 5, opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.remove();
    }
}

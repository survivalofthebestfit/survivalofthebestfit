import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {getDateString} from '~/public/game/controllers/common/utils';
import StatisticsCard from '~/public/game/components/interface/ml/statistics-card/statistics-card';

export default class extends UIBase {
    constructor(options) {
        super();
        this._removeEventListeners();
        this.$el = $('#StatsConversation');
        new StatisticsCard(true);
        new StatisticsCard(false);  
        this.$conversationBox = this.$el.find('.conversationBox');
        this.$date = this.$el.find('.header__date');
        if (options && options.show) {
            this.$date.html(`${getDateString()}`);
            this.show();
            this._addEventListeners();
        }
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.EXIT_STATS_CONVERSATION, this.exit.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.EXIT_STATS_CONVERSATION, this.exit.bind(this));
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        TweenLite.to('#StatsOverlay', 0.4, {opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    exit() {
        this.hide();
    }

    destroy() {
        super.dispose();
        this._removeEventListeners();
        this.$el.remove();
    }
}

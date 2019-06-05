import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {waitForSeconds} from '~/public/game/controllers/common/utils';


export default class extends UIBase {
    constructor() {
        super();
        this.$el = $('#js-person-tooltip');
        this.isActive = false;
    }

    // show new tooltip
    // if the tooltip is still shown (=active)...
    // then hide it first and show the new tooltip only once the old tooltip is hidden
    // if no tooltip is active when the function is called then show new content immediately

    showNewTooltip(...args) {
        if (this.isActive) {
            this.hide();
            TweenLite.delayedCall(0.5, () => {
                this.setContent(...args);
                this.show();
                this.scheduleDeactivation();
            });
        } else {
            this.setContent(...args);
            this.show();
            this.scheduleDeactivation();
        }
    }

    setContent({index, parentContainer, message}) {
        let personContainer;
        try {
            personContainer = parentContainer.getChildAt(index);
        } catch (error) {
            personContainer = undefined;
        };
        if (personContainer === undefined) return;
        const {x, y} = personContainer.getGlobalPosition();
        const height = personContainer.height;
        if (message) this.$el.find('.PersonTooltip__text').text(message);
        this.$el.css({
            'top': `${y-height*0.8}px`,
            'left': `${x+10}px`,
        });
    }

    scheduleDeactivation() {
        waitForSeconds(1).then(()=> {
            if (this.isActive) this.hide();
        });
    }

    show() {
        TweenLite.set('#js-person-tooltip', {y: 5, opacity: 0});
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to('#js-person-tooltip', 0.2, {y: 0, opacity: 1, ease: Power1.easeInOut});
        this.isActive = true;
    }

    hide() {
        TweenLite.to('#js-person-tooltip', 0.2, {y: 5, opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.4, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
        this.isActive = false;
    }

    destroy() {
        super.dispose();
        this.hide();
    }
}

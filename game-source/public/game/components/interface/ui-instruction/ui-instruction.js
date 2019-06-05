import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {spotlight} from '~/public/game/components/pixi/manual-stage/office';
import {eventEmitter, pixiApp, officeStageContainer} from '~/public/game/controllers/game/gameSetup.js';
import {waitForSeconds} from '~/public/game/controllers/common/utils';
import {OFFICE_PEOPLE_CONTAINER} from '~/public/game/controllers/constants/pixi-containers.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$id = '#js-instruction';
        this.$el = $(`${this.$id}`); // This should be a single element
        this.$textbox = this.$el.find('.Instruction');
        this.$textEl = this.$el.find('.Instruction__content');
        this.state = null;
        this.enabled = true;
        this._addEventListeners();
    }

    setContent(content) {
        this.$textEl.text(content);
    }

    reveal({type}) {
        this.state = type;
        switch (type) {
        case 'manual-click':
            waitForSeconds(0.5).then(() => {
                this.setContent(txt.instructions.manual.click);
                const peopleLine = officeStageContainer.getChildByName(OFFICE_PEOPLE_CONTAINER);
                const {width: peopleLineWidth} = peopleLine;
                const {x: peopleLineX, y: peopleLineY} = peopleLine.getChildAt(0).getGlobalPosition();
                const {height: peopleHeight} = officeStageContainer.getChildByName(OFFICE_PEOPLE_CONTAINER).getChildAt(0);
                this.$el.css({
                    'bottom': 'unset',
                    'top': `${peopleLineY - peopleHeight - 20}px`,
                    'left': `${peopleLineX + peopleLineWidth/2}px`,
                });
                this.show();
            });
            break;
        case 'manual-eval-show':
            this.hide();
            waitForSeconds(1).then(() => {
                if (!this.enabled) return;
                this.setContent(txt.instructions.manual.eval);
                this.$el.css({
                    'bottom': 'unset',
                    'top': `${spotlight.y + 10}px`,
                    'left': `${spotlight.x + 10}px`,
                });
                this.show();
            });
            break;
        case 'manual-eval-hide':
            this.hide();
            break;
        default:
            throw new Error('invalid type!');
        }
    }

    disableInstructions() {
        if (this.state && this.state === 'manual-eval-show') {
            this.hide();
            this.enabled = false;
        }
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.RETURN_CANDIDATE, this.disableInstructions.bind(this));
        eventEmitter.on(EVENTS.UPDATE_INSTRUCTIONS, this.reveal.bind(this));
        eventEmitter.on(EVENTS.HIDE_MANUAL_INSTRUCTIONS, this.disableInstructions.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RETURN_CANDIDATE, this.disableInstructions.bind(this));
        eventEmitter.off(EVENTS.UPDATE_INSTRUCTIONS, this.show.bind(this));
        eventEmitter.off(EVENTS.HIDE_MANUAL_INSTRUCTIONS, this.disableInstructions.bind(this));
    }

    show() {
        TweenLite.set(`${this.$id}`, {y: 5, xPercent: -50, opacity: 0});
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to(`${this.$id}`, 0.2, {y: 0, opacity: 1, ease: Power1.easeInOut});
    }

    hide() {
        TweenLite.to(`${this.$id}`, 0.2, {y: 5, opacity: 0, ease: Power1.easeInOut});
        TweenLite.delayedCall(0.3, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
        this.hide();
    }
}

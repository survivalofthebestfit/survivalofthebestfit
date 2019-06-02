import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';

export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('#js-textbox-overlay'); // This should be a single element
        this.$textEl = this.$el.find('.Textbox__content');
        this.$buttons = this.$el.find('.TextboxButton');
        this.setContent = this.setContent.bind(this);

        this._mainContent = options.content || 'dummy text'; // TODO: change this to null
        this._responseContent = options.responses || ['Okay'];

        this.overlay = options.overlay || false; // TODO think about the overlay
        this.type = options.type || '';
        this.hasTooltip = options.hasTooltip;
        this.stageNumber = options.stageNumber;
        this.isRetry = options.isRetry || false;
        this.isLastMessage = options.isLastMessage;
        this.isTransition = options.isTransition || false;
        this.callback = options.callback;

        this.displayScore = options.displayScore || false;

        if (options.show) this.show();
        this.setContent(); // set content
        this._addEventListeners();
    }

    setContent() {
        if (!this.overlay) this.$el.addClass(CLASSES.IS_TRANSPARENT);
        const scoreText = this.displayScore ? dataModule._calculateScore().concat(' ') : '';
        // only show score feedback after completing stage one
        const emailText = (this.stageNumber === 1 && !this.isRetry) ? 'Good job! '.concat(scoreText, this._mainContent) : this._mainContent;
        this.$textEl.html(emailText);

        this.$buttons.addClass(CLASSES.IS_INACTIVE);
        this._responseContent.forEach((response, index) => {
            const $responseButton = $(this.$buttons[index]);
            $responseButton.removeClass(CLASSES.IS_INACTIVE);
            $responseButton.find('.button__text').html(response);
        });
    }

    _mlStageButtonHandler(e) {
        this.$buttons.addClass(CLASSES.BUTTON_CLICKED);
        this.callback();
        this.destroy();
    }

    _manualStageButtonHandler(e) {
        this.$buttons.addClass(CLASSES.BUTTON_CLICKED);
        if (this.isRetry) {
            eventEmitter.emit(EVENTS.RETRY_INSTRUCTION_ACKED, {
                stageNumber: this.stageNumber,
            });
        }
        else if (this.isTransition) {
            eventEmitter.emit(EVENTS.TRANSITION_INSTRUCTION_ACKED, {
                stageNumber: this.stageNumber,
            });
        }
        else {
            eventEmitter.emit(EVENTS.INSTRUCTION_ACKED, {
                stageNumber: this.stageNumber,
            });
        }
        this.destroy();
    }

    _addEventListeners() {
        if (this.type === CLASSES.ML) {
            this.$buttons.click(this._mlStageButtonHandler.bind(this));
        } else {
            this.$buttons.click(this._manualStageButtonHandler.bind(this));
        }
    }

    _removeEventListeners() {
        // event listeners need to be removed explicitly because they are managed globally Jquery
        this.$buttons.off();
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
        this.hide();
        // this.$el.destroy();
    }
}

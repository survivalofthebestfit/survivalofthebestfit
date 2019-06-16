import $ from 'jquery';
import screenfull from 'screenfull';
import {CLASSES, EVENTS} from '~/public/game/controllers/constants';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {screenSizeDetector, isMobile} from '~public/game/controllers/common/utils';

export default class extends UIBase {
    constructor(options) {
        super();
        this.options = options;
        this.isAtSecondStage = false;
        this.$el = $('.js-titlepage'); // This should be a single element
        this.$headerEl = this.$el.find('.Titlepage__header');
        this.$textEl = this.$el.find('.Titlepage__content');
        this.$buttons = this.$el.find('.TextboxButton');
        this._addEventListeners();
        this.setContent = this.setContent.bind(this);
        this._headerText = options.headerText;
        this._mainContent = options.content; // TODO: change this to null
        this._responseContent = options.responses || ['OK'];
        if (options.show) this.show();
        this.setContent(); // set content
    }

    setContent() {
        this.$headerEl.html(this._headerText);
        this.$textEl.html(this._mainContent);
        this._responseContent.forEach((response, index) => {
            const $responseButton = $(this.$buttons[index]);
            $responseButton.removeClass(CLASSES.IS_INACTIVE);
            $responseButton.find('.button__text').html(response);
        });
    }

    updateContent(options) {
        this.show();
        this.$headerEl.html(options.headerText);
        this.$textEl.html(options.content);
        options.responses.forEach((response, index) => {
            const $responseButton = $(this.$buttons[index]);
            $responseButton.removeClass(CLASSES.IS_INACTIVE);
            $responseButton.find('.button__text').html(response);
        });
    }

    _buttonIsClicked(e) {
        this.$buttons.addClass(CLASSES.BUTTON_CLICKED);
        eventEmitter.emit(EVENTS.TITLE_STAGE_COMPLETED, {});
        if (screenfull.enabled && isMobile()) {
            screenfull.request();
        }
        this.destroy();
    }

    _addEventListeners() {
        this.$buttons.click(this._buttonIsClicked.bind(this));
    }

    _removeEventListeners() {
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
        this.$el.remove();
    }
}

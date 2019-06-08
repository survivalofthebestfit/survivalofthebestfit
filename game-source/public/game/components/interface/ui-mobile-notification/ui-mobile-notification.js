import $ from 'jquery';
import {CLASSES, EVENTS} from '~/public/game/controllers/constants';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js'; //on resize
import {isMobile} from '~/public/game/controllers/common/utils';


export default class {
    constructor() {
        this.orientationValue = 0;
        this.isVisible = false;
        this.isMobile = isMobile();
        this.$el = $('#js-mobile-notification');
        if (window.matchMedia('(orientation: portrait)').matches || this.isMobile) {
            this.show();
            this._addEventListeners();
        };
    }

    _addEventListeners() {
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        eventEmitter.on(EVENTS.RESIZE, this.handleResize, this);
    }

    _removeEventListeners() {
        window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
        eventEmitter.off(EVENTS.RESIZE, this.handleResize, this);
    }

    handleResize() {
        this.isMobile = isMobile();
    }

    handleOrientationChange() {
        console.log(`orientation is ${screen.orientation.angle}`);
        this.isVisible ? this.hide() : this.show();
    }

    show() {
        this.isVisible = true;
        this.$el.removeClass(CLASSES.IS_INACTIVE)
            .removeClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.FADE_IN);
    }

    hide() {
        this.isVisible = false;
        this.$el.removeClass(CLASSES.FADE_IN)
            .addClass(CLASSES.FADE_OUT)
            .addClass(CLASSES.IS_INACTIVE);
    }

    destroy() {
        this._removeEventListeners();
        this.hide();
    }
}

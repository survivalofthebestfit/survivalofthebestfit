import $ from 'jquery';
import screenfull from 'screenfull';
import {Component} from 'component-loader-js';
import CLASSES from '~/public/game/controllers/constants/classes';
import * as sound from '~/public/game/controllers/game/sound';

export default class Footer extends Component {
    constructor() {
        super();
        this.$fullscreenIcon = $('#js-fullscreen');
        this.$soundIcon = $('#js-volume');
        this._addEventListeners();
        if (!screenfull.enabled) {
            this.$fullscreenIcon.addClass(CLASSES.IS_INACTIVE);
        }
    }
    _addEventListeners() {
        this.$fullscreenIcon.click(this._handleFullscreenRequest.bind(this));
        this.$soundIcon.click(this._toggleVolume.bind(this));
        window.addEventListener('beforeunload', this._handlePageLeave.bind(this));
    }

    _removeEventListeners() {
        // event listeners need to be removed explicitly because they are managed globally Jquery
        this.$fullscreenIcon.off();
        this.$soundIcon.off();
    }

    _handlePageLeave() {
        console.log('left the page, turn volume off');
        if (!this.$soundIcon.hasClass(CLASSES.VOLUME_ICON_OFF)) {
            this._toggleVolume();
        }
    }

    _handleFullscreenRequest() {
        this.$fullscreenIcon.toggleClass(CLASSES.FULLSCREEN_ICON_EXPANDED);
        screenfull.toggle();
    }

    _toggleVolume() {
        this.$soundIcon.toggleClass(CLASSES.VOLUME_ICON_OFF);
        sound.toggleVolume();
    }

    destroy() {
        this._removeEventListeners();
        super.dispose();
    }
}

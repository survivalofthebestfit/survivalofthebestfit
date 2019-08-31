import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';


export default class extends UIBase {
    constructor(options) {
        super();
        this._removeEventListeners();
        this.$el = $('.StatsOverlay'); // This should be a single element
        if (options && options.show) {
            this.show();
        }
    }

    _addEventListeners() {
    }

    _removeEventListeners() {
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
        // TODO you might need a delayed call for this
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        // this.$el.destroy();
    }
}

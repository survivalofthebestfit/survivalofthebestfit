import {TweenLite} from 'gsap/TweenMax';
import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {clamp} from '~/public/game/controllers/common/utils';

export default class extends UIBase {
    constructor(options) {
        super();
        this._removeEventListeners();

        this.$el = $('#js-resume');
        this.$nameEl = this.$el.find('.Resume__title');
        this.$taglineEl = this.$el.find('.Resume__tagline');
        this.$scanline = this.$el.find('.Resume__scanline');
        this.$mask = this.$el.find('.Resume__mask');
        this.scanlineAnimDuration = 1.8;
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null
        this._resumeFeatures = options ? options.features : undefined;
        this._resumes = options ? options.scores : undefined;
        this._candidateId = options.candidateId || 0;

        this.type = options.type || 'manual';
        // this.setContent(); // set content

        if (this.type === 'ml') {
            this.$el.addClass(CLASSES.ML_RESUME);
            this.$scanline.removeClass(CLASSES.IS_INACTIVE);
        }

        if (this._resumes === undefined || this._resumeFeatures === undefined) {
            throw new Error('You need to pass CV scores to the CV viewer upon instantiation');
        };

        if (this._candidateId === this._resumes.length) alert('we have no CVs left');

    }

    showCV(cv) {
        this.setColor(cv.color);
        this.$nameEl.html(cv.name);
        // this.$taglineEl.html('personal tagline comes here');
        this._resumeFeatures.forEach((feature, index) => {
            const skillScore = cv.qualifications[index]*10;
            const skillClass = `.${CLASSES.CV_CATEGORY}--${feature.class}`;
            const $skillEl = this.$el.find(skillClass);
            $skillEl.find(`.${CLASSES.CV_CATEGORY}__name`).html(feature.name);
            $skillEl.find(`.${CLASSES.CV_CATEGORY}__progress`).css('width', `${clamp(skillScore, 5, 100)}%`);
        });

        if (this.$el.hasClass(CLASSES.IS_INACTIVE)) this.show();
    }

    setColor(color) {
        if (color === 'yellow') {
            this.$el
                .addClass(CLASSES.RESUME_YELLOW)
                .removeClass(CLASSES.RESUME_BLUE);
        } else {
            this.$el
                .addClass(CLASSES.RESUME_BLUE)
                .removeClass(CLASSES.RESUME_YELLOW);
        };
    }

    createScanTween() {
        return TweenMax.to('#js-resume > .Resume__scanline', this.scanlineAnimDuration, {top: '100%', ease: Power0.easeNone})
            .pause();
    }

    createMaskTween() {
        return TweenMax.to('#js-resume > .Resume__mask', this.scanlineAnimDuration, {height: '100%', ease: Power0.easeNone})
            .pause();
    }

    showScanline() {
        this.$scanline.removeClass(CLASSES.IS_INACTIVE);
        this.$mask.removeClass(CLASSES.IS_INACTIVE);
    }

    hideScanline() {
        this.$scanline.addClass(CLASSES.IS_INACTIVE);
        this.$scanline.css('top', '0');
        this.$mask.addClass(CLASSES.IS_INACTIVE);
        this.$mask.css('height', '0');
    }

    _addEventListeners() {
    }

    _removeEventListeners() {
    }

    show() {
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        if (this.type === 'ml') {
            TweenLite.set('#js-resume', {x: 20, opacity: 0});
            TweenLite.to('#js-resume', 0.3, {x: 0, opacity: 1, ease: Power1.easeInOut});
        }
    }

    hide() {
        if (this.type === 'ml') {
            TweenLite.to('#js-resume', 0.3, {x: 50, opacity: 0});
            TweenLite.delayedCall(0.4, () => {
                this.$el.addClass(CLASSES.IS_INACTIVE);
            });
        } else {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        }
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        // this.$el.destroy();
    }
}

import $ from 'jquery';
import CLASSES from '~/public/game/controllers/constants/classes';
import {clamp} from '~/public/game/controllers/common/utils';


export default class {
    constructor(isManualStageStats) {
        this.statsFeatures = ['HiredMakeup', 'RejectedMakeup', 'AverageYellow', 'AverageBlue'];
        if (isManualStageStats) {
            // const cv = getData('manual');
            this.$el = $('#statistics-card-manual');
        } else {
            // const cv = getData('mllab');
            this.$el = $('#statistics-card-mllab');
        }
        let cv = {qualifications: [1, 2, 3, 4]};

        this.statsFeatures.forEach((feature, index) => {
            const skillScore = cv.qualifications[index]*10;
            const skillClass = `.${feature}`;
            const $skillEl = this.$el.find(skillClass);
            $skillEl.find(`.${CLASSES.CV_CATEGORY}__progress`).css('width', `${clamp(skillScore, 5, 100)}%`);
        });
    }
}

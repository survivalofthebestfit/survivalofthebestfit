import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';

class Statistics {
    getCardStats(cvArray) {
        let totalHiredYellow = 0;
        let totalHiredBlue = 0;
        let totalRejectedYellow = 0;
        let totalRejectedBlue = 0;
 
        let skillsSumYellow = 0;
        let skillsSumBlue = 0;

        cvArray.forEach((e) => {
            if (e.color == 'yellow') {
                if (e.empl == 1) {
                    totalHiredYellow++;
                } else {
                    totalRejectedYellow++;
                }
                skillsSumYellow += e.qualifications.reduce((a, b) => a + b, 0);
            } else if (e.color == 'blue') {
                if (e.empl == 1) {
                    totalHiredBlue++;
                } else {
                    totalRejectedBlue++;
                }
                skillsSumBlue += e.qualifications.reduce((a, b) => a + b, 0);
            }
        });

        const hiredPercY = Math.floor(100 * totalHiredYellow/(totalHiredYellow + totalHiredBlue));
        const rejectPercY = Math.floor(100 * totalRejectedYellow/(totalRejectedYellow + totalRejectedBlue));
        const skillsAverageYellow = Math.floor(10 * skillsSumYellow/(4 * (totalHiredYellow + totalRejectedYellow)));
        const skillsAverageBlue = Math.floor(10 * skillsSumBlue/(4 * (totalHiredBlue + totalRejectedBlue)));

        return [hiredPercY, rejectPercY, skillsAverageYellow, skillsAverageBlue];
    }

    getManualStats() {
        const onlyPerson = this.getCardStats(cvCollection.cvData.slice(0, dataModule.getLastIndex()));
        if (onlyPerson[1] > 70) {
            return onlyPerson;
        }
        return this.getCardStats(cvCollection.cvData);
    }

    getMlLabStats() {
        let acceptance = dataModule.getAcceptanceByTheAlgo();
        acceptance.forEach((element, index) => {
            cvCollection.cvDataEqual[index].empl = element[0];
        });
        return this.getCardStats(cvCollection.cvDataEqual.slice(0, acceptance.length));
    }

    getFeatures() {
        return ['HiredMakeup', 'RejectedMakeup', 'AverageYellow', 'AverageBlue'];
    }
}

export const statistics = new Statistics();

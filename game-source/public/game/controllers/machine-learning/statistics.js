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
        // [0] hired yellow %, [1] rejected yellow %, [2] yellow average skills, [3] blue average skills
        
        const onlyPersonalStats = this.getCardStats(cvCollection.cvData.slice(0, dataModule.getLastIndex()));
        if (onlyPersonalStats[0] > 75 && onlyPersonalStats[1] < 40 && onlyPersonalStats[2] - onlyPersonalStats[3] > 30) {
            return onlyPersonalStats;
        } 
        
        const fullDatasetStats = this.getCardStats(cvCollection.cvData);
        if (fullDatasetStats[1] > 75 && fullDatasetStats[1] < 40 && fullDatasetStats[3] - fullDatasetStats[4] > 30) {
            return fullDatasetStats;
        }
        
        return [80, 30, 70, 35];
    }

    getMlLabStats() {
        // [0] hired yellow %, [1] rejected yellow %, [2] yellow average skills, [3] blue average skills

        let acceptance = dataModule.getAcceptanceByTheAlgo();
        acceptance.forEach((element, index) => {
            cvCollection.cvDataEqual[index].empl = element[0];
        });
        
        const mlLabStats = this.getCardStats(cvCollection.cvDataEqual.slice(0, acceptance.length));
        if (mlLabStats[1] > 75 && mlLabStats[1] < 40 && mlLabStats[3] - mlLabStats[4] > 30) {
            return mlLabStats;
        }

        return [82, 26, 60, 63];
    }

    getFeatures() {
        return ['HiredMakeup', 'RejectedMakeup', 'AverageYellow', 'AverageBlue'];
    }
}

export const statistics = new Statistics();

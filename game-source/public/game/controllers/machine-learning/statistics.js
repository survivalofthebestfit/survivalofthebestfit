import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';

class Statistics {
    getCardStats(cvArray) {
        let totalHiredOrange = 0;
        let totalHiredBlue = 0;
        let totalRejectedOrange = 0;
        let totalRejectedBlue = 0;
 
        let skillsSumOrange = 0;
        let skillsSumBlue = 0;

        cvArray.forEach((e) => {
            if (e.color == 'orange') {
                if (e.empl == 1) {
                    totalHiredOrange++;
                } else {
                    totalRejectedOrange++;
                }
                skillsSumOrange += e.qualifications.reduce((a, b) => a + b, 0);
            } else if (e.color == 'blue') {
                if (e.empl == 1) {
                    totalHiredBlue++;
                } else {
                    totalRejectedBlue++;
                }
                skillsSumBlue += e.qualifications.reduce((a, b) => a + b, 0);
            }
        });

        const hiredPercY = Math.floor(100 * totalHiredOrange/(totalHiredOrange + totalHiredBlue));
        const rejectPercY = Math.floor(100 * totalRejectedOrange/(totalRejectedOrange + totalRejectedBlue));
        const skillsAverageOrange = Math.floor(10 * skillsSumOrange/(4 * (totalHiredOrange + totalRejectedOrange)));
        const skillsAverageBlue = Math.floor(10 * skillsSumBlue/(4 * (totalHiredBlue + totalRejectedBlue)));

        return [hiredPercY, rejectPercY, skillsAverageOrange, skillsAverageBlue];
    }

    getManualStats() {
        // [0] hired orange %, [1] rejected orange %, [2] orange average skills, [3] blue average skills
        
        const onlyPersonalStats = this.getCardStats(cvCollection.cvData.slice(0, dataModule.getLastIndex()));
        const fullDatasetStats = this.getCardStats(cvCollection.cvData);
        let result = [];
        if (onlyPersonalStats[0] > 75) {
            result.push(onlyPersonalStats[0]);
        } else if (fullDatasetStats[0] > 75) {
            result.push(fullDatasetStats[0]);
        } else {
            result.push(80);
        }

        if (onlyPersonalStats[1] > 65) {
            result.push(onlyPersonalStats[1]);
        } else if (fullDatasetStats[1] > 65) {
            result.push(fullDatasetStats[1]);
        } else {
            result.push(70);
        }

        if (onlyPersonalStats[2] - onlyPersonalStats[3] < 25) {
            result.push(onlyPersonalStats[2]);
            result.push(onlyPersonalStats[3]);
        } else if (fullDatasetStats[2] - fullDatasetStats[3] < 25) {
            result.push(fullDatasetStats[2]);
            result.push(fullDatasetStats[3]);
        } else {
            result.push(65);
            result.push(60);
        }
        
        return result;
    }

    getMlLabStats() {
        // [0] hired orange %, [1] rejected orange %, [2] orange average skills, [3] blue average skills

        let acceptance = dataModule.getAcceptanceByTheAlgo();
        acceptance.forEach((element, index) => {
            cvCollection.cvDataEqual[index].empl = element[0];
        });
        
        const mlLabStats = this.getCardStats(cvCollection.cvDataEqual.slice(0, acceptance.length));
        console.log('MLLabStats: ', mlLabStats);

        let result = [];
        if (mlLabStats[0] > 75) {
            result.append(mlLabStats[0]);
        } else {
            result.append(82);
        }
        
        if (mlLabStats[1] < 40) {
            result.append(mlLabStats[1]);
        } else {
            result.append(82);
        }

        if (mlLabStats[2] - mlLabStats[3] > 30) {
            result.append(mlLabStats[2]);
            result.append(mlLabStats[3]);
        } else {
            result.append(55);
            result.append(60);
        }
        
        return [82, 26, 60, 63];
    }

    getFeatures() {
        return ['HiredMakeup', 'RejectedMakeup', 'AverageOrange', 'AverageBlue'];
    }
}

export const statistics = new Statistics();

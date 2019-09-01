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
        
        const cvManualDecisions = [];
 
        const accepted = dataModule.getAcceptedPeople();
    
        cvCollection.cvData.slice(0, dataModule.getLastIndex()).forEach(function(cvCollectionElem, cvCollectionInd) {
            if (accepted.some(function(acceptedElem) {
                return acceptedElem == cvCollectionInd;
            })) {
                const modified = JSON.parse(JSON.stringify([cvCollectionElem]))[0];
                modified.empl = 1;
                cvManualDecisions.push(modified);
            } else {
                const modified = JSON.parse(JSON.stringify([cvCollectionElem]))[0];
                modified.empl = 0;
                cvManualDecisions.push(modified);
            }
        });
    
        const onlyPersonalStats = this.getCardStats(cvManualDecisions);
        const fullDatasetStats = this.getCardStats(cvCollection.cvData);
        const result = [];
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

        if (onlyPersonalStats[2] - onlyPersonalStats[3] < 10) {
            result.push(onlyPersonalStats[2]);
            result.push(onlyPersonalStats[3]);
        } else if (fullDatasetStats[2] - fullDatasetStats[3] < 10) {
            result.push(fullDatasetStats[2]);
            result.push(fullDatasetStats[3]);
        } else {
            result.push(65);
            result.push(60);
        }
        console.log('personalStats: ', onlyPersonalStats, ' Fulldataset: ', fullDatasetStats, ' Result:', result);
        return result;
    }

    getMlLabStats() {
        // [0] hired orange %, [1] rejected orange %, [2] orange average skills, [3] blue average skills

        const acceptance = dataModule.getAcceptanceByTheAlgo();
        acceptance.forEach((element, index) => {
            cvCollection.cvDataEqual[index].empl = element[0];
        });
        
        const mlLabStats = this.getCardStats(cvCollection.cvDataEqual.slice(0, acceptance.length));
        
        const result = [];
        if (mlLabStats[0] > 75) {
            result.push(mlLabStats[0]);
        } else {
            result.push(82);
        }
        
        if (mlLabStats[1] < 40) {
            result.push(mlLabStats[1]);
        } else {
            result.push(39);
        }

        if (mlLabStats[2] - mlLabStats[3] < 10) {
            result.push(mlLabStats[2]);
            result.push(mlLabStats[3]);
        } else {
            result.push(55);
            result.push(60);
        }
        
        console.log('MLLabStats: ', mlLabStats, ' Result:', result);
        return result;
    }

    getFeatures() {
        return ['HiredMakeup', 'RejectedMakeup', 'AverageOrange', 'AverageBlue'];
    }
}

export const statistics = new Statistics();

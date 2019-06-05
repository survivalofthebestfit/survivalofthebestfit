import {buildUserModel, buildFakeDataModel, getFeaturePreference, predictPreprocResume} from '~/public/game/controllers/machine-learning/modelTraining.js';
import {testClf, testInputData, reportMetrics} from '~/public/game/controllers/machine-learning/modelTesting';
import {DEBUG_MODE} from '~/public/game/controllers/constants/mlConstants.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';

const testAccepted = [4, 3, 7, 12, 10, 15, 18, 19, 26, 25, 29, 30, 32, 36, 37, 46, 47, 38];
const testLastIndex = 50;

class DataModule {
    constructor() {
        this.accepted = [];
        this.lastIndex = 0;
        this.groundTruth = [];
        this.acceptance = [];
        this.colorArr = [];
        this.averageScore = [0, 0, 0, 0];
        this.skillFeatureSize = cvCollection.cvFeatures.length;
        this.toInspectIndex;
    }

    recordAccept(personIndex) {
        this.accepted.push(personIndex);
    }

    recordLastIndex(personIndex) {
        this.lastIndex = personIndex;
    }

    getLastIndex() {
        return this.lastIndex;
    }

    getAverageScore(options) {
        let _index = 0;
        let averageScore = [0,0,0,0]
        let selectedIndexArray = [];

        //this is for an array of all selected indices
        if (options.selectedIndexArray && options.selectedIndexArray.length > 0) {
            selectedIndexArray = options.selectedIndexArray;
        }
    
        //this is for an array of start and end range index
        else if (options.indexRange && options.indexRange.length == 2) {
            for(let i = options.indexRange[0]; i <= options.indexRange[1]; i++){
                selectedIndexArray.push(i);
            }
        }

        else throw new Error('Incorrect index array passed to calculate average people scores');

        selectedIndexArray.forEach((personId) => {
            let qual = cvCollection.cvData[personId].qualifications;
            for (_index=0; _index<this.skillFeatureSize; _index++) {
                averageScore[_index] += qual[_index];
            }
        });

        for (_index=0; _index<this.skillFeatureSize; _index++) {
            averageScore[_index] = (averageScore[_index] / selectedIndexArray.length).toFixed(2);
        }

        return averageScore;
    }

    _calculateScore() {

        let hiredAverage = this.getAverageScore({selectedIndexArray: this.accepted});
        let candidateAverage = this.getAverageScore({indexRange: [0, this.lastIndex]});

        const formatScoreText = (maxDiff, maxDiffFeature) => {
            return `You hired people with ${maxDiff > 10 ? `<u>${maxDiff}%</u>` : ''} more ${maxDiffFeature.toLowerCase()} than the average applicant.`
        }

        let diff = [];
        hiredAverage.forEach((score, idx) => {
            diff.push(parseFloat(((score - candidateAverage[idx]) * 10).toFixed(1)));
        });

        let maxDiff = Math.round(Math.max(...diff));
        let maxDiffFeature = cvCollection.cvFeatures[diff.indexOf(Math.max(...diff))].name;

        return formatScoreText(maxDiff, maxDiffFeature);
    }

    train() {
        // if we start from the ml lab stage, we still get real decisions
        if (!this.accepted.length) {
            this.accepted = testAccepted;
            this.lastIndex = testLastIndex;
        }
        this.rejected = this._getRejectedPeople();

        if (DEBUG_MODE) {
            console.log('\n%c SEND SCREENSHOT OF BELOW OUTPUT IF MACHINE DECISIONS ARE WRONG \n IF YOU DON\'T WANT LOGS, SEARCH FOR VARIABLE "DEBUG_MODE" => SET TO 0', 'background: #222; color: #bada55'); 
            testInputData();
            console.log('\nTraining model - user decisions - all features');
        }
        
        // build user model and test it
        this.clf = buildUserModel(this.accepted, this.rejected);
        
        if (testClf(this.clf)) {
            gtag('event', 'test-userdecision-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }

        // build fake data model with extracted user feature preferences
        if (DEBUG_MODE) console.log('\nTraining model - full dataset - user feature preference applied');
        this.featurePref = getFeaturePreference(this.accepted);
        this.clf = buildFakeDataModel(this.featurePref);
        
        if (testClf(this.clf, this.featurePref)) {
            gtag('event', 'test-userfeature-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }

        // if all of those failed to meet criteria, we'll just train a full fake data model
        if (DEBUG_MODE) console.log('\nTraining model - full dataset - all features');
        this.clf = buildFakeDataModel();
        
        if (testClf(this.clf, this.featurePref)) {
            gtag('event', 'test-fullfake-model-successful', {'event_category': 'default', 'event_label': 'model-training'});
            return;
        }
    }

    predict(inputResume) {
        // if starting in MLlab stage, we need to quickly train to not break anything
        if (!this.clf) this.train();
        
        const result = this.clf.predict(predictPreprocResume([inputResume], this.featurePref));

        // measure ongoing performance and bias
        this.groundTruth.push(inputResume.empl);
        this.acceptance.push(result);
        this.colorArr.push(inputResume.color);
        if (this.acceptance.length % 10 == 0) {
            reportMetrics(this.acceptance, this.groundTruth, false, this.colorArr);
        }
        
        return result;
    }

    // everyone among the showed people who isn't accepted, is assumed to be rejected
    _getRejectedPeople() {
        let rejected = [];
        for (let i = 0; i <= this.lastIndex; i++) {
            rejected.push(i);
        }
        rejected = rejected.filter((i) => {
            return this.accepted.indexOf(i) < 0;
        });
        return rejected;
    }

    uploadUserDecisions() {
        // this.accepted has the indices of accepted candidates
        // _getRejectedPeople() returns indices of rejected people
        // BE CAREFUL! IF DATASET IS REGENERATED ON THE PYTHON SIDE, THE INDICES STILL REFER TO THE OLD DB
        // function best called in the beginning of training
        return;
    }

    chooseCandidateToInspect() {

        let buffer = 5;
        let counter = this.lastIndex + buffer;
        let getAverage = (array) => array.reduce((a, b) => a + parseInt(b), 0) / array.length;

        //we choose the first blue candidate with average score beyond threshold
        while(counter < cvCollection.cvData.length) {
            if (cvCollection.cvData[counter].color == "blue") {
                let scoreArray = this.getAverageScore({selectedIndexArray: [counter]});
                if (getAverage(scoreArray) > 6) {
                    return counter;
                }
            }
            counter++;
        }
        return this.lastIndex;
    }
}

export const dataModule = new DataModule();

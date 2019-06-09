import {preprocResumes} from '~/public/game/controllers/machine-learning/modelTraining.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {SILENT, DEBUG_MODE} from '~/public/game/controllers/constants/mlConstants.js';

const badCvTestData = require('~/public/game/assets/text/badCvTestData.json').candidates;
const goodCvTestData = require('~/public/game/assets/text/goodCvTestData.json').candidates;
const equalCvTestData = require('~/public/game/assets/text/equalCvData.json').candidates;


const testClf = (clf, featPref) => {
    // Test if good candidates are accepted. Count and most should be employed
    let [featArr, labelArr] = preprocResumes(goodCvTestData, featPref);
    let pred = clf.predict(featArr);
    let metrics = compareBinaryArrays(pred, labelArr, SILENT);
    const employedGood = metrics['oneOne'] + metrics['oneZero'];
    const unemployedGood = metrics['zeroOne'] + metrics['zeroZero'];
    const goodMetric = round(employedGood/(employedGood+unemployedGood));

    // Test if bad candidates are rejected. Count and most should not be employed
    [featArr, labelArr] = preprocResumes(badCvTestData, featPref);
    pred = clf.predict(featArr);
    metrics = compareBinaryArrays(pred, labelArr, SILENT);
    const employedBad = metrics['oneOne'] + metrics['oneZero'];
    const unemployedBad = metrics['zeroOne'] + metrics['zeroZero'];
    const badMetric = round(unemployedBad/(employedBad+unemployedBad));

    // Test if city bias exists. Count number of accepted people from each city.
    [featArr, labelArr] = preprocResumes(equalCvTestData, featPref);
    pred = clf.predict(featArr);
    const cities = featArr.map((x) => x[x.length - 1]);
    metrics = compareBinaryArrays(pred, cities, SILENT);
    const blueCityEmpl = metrics['oneZero'];
    const yellowCityEmpl = metrics['oneOne'];
    const biasMetric = round(blueCityEmpl / (blueCityEmpl + yellowCityEmpl));
    
    if (DEBUG_MODE) console.log('Blue city bias: ', biasMetric, ' Ratio of good people employed:', goodMetric, ' Ratio of bad people not employed: ', badMetric);
    
    if (biasMetric > 0.40 || badMetric < 0.85 || goodMetric < 0.85) {
        if (DEBUG_MODE) console.log('Model rejected!');
        return false;
    }
    if (DEBUG_MODE) console.log('Model accepted!');
    return true;
};

// compare two array of binary values and count how many pairs of 11, 01, 10, 00 there are when iterating over the two arrays
const compareBinaryArrays = (pred, valid) => {
    let oneOne = 0;
    let zeroOne = 0;
    let oneZero = 0;
    let zeroZero = 0;
    
    pred.forEach((element, index) => {
        if (element == 1 && valid[index] == 1) {
            oneOne++;
        } else if (element == 0 && valid[index] == 0) {
            zeroZero++;
        } else if (element == 1 && valid[index] == 0) {
            zeroOne++;
        } else if (element == 0 && valid[index] == 1) {
            oneZero++;
        }
    });

    return {'oneOne': oneOne, 'zeroOne': zeroOne, 'oneZero': oneZero, 'zeroZero': zeroZero};
};

// prints recall, precision and blue yellow ratio, etc... 
const reportMetrics = (pred, valid, colorArr) => {
    const comparison = compareBinaryArrays(pred, valid);
    const truePos = comparison['oneOne'];
    const falsePos = comparison['zeroOne'];
    const falseNeg = comparison['oneZero'];
    const trueNeg = comparison['zeroZero'];

    const recall = round(truePos/(truePos+falseNeg));
    const precision = round(truePos/(truePos+falsePos));
    const accuracy = round((truePos+trueNeg)/pred.length);
    const acceptanceRate = round((truePos+falsePos)/pred.length);
    
    const by = 'NA';
    if (colorArr) {
        let blue = 0;
        let yellow = 0;
        colorArr.forEach((elem, index) => {
            if (valid[index] == 1) {
                elem == 'blue'? blue++ : yellow++;
            }
        });
        by = round(blue/(yellow+blue));
    }

    if (DEBUG_MODE) console.log('Accuracy: ', accuracy, ' Precision:', precision, ' Recall: ', recall, ' Acceptance rate: ', acceptanceRate, ' Blue/All Employed ratio: ', by );    
};

const testInputData = () => {
    const [featureArr, labelArr] = preprocResumes(cvCollection.cvData);
    const cityArr = cvCollection.cvData.map((x) => x.city);
    const colorArr = cvCollection.cvData.map((x) => x.color == 'yellow' ? 1 : 0);
    const metrics = compareBinaryArrays(colorArr, labelArr, SILENT);
    const metrics2 = compareBinaryArrays(colorArr, cityArr, SILENT);
    console.log('Input data test (Yellow 1, Blue 0) \n color-empl pair counts: ', metrics, '\n color-city pair counts:', metrics2);
};

const round = (num) => {
    return Math.round(num * 100) / 100;
};

export {testClf, reportMetrics, testInputData};

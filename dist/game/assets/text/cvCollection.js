/* ///////////////////
Object of all CVs for each stage
As of now, skills are scaled out of 10
*/// /////////////////

import CLASSES from '~/public/game/controllers/constants/classes';

const cvCollection = {
    cvFeatures: [
        {
            name: 'Skill',
            class: CLASSES.CV_SKILL,
        },
        {
            name: 'School Prestige',
            class: CLASSES.CV_SCHOOL,
        },
        {
            name: 'Work Experience',
            class: CLASSES.CV_WORK,
        },
        {
            name: 'Ambition',
            class: CLASSES.CV_AMBITION,
        },
    ],
    cvData: require('./cvData.json').candidates,
    cvDataEqual: require('./equalCvData.json').candidates,
    specialCandidate: {"name": "Elvan Yang", "city": 1, "color": "blue", "empl": 0, "qualifications": [10, 9, 8, 9]}
};

export {cvCollection};

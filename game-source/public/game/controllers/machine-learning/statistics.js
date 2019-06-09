import {cvCollection} from '~/public/game/assets/text/cvCollection.js';

class Statistics {
    getCardStats(cvArray) {
        let totalCount = 0;
        
        let totalHiredYellow = 0;
        let totalHiredBlue = 0;
        let totalRejectedYellow = 0;
        let totalRejectedBlue = 0;
 
        let yellowSkill = 0;
        let yellowAmbition = 0;
        let yellowSchool = 0;
        let yellowWork = 0;

        let blueSkill = 0;
        let blueAmbition = 0;
        let blueSchool = 0;
        let blueWork = 0;

        cvArray.forEach(element => {
            if 
        });

        const totalAcceptance = 0;
        const hiredPercY = 0;
        const rejectPercY = 0;
        const averageSkillY = 0;
        const averageSchoolY = 0;
        const averageWorkY = 0;
        const averageAmbitY = 0;
        const averageSkillB = 0;
        const averageSchoolB = 0;
        const averageWorkB = 0;
        const averageAmbitB = 0;

        return {totalAcceptance: totalAcceptance,
                hiredPercY: hiredPercY,
                rejectPercY: rejectPercY,
                averageSkillY: averageSkillY,
                averageSchoolY: averageSchoolY,
                averageWorkY: averageWorkY,
                averageAmbitY: averageAmbitY,
                averageSkillB: averageSkillB,
                averageSchoolB: averageSchoolB,
                averageWorkB: averageWorkB,
                averageAmbitB: averageAmbitB
            }
    }
}

export {Statistics};
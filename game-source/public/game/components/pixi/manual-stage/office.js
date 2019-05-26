import * as PIXI from 'pixi.js';
import $ from 'jquery';
import {officeStageContainer, eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {bluePersonTexture, yellowPersonTexture} from '~/public/game/controllers/common/textures.js';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';
import {createPerson, animateThisCandidate} from '~/public/game/components/pixi/manual-stage/person.js';
import Floor from '~/public/game/components/pixi/manual-stage/floor.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {screenSizeDetector, uv2px, px2uv, clamp, isMobile, spacingUtils as space} from '~/public/game/controllers/common/utils.js';
import Door from '~/public/game/components/pixi/manual-stage/door.js';
import ResumeUI from '~/public/game/components/interface/ui-resume/ui-resume';
import InstructionUI from '~/public/game/components/interface/ui-instruction/ui-instruction';
import YesNo from '~/public/game/components/interface/yes-no/yes-no';
import PeopleTalkManager from '~/public/game/components/interface/ml/people-talk-manager/people-talk-manager';
import ANCHORS from '~/public/game/controllers/constants/pixi-anchors';
import EVENTS from '~/public/game/controllers/constants/events';
import SCALES from '~/public/game/controllers/constants/pixi-scales.js';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';
import TaskUI from '../../interface/ui-task/ui-task';
import TextBoxUI from '../../interface/ui-textbox/ui-textbox';
import {OFFICE_PEOPLE_CONTAINER} from '~/public/game/controllers/constants/pixi-containers.js';
import {waitForSeconds} from '~/public/game/controllers/common/utils.js';

const spotlight = {
    x: uv2px(0.4, 'w'),
    y: uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y - 0.13, 'h'),
};

const candidatePoolSize = {
    smallOfficeStage: 7,
    mediumOfficeStage: 10,
    largeOfficeStage: isMobile() ? 10 : 15,
};

const officeCoordinates = {
    entryDoorX: 0.1,
    exitDoorX: 0.6,
    personStartX: 0.2,
    peoplePaddingX: 0.1,
    personStartY: 0.87, // should be dependent on the floot size
    xOffset: 0.06, // should be dependent 
};

class Office {
    constructor() {
        this.uniqueCandidateIndex = 0;
        this.currentStage = 0;
        this.scale = 1;
        this.takenDesks = 0;
        this.interiorContainer = new PIXI.Container();
        this.personContainer = new PIXI.Container();
        this.personContainer.name = OFFICE_PEOPLE_CONTAINER;

        let acceptedAverageScore;
        let candidatesAverageScore;

        // IMPORTANT: candidates ID refer to this array's index
        this.allPeople = [];
        this.hiredPeople = [];
        this.toReplaceX = 0;

        this.task = null;
        this.stageText;

        this.floors = {
            ground_floor: new Floor({type: 'ground_floor'}),
            first_floor: new Floor({type: 'first_floor'}),
        };

        this.instructions = new InstructionUI();

        this.peopleTalkManager = new PeopleTalkManager({parent: this.personContainer, stage: 'manual'});

        this.resumeUI = new ResumeUI({
            features: cvCollection.cvFeatures,
            scores: cvCollection.cvData,
            candidateId: candidateClicked,
        });

        this.doors = [
            new Door({
                type: 'doorAccepted',
                floor: 'first_floor',
                floorParent: this.floors.first_floor,
                xAnchor: uv2px(officeCoordinates.entryDoorX, 'w'),
            }),
            new Door({
                type: 'doorRejected',
                floor: 'first_floor',
                floorParent: this.floors.first_floor,
                xAnchor: uv2px(officeCoordinates.exitDoorX, 'w'),
            }),
        ];
        this.listenerSetup();
    }

    start(stageNum) {
        this.currentStage = stageNum;

        switch (stageNum) {
        case 0:
            this.stageText = txt.smallOfficeStage;
            break;
        case 1:
            this.stageText = txt.mediumOfficeStage;
            break;
        case 2:
            this.stageText = txt.largeOfficeStage;
            break;
        }

        this.draw(stageNum);
    }

    draw() {
        candidateInSpot = null;
        this.takenDesks = 0;

        let showTimer = false;        
        let candidatesToAdd;

        if (this.task) {
            this.task.destroy();
            this.task = null;
        }

        if (this.currentStage == 0) {
            // SMALL STAGE - INITIAL SET UP
            candidatesToAdd = candidatePoolSize.smallOfficeStage;

            for (const floor in this.floors) {
                if (Object.prototype.hasOwnProperty.call(this.floors, floor)) {
                    this.floors[floor].addToPixi(this.interiorContainer);
                }
            };

            this.doors.forEach((door) => door.addToPixi(this.interiorContainer));
            this.yesno = new YesNo({show: true});
            this.instructions.reveal({type: 'manual-click'});

            this.peopleTalkManager.startTimeline();
        } else {
            showTimer = true;
            candidatesToAdd = this.currentStage === 1 ? candidatePoolSize.mediumOfficeStage : candidatePoolSize.largeOfficeStage;

            officeStageContainer.removeChild(this.personContainer);
            this.personContainer = new PIXI.Container();
            this.personContainer.name = OFFICE_PEOPLE_CONTAINER;
        }

        this.populateCandidates(this.uniqueCandidateIndex, candidatesToAdd);
        officeStageContainer.addChild(this.interiorContainer);
        officeStageContainer.addChild(this.personContainer);

        this.task = new TaskUI({
            showTimer: showTimer, 
            hires: this.stageText.hiringGoal, 
            duration: this.stageText.duration,
        });
    }

    moveTweenHorizontally(tween, newX) {
        tween.stop().clear();
        tween.to({x: newX});
        tween.easing = PIXI.tween.Easing.inOutSine();
        tween.time = 1200;
        tween.start();
    }

    listenerSetup() {
        eventEmitter.on(EVENTS.DISPLAY_THIS_CV, () => {
            this.resumeUI.showCV(cvCollection.cvData[candidateClicked]);
        });

        this.stageResetHandler = () => {
            new TextBoxUI({
                isRetry: true,
                stageNumber: this.currentStage,
                content: this.stageText.retryMessage,
                responses: this.stageText.retryResponses,
                show: true,
                overlay: true,
            });

            if (this.task) {
                this.task.reset();
            }
        };

        eventEmitter.on(EVENTS.STAGE_INCOMPLETE, this.stageResetHandler);

        this.acceptedHandler = () => {
            console.log('record accepted!');
            dataModule.recordAccept(candidateInSpot);
            this.takenDesks += 1;
            const hiredPerson = this.allPeople[candidateInSpot];
            this.hiredPeople.push(hiredPerson);
            this.toReplaceX = hiredPerson.uvX;
            this.placeCandidate(this.toReplaceX);

            this.moveTweenHorizontally(hiredPerson.tween, uv2px(officeCoordinates.entryDoorX + 0.04, 'w'));
            candidateInSpot = null;
            this.doors[0].playAnimation({direction: 'forward'});


            hiredPerson.tween.on('end', () => {
                this.personContainer.removeChild(hiredPerson);
                this.doors[0].playAnimation({direction: 'reverse'});
            });

            if (this.takenDesks == this.stageText.hiringGoal) {
                console.log('stage complete!');
                waitForSeconds(1).then(() => {
                    console.log('next stage!');
                    eventEmitter.emit(EVENTS.MANUAL_STAGE_COMPLETE, {
                        stageNumber: this.currentStage,
                    });
                    this.task.reset();
                    gameFSM.nextStage();
                });
            }
        };

        this.rejectedHandler = () => {
            const rejectedPerson = this.allPeople[candidateInSpot];
            this.toReplaceX = rejectedPerson.uvX;
            this.placeCandidate(this.toReplaceX);

            this.moveTweenHorizontally(rejectedPerson.tween, uv2px(officeCoordinates.exitDoorX + 0.04, 'w'));

            candidateInSpot = null;
            this.doors[1].playAnimation({direction: 'forward'});

            rejectedPerson.tween.on('end', () => {
                this.personContainer.removeChild(rejectedPerson);
                this.doors[1].playAnimation({direction: 'reverse'});
            });
        };

        eventEmitter.on(EVENTS.ACCEPTED, this.acceptedHandler);

        eventEmitter.on(EVENTS.REJECTED, this.rejectedHandler);

        eventEmitter.on(EVENTS.RETURN_CANDIDATE, () => {
            animateThisCandidate(this.allPeople[candidateInSpot], this.allPeople[candidateInSpot].originalX, this.allPeople[candidateInSpot].originalY);
            this.allPeople[candidateInSpot].inSpotlight = false;
        });

        eventEmitter.on(EVENTS.INSTRUCTION_ACKED, (data) => {
            this.start(data.stageNumber);
        });

        eventEmitter.on(EVENTS.RETRY_INSTRUCTION_ACKED, (data) => {
            this.start(data.stageNumber);
        });
    }

    placeCandidate(thisX) {
        const color = cvCollection.cvData[this.uniqueCandidateIndex].color;
        const texture = (color === 'yellow') ? yellowPersonTexture : bluePersonTexture;
        const person = createPerson(thisX, officeCoordinates.personStartY, this.uniqueCandidateIndex, texture);
        this.personContainer.addChild(person);
        this.allPeople.push(person);
        this.uniqueCandidateIndex++;
        dataModule.recordLastIndex(this.uniqueCandidateIndex);
    }

    centerPeopleLine(count) {
        const {entryDoorX, exitDoorX, xOffset, peoplePaddingX} = officeCoordinates;
        const peopleCenterX = Math.min(entryDoorX, exitDoorX) + Math.abs(entryDoorX - exitDoorX)/2;
        const startX = Math.max(0.05, peopleCenterX - xOffset*(count-1)/2); // startX, starting from the center between two doors
        const maxOffset = (1-2*peoplePaddingX)/(count-1); // maximum offset between people
        const xClampedOffset = clamp(xOffset, Math.min(px2uv(70, 'w'), maxOffset), maxOffset); // calculate xOffset
        // console.table({
        //     peopleCenterX: peopleCenterX,
        //     startX: startX,
        //     count: count,
        //     maxOffset: maxOffset,
        //     xClampedOffset: xClampedOffset,
        // });
        return {
            xClampedOffset: xClampedOffset,
            startX: startX,
        };
    }

    populateCandidates(startIndex, count) {
        const {xClampedOffset, startX} = this.centerPeopleLine(count);
        for (let i = startIndex; i < startIndex + count; i++) {
            const orderInLine = i - startIndex;
            console.log({
                personX: startX + xClampedOffset * orderInLine,
                personXAlt: officeCoordinates.personStartX + officeCoordinates.xOffset * orderInLine,
            });
            // this.placeCandidate(officeCoordinates.personStartX + officeCoordinates.xOffset * orderInLine);

            this.placeCandidate(startX + xClampedOffset * orderInLine);
        }
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.ACCEPTED, this.acceptedHandler);
        eventEmitter.off(EVENTS.REJECTED, this.rejectedHandler);
        eventEmitter.off(EVENTS.RETURN_CANDIDATE, () => {});
        eventEmitter.off(EVENTS.STAGE_INCOMPLETE, this.stageResetHandler);
        eventEmitter.off(EVENTS.DISPLAY_THIS_CV, () => {});
        eventEmitter.off(EVENTS.RETRY_INSTRUCTION_ACKED, () => {});
        eventEmitter.off(EVENTS.INSTRUCTION_ACKED, () => {});
    }

    delete() {
        this.doors.forEach((door) => {
            door.destroy();
        });
        this.resumeUI.destroy();
        this.instructions.destroy();
        officeStageContainer.removeChild(this.interiorContainer);
        officeStageContainer.removeChild(this.personContainer);
        this._removeEventListeners();
        this.peopleTalkManager.destroy();
        this.task.destroy();
    }
}

export {Office, spotlight};

import * as PIXI from 'pixi.js';
import $ from 'jquery';
import {officeStageContainer, eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';
import {createPerson, moveToDoor, moveToFromSpotlight, repositionPerson} from '~/public/game/components/pixi/manual-stage/person.js';
import Floor from '~/public/game/components/pixi/manual-stage/floor.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {uv2px, px2uv, screenSizeDetector, clamp, isMobile, waitForSeconds, spacingUtils as space} from '~/public/game/controllers/common/utils.js';
import Door from '~/public/game/components/pixi/manual-stage/door.js';
import ResumeUI from '~/public/game/components/interface/ui-resume/ui-resume';
import InstructionUI from '~/public/game/components/interface/ui-instruction/ui-instruction';
import YesNo from '~/public/game/components/interface/yes-no/yes-no';
import PeopleTalkManager from '~/public/game/components/interface/ml/people-talk-manager/people-talk-manager';
import {ANCHORS, EVENTS, SOUNDS, SCALES} from '~/public/game/controllers/constants';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';
import TaskUI from '../../interface/ui-task/ui-task';
import {OFFICE_PEOPLE_CONTAINER} from '~/public/game/controllers/constants/pixi-containers.js';
import * as sound from '~/public/game/controllers/game/sound.js';
import * as state from '~/public/game/controllers/common/state';


function computeOfficeParams(type) {
    switch (type) {
    case 'candidate-pool':
        return {
            smallOfficeStage: 7,
            mediumOfficeStage: 10,
            largeOfficeStage: isMobile() ? 10 : 15,
        };
    case 'office-coordinates':
        return {
            entryDoorX: isMobile() ? 0.05 : 0.1,
            exitDoorX: isMobile() ? 0.55 : 0.6,
            personStartX: 0.2,
            peoplePaddingX: 0.1,
            personStartY: computePersonY(),
            xOffset: 0.06,
        };
    case 'spotlight':
        return computeSpotlight();
    default:
        throw new Error(`we cannot compute parameters for type ${type}`);
    }
};

function computeSpotlight({entryDoor, exitDoor, person}) {
    const personHeightHalf = 0.6 * (new PIXI.extras.AnimatedSprite(PIXI.loader.resources['yellowPerson'].spritesheet.animations['idle']).height * SCALES.PERSON[screenSizeDetector()]);
    return {
        x: uv2px(space.getRelativePoint(entryDoor, exitDoor, 0.6), 'w'),
        y: uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y, 'h') - personHeightHalf, //- 0.9 * (SCALES.FLOOR[screenSizeDetector()] + SCALES.FLOOR_SHADOW[screenSizeDetector()]),
    };
}

function computePersonY() {
    return 1 - px2uv(isMobile() ? 15 : 25, 'h');
}

let spotlight = {};

class Office {
    constructor() {
        console.log('construct office!');
        this.uniqueCandidateIndex = 0;
        this.currentStage = 0;
        this.scale = 1;
        this.takenDesks = 0;
        this.interiorContainer = new PIXI.Container();
        this.personContainer = new PIXI.Container();
        this.personContainer.name = OFFICE_PEOPLE_CONTAINER;
        this.candidatePoolSize = computeOfficeParams('candidate-pool');
        this.officeCoordinates = computeOfficeParams('office-coordinates');
        spotlight = computeSpotlight({
            entryDoor: this.officeCoordinates.entryDoorX,
            exitDoor: this.officeCoordinates.exitDoorX,
        });

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

        this.peopleTalkManager = new PeopleTalkManager({parent: officeStageContainer, stage: 'manual'});

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
                xAnchorUV: this.officeCoordinates.entryDoorX,
                scaleName: 'DOOR',
            }),
            new Door({
                type: 'doorRejected',
                floor: 'first_floor',
                floorParent: this.floors.first_floor,
                xAnchorUV: this.officeCoordinates.exitDoorX,
                scaleName: 'DOOR',
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
        sound.schedule(SOUNDS.MANUAL_AMBIENT, 1);
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
            candidatesToAdd = this.candidatePoolSize.smallOfficeStage;

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
            candidatesToAdd = this.currentStage === 1 ? this.candidatePoolSize.mediumOfficeStage : this.candidatePoolSize.largeOfficeStage;
            this.yesno.hide();
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

    listenerSetup() {
        eventEmitter.on(EVENTS.DISPLAY_THIS_CV, () => {
            this.resumeUI.showCV(cvCollection.cvData[candidateClicked]);
        });

        this.acceptedHandler = () => {
            sound.play(SOUNDS.PERSON_ACCEPTED);
            dataModule.recordAccept(candidateInSpot);
            this.takenDesks += 1;
            const hiredPerson = this.allPeople[candidateInSpot];
            this.hiredPeople.push(hiredPerson);
            this.toReplaceX = hiredPerson.uvX;
            this.placeCandidate(this.toReplaceX);

            moveToDoor(hiredPerson, uv2px(this.officeCoordinates.entryDoorX + 0.04, 'w'));
            candidateInSpot = null;
            this.doors[0].playAnimation({direction: 'forward'});


            hiredPerson.tween.on('end', () => {
                this.personContainer.removeChild(hiredPerson);
                this.doors[0].playAnimation({direction: 'reverse'});
            });
            // STAGE SUCCESS
            if (this.takenDesks == this.stageText.hiringGoal) {
                state.set('hiring-in-progress', false);
                state.set('hiring-stage-success', true);
                sound.stop(SOUNDS.TIME_RUNNING_OUT);
                waitForSeconds(1).then(() => {
                    sound.fadeOut(SOUNDS.MANUAL_AMBIENT);
                    sound.play(SOUNDS.STAGE_SUCCEEDED);
                    eventEmitter.emit(EVENTS.MANUAL_STAGE_DONE, {});
                    this.task.reset();
                    gameFSM.nextStage();
                });
            }
        };

        this.rejectedHandler = () => {
            const rejectedPerson = this.allPeople[candidateInSpot];
            this.toReplaceX = rejectedPerson.uvX;
            this.placeCandidate(this.toReplaceX);

            rejectedPerson.scale.x *= -1;
            moveToDoor(rejectedPerson, uv2px(this.officeCoordinates.exitDoorX + 0.04, 'w'));

            candidateInSpot = null;
            this.doors[1].playAnimation({direction: 'forward'});

            rejectedPerson.tween.on('end', () => {
                this.personContainer.removeChild(rejectedPerson);
                this.doors[1].playAnimation({direction: 'reverse'});
            });
        };

        eventEmitter.on(EVENTS.ACCEPTED, this.acceptedHandler);

        eventEmitter.on(EVENTS.REJECTED, this.rejectedHandler);

        eventEmitter.on(EVENTS.RESIZE, this.resizeHandler, this);

        eventEmitter.on(EVENTS.RETURN_CANDIDATE, () => {
            moveToFromSpotlight(this.allPeople[candidateInSpot], this.allPeople[candidateInSpot].originalX, this.allPeople[candidateInSpot].originalY);
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
        const person = createPerson(thisX, this.officeCoordinates.personStartY, this.uniqueCandidateIndex, color);
        this.personContainer.addChild(person);
        this.allPeople.push(person);
        this.uniqueCandidateIndex++;
        dataModule.recordLastIndex(this.uniqueCandidateIndex);
    }

    populateCandidates(startIndex, count) {
        const {xClampedOffset, startX} = this.centerPeopleLine(count);
        for (let i = startIndex; i < startIndex + count; i++) {
            const orderInLine = i - startIndex;
            this.placeCandidate(startX + xClampedOffset * orderInLine);
        }
    }
    
    resizeHandler() {
        // change spotlight position
        spotlight = computeSpotlight({
            entryDoor: this.officeCoordinates.entryDoorX,
            exitDoor: this.officeCoordinates.exitDoorX,
        });
        // reposition candidates
        const candidates = this.getCandidatePoolSize(this.currentStage);
        const {xClampedOffset, startX} = this.centerPeopleLine(candidates);
        if (this.personContainer.children.length) {
            for (let i = 0; i < candidates; i++) {
                const x = startX + xClampedOffset * i;
                const y = computePersonY();
                const person = this.personContainer.getChildAt(i);
                if (person) repositionPerson(person, x, y);
            }
        }
        // reposition html elements
        const h = document.body.clientHeight;
    }

    getCandidatePoolSize(currentStage) {
        const stages = ['smallOfficeStage', 'mediumOfficeStage', 'largeOfficeStage'];
        return this.candidatePoolSize[stages[currentStage]];
    }

    centerPeopleLine(count) {
        const {entryDoorX, exitDoorX, xOffset, peoplePaddingX} = this.officeCoordinates;
        const peopleCenterX = space.getRelativePoint(entryDoorX, exitDoorX, 1/2);
        const startX = Math.max(0.05, peopleCenterX - xOffset*(count-1)/2); // startX, starting from the center between two doors
        const maxOffset = (1-2*peoplePaddingX)/(count-1); // maximum offset between people
        const xClampedOffset = clamp(xOffset, Math.min(px2uv(70, 'w'), maxOffset), maxOffset); // calculate xOffset
        return {
            xClampedOffset: xClampedOffset,
            startX: startX,
        };
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.ACCEPTED, this.acceptedHandler);
        eventEmitter.off(EVENTS.REJECTED, this.rejectedHandler);
        eventEmitter.off(EVENTS.RETURN_CANDIDATE, () => {});
        eventEmitter.off(EVENTS.DISPLAY_THIS_CV, () => {});
        eventEmitter.off(EVENTS.RETRY_INSTRUCTION_ACKED, () => {});
        eventEmitter.off(EVENTS.INSTRUCTION_ACKED, () => {});
    }

    delete() {
        const componentsToDestroy = [this.resumeUI, this.instructions, this.peopleTalkManager, this.yesno, this.task, ...this.doors];
        officeStageContainer.removeChild(this.interiorContainer);
        officeStageContainer.removeChild(this.personContainer);
        this._removeEventListeners();
        componentsToDestroy
            .filter((component) => component)
            .map((component) => component.destroy());
    }
}

export {Office, spotlight};

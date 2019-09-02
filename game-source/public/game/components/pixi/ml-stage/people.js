import {mlLabStageContainer, eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {uv2px} from '~/public/game/controllers/common/utils.js';
import {EVENTS, SCALES, ML_PEOPLE_CONTAINER} from '~/public/game/controllers/constants';
import MLPerson from '~/public/game/components/pixi/ml-stage/person';
import PeopleTalkManager from '~/public/game/components/interface/ml/people-talk-manager/people-talk-manager';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';
import {screenSizeDetector} from '~/public/game/controllers/common/utils';

export default class {
    constructor() {
        this.container = new PIXI.Container();
        this.container.name = ML_PEOPLE_CONTAINER;
        this.numOfPeople = Math.floor(uv2px(0.85, 'w')/70) * 2;
        this.mlStartIndex = 0;
        this.mlLastIndex = 0;
        this.peopleLine = [];
        this.mlLabRejected = [];

        this.personXoffset = SCALES.PERSON_DISTANCE[screenSizeDetector()];
        this.peopleTalkManager = new PeopleTalkManager({parent: mlLabStageContainer, stage: 'ml'});
        this._createPeople();
        eventEmitter.on(EVENTS.RESIZE, this._draw.bind(this));
        
        mlLabStageContainer.addChild(this.container);
        this._draw();
        this.container.x = uv2px(0.33, 'w');
        this.toInspectId;

    }

    _draw() {
        this.container.y = uv2px(0.96, 'h');
    }

    _createPeople() {
        for (let i = 0; i < this.numOfPeople; i++) {
            this._addNewPerson();
        }
    }

    _addNewPerson() {
        let currentX = (this.mlLastIndex-this.mlStartIndex);

        let thisColor = cvCollection.cvDataEqual[this.mlLastIndex].color;
        if (this.toInspectId == undefined && thisColor == "blue") {
            // the candidate to inspect will be the first blue candidate in ML line
            // overwrite that person's CV data with the special rejected perfect blue candidate's cv
            cvCollection.cvDataEqual[this.mlLastIndex] = cvCollection.specialCandidate;
            this.toInspectId = this.mlLastIndex;
            console.log("special" + this.toInspectId);
        }

        const person = new MLPerson({
            parent: this.container,
            x: currentX * this.personXoffset,
            personData: cvCollection.cvDataEqual[this.mlLastIndex],
            id: this.mlLastIndex,
        });

        person.addToPixi();
        this.peopleLine.push(person);
        dataModule.recordLastIndex(this.mlLastIndex++);
    }

    recalculateCandidateAverage() {
        return dataModule.getAverageScore({indexRange: Array(this.mlStartIndex, this.mlLastIndex)});
    }

    createTween() {
        const tween = PIXI.tweenManager.createTween(this.container);
        tween.from({x: this.container.x}).to({x: this.container.x-this.personXoffset});
        tween.easing = PIXI.tween.Easing.inOutCubic();
        tween.delay = 200;
        tween.time = 600;
        return tween;
    }

    recalibrateTween(tween) {
        tween.from({x: this.container.x}).to({x: this.container.x-this.personXoffset});
    }

    getFirstPerson() {
        return this.peopleLine.length > 0 ? this.peopleLine[0] : undefined;
    }

    getCount() {
        return this.peopleLine.length;
    }

    removeFirstPerson(status) {
        this.peopleLine[0].removeFromLine({decision: status});

        if (status == 'rejected') {
            this.mlLabRejected.push(this.peopleLine[0].id)
        }

        this.peopleLine = this.peopleLine.slice(1);
        this._addNewPerson();
    }
}

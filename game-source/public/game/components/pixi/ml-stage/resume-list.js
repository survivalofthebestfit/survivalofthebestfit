import * as PIXI from 'pixi.js';
import Resume from './resume';
import {mlLabStageContainer} from '~/public/game/controllers/game/gameSetup';
import {beltTexture, cvTexture} from '~/public/game/controllers/common/textures.js';
import {screenSizeDetector, uv2px} from '~/public/game/controllers/common/utils.js';
import {SCALES, ANCHORS} from '~/public/game/controllers/constants';

export default class {
    constructor() {
        this.resumeList = [];
        this.resumeContainer = new PIXI.Container();
        this.resumeContainer.type = 'resumeContainer';
        mlLabStageContainer.addChild(this.resumeContainer);
        this.draw();
    }

    draw() {
        this._recomputeParams();
        for (let j = this.resumeList.length - 1; j >= 0; j--) {
            this.resumeList[j].destroy();
        }

        for (let i = 0; i <= this.numOfResumes + 1; i++) {
            const resume = new Resume({
                parent: this.resumeContainer,
                x: i*this.resumeXOffset,
                scale: this.scale,
            });
            this.resumeList.push(resume);
        }
    }

    createTween() {
        const tween = PIXI.tweenManager.createTween(this.resumeContainer);
        tween.from({x: this.resumeContainer.x}).to({x: this.resumeContainer.x - this.resumeXOffset});
        tween.delay = 300;
        tween.time = 700;
        return tween;
    }

    _recomputeParams() {
        const positionOfRay = 0.5;
        const repetition = 1/positionOfRay;
        this.scale = SCALES.RESUME[screenSizeDetector()];
        this.resumeWidth = cvTexture.width * this.scale;
        const halfOfBeltWidth = uv2px(positionOfRay, 'w');
        const halfOfNumOfResumes = Math.floor( halfOfBeltWidth / (repetition * this.resumeWidth));
        this.resumeXOffset = halfOfBeltWidth / (halfOfNumOfResumes-1);
        this.numOfResumes = halfOfNumOfResumes * repetition;
        this.resumeContainer.x = -1 * this.resumeWidth/repetition;
        this.resumeContainer.y = uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y, 'h') - this.scale*beltTexture.height*1.07;
    }

    destroy() {
        for (let i = this.resumeList.length - 1; i >= 0; i--) {
            this.resumeList[i].destroy();
        }
        mlLabStageContainer.removeChild(this.resumeContainer);
    }
}

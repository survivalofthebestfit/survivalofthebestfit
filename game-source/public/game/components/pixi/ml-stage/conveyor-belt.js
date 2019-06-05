import * as PIXI from 'pixi.js';
import {mlLabStageContainer} from '~/public/game/controllers/game/gameSetup';
import {screenSizeDetector, uv2px} from '~/public/game/controllers/common/utils.js';
import {beltTexture} from '~/public/game/controllers/common/textures.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {SCALES, EVENTS, ANCHORS} from '~/public/game/controllers/constants';

export default class {
    constructor() {
        eventEmitter.on(EVENTS.RESIZE, this._draw.bind(this));
        this.beltContainer = new PIXI.Container();
        mlLabStageContainer.addChild(this.beltContainer);
        this._draw();
    }

    _draw() {
        this._recomputeParams();

        for (let i = this.beltContainer.children.length - 1; i >= 0; i--) {
            if (this.beltContainer.children[i].type && this.beltContainer.children[i].type === 'belt') {
                this.beltContainer.removeChild(this.beltContainer.children[i]);
            }
        }

        // draw new belt pieces
        for (let j = 0; j<this.numOfPieces; j++) {
            const belt = new PIXI.Sprite(beltTexture);
            belt.scale.set(this.scale);
            belt.x = belt.width * j;
            belt.type = 'belt';
            this.beltContainer.addChild(belt);
        }
    }

    _recomputeParams() {
        this.scale = SCALES.BELT[screenSizeDetector()];
        this.numOfPieces = Math.floor(uv2px(1, 'w') / (beltTexture.width * this.scale)) + 1;
        // position belt on the first floor
        this.beltContainer.y = uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y, 'h') - this.scale*beltTexture.height*1.2;
    }

    // it is dangerous to not remove the event listener when destroying sprites
    destroy() {
        eventEmitter.off(EVENTS.RESIZE, this.draw.bind(this));

        for (let i = this.beltContainer.children.length - 1; i >= 0; i--) {
            if (this.beltContainer.children[i].type && this.beltContainer.children[i].type === 'belt') {
                this.beltContainer.removeChild(this.beltContainer.children[i]);
            }
        }
    }
};

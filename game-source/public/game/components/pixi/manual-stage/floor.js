import * as PIXI from 'pixi.js';
import {uv2px, clamp, screenSizeDetector} from '~/public/game/controllers/common/utils.js';
import {COLORS, ANCHORS, EVENTS, SCALES} from '~/public/game/controllers/constants';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

export default class {
    constructor({type}) {
        this.heightMain = SCALES.FLOOR[screenSizeDetector()];
        this.heightShadow = SCALES.FLOOR_SHADOW[screenSizeDetector()];
        // this.heightMain = clamp(uv2px(0.1, 'w'), 40, 50);
        // this.heightShadow = clamp(this.heightMain/5, 20, 30);
        this.yAnchorUV = type === 'ground_floor' ? ANCHORS.FLOORS.GROUND_FLOOR.y : ANCHORS.FLOORS.FIRST_FLOOR.y;
        this.yAnchor = uv2px(this.yAnchorUV, 'h');
        this.surface = null;
        this.side = null;
    }

    addToPixi(parentContainer) {
        this._initParams();
        this._draw();
        parentContainer.addChild(this.surface);
        parentContainer.addChild(this.side);
        this._addEventListeners();
        return this;
    }

    _initParams() {
        // main floor
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(COLORS.ROSE_MAIN);
        this.surface.drawRect(0, 0, uv2px(1, 'w'), this.heightMain);
        this.surface.endFill();
        // dark pink shadow
        this.side = new PIXI.Graphics();
        this.side.beginFill(COLORS.ROSE_SHADOW);
        this.side.drawRect(0, 0, uv2px(1, 'w'), this.heightShadow);
        this.side.endFill();
    }

    _draw() {
        this.surface.x = 0;
        this.surface.y = this.yAnchor-this.heightMain;
        this.surface.width = uv2px(1, 'w');

        this.side.x = 0;
        this.side.y = this.yAnchor;
        this.side.width = uv2px(1, 'w');
    }

    // (re)compute draw parameter values

    _recomputeParams() {
        this.yAnchor = uv2px(this.yAnchorUV, 'h');
    }

    // resize function

    _resizeHandler() {
        this._recomputeParams();
        this._draw();
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler.bind(this));
    }

    // remove event listeners

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESIZE, this._resizeHandler.bind(this));
    }

    getHeight() {
        return this.heightMain;
    }
}

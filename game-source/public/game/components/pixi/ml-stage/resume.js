import * as PIXI from 'pixi.js';
import {cvTexture} from '~/public/game/controllers/common/textures.js';
import {screenSizeDetector} from '~/public/game/controllers/common/utils.js';
import {SCALES} from '~/public/game/controllers/constants';

export default class {
    constructor(options) {
        this.xAnchor = options.x;
        this.parent = options.parent;
        this.draw();
    }

    draw() {
        this.resume = new PIXI.Sprite(cvTexture);
        this.resume.scale.set(SCALES.RESUME[screenSizeDetector()]);
        this.resume.x = this.xAnchor;
        this.resume.type = 'resume-on-belt';
        this.parent.addChild(this.resume);
    }

    destroy() {
        this.parent.removeChild(this.resume);
    }
}

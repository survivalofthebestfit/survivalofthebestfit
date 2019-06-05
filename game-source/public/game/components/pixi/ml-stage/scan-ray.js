import {mlLabStageContainer} from '../../../controllers/game/gameSetup.js';
import {spacingUtils as space} from '../../../controllers/common/utils.js';
import {SPRITES} from '../../../controllers/common/textures.js';

export default class {
    constructor({machine}) {
        this.scanRay = SPRITES.rayAnim;
        this.scanRay.name = 'scanray';
        this.machineContainer = machine;

        this.scanRay.loop = false;
        this.scanRay.animationSpeed = 0.2;
        this.scanRay.gotoAndStop(0);
        this.scanRay.visible = false;
    
        this.draw();
        mlLabStageContainer.addChild(this.scanRay);
    }

    draw() {
        this.machineDim = this.machineContainer.getMachineDimensions();
        this.scanRay.scale.set(this.machineDim.scale);
        this.scanRay.x = space.getCenteredChildX(this.machineDim.x, this.machineDim.width, this.scanRay.width);
        this.scanRay.y = this.machineDim.y + this.machineDim.height;
    }

    hideRay() {
        this.scanRay.visible = false;
    }

    showRay() {
        this.scanRay.visible = true;
    }

    getSprite() {
        return this.scanRay;
    }

    destroy() {
        // implement
    }
}

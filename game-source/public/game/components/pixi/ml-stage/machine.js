import {mlLabStageContainer, eventEmitter} from '~/public/game/controllers/game/gameSetup';
import {SPRITES} from '~/public/game/controllers/common/textures.js';
import {screenSizeDetector, uv2px, spacingUtils as space} from '~/public/game/controllers/common/utils.js';
import {SCALES, ANCHORS} from '~/public/game/controllers/constants';

export default class {
    constructor(options) {
        this.machine = SPRITES.machine;
        this.machine.name = 'machine';
        this.draw();
        mlLabStageContainer.addChild(this.machine);
    }

    draw() {
        this.scale = SCALES.MACHINE[screenSizeDetector()];
        this.machine.scale.set(this.scale);
        this.machine.x = space.screenCenterX(this.machine.width) - uv2px(0.175, 'w');
        const serverHeight = SPRITES.dataServerRejected.height / SPRITES.dataServerRejected.scale.x * SCALES.DATA_SERVER[screenSizeDetector()];
        this.machine.y = uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y, 'h') - serverHeight*1.1;
    }

    // util function to pass machine dimensions to data server/scan ray
    getMachineDimensions() {
        return {
            scale: this.scale,
            width: this.machine.width,
            height: this.machine.height,
            x: this.machine.x,
            y: this.machine.y,
        };
    }
}

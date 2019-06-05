import {mlLabStageContainer, eventEmitter} from '~/public/game/controllers/game/gameSetup';
import {SPRITES} from '~/public/game/controllers/common/textures.js';
import {screenSizeDetector, uv2px, spacingUtils as space} from '~/public/game/controllers/common/utils.js';
import {EVENTS, SCALES, ANCHORS} from '~/public/game/controllers/constants';

export default class {
    constructor(options) {
        this.machine = SPRITES.machine;
        this.machine.name = 'machine';
        this.inspectButton = SPRITES.inspectButton;
        this._addEventListeners();
        this.draw();
        mlLabStageContainer.addChild(this.machine);
        mlLabStageContainer.addChild(this.inspectButton);
    }

    draw() {
        this.scale = SCALES.MACHINE[screenSizeDetector()];
        this.machine.scale.set(this.scale);
        this.machine.x = space.screenCenterX(this.machine.width) - uv2px(0.175, 'h');
        const serverHeight = SPRITES.dataServerRejected.height / SPRITES.dataServerRejected.scale.x * SCALES.DATA_SERVER[screenSizeDetector()];
        this.machine.y = uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y, 'h') - serverHeight*1.1;
        this.inspectButton.scale.set(this.scale);
        this.inspectButton.x = space.getCenteredChildX(this.machine.x, this.machine.width, this.inspectButton.width);
        this.inspectButton.y = space.getCenteredChildY(this.machine.y, this.machine.height, this.inspectButton.height);
        // this.machine.tint = 0xe8ffff;
        // e8ffff
        // fff5d2
    }

    _addEventListeners() {
        this.inspectButton.interactive = true;
        this.inspectButton.buttonMode = true;
        this.inspectButton.on('click', this._inspectButtonClickHandler);
    }

    removeEventListeners() {
        this.inspectButton.off('click', this._inspectButtonClickHandler);
    }

    _inspectButtonClickHandler() {
        eventEmitter.emit(EVENTS.DATASET_VIEW_INSPECT, {});
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

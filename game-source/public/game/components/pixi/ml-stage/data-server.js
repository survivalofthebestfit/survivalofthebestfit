import $ from 'jquery';
import {mlLabStageContainer} from '~/public/game/controllers/game/gameSetup.js';
import {screenSizeDetector, waitForSeconds, spacingUtils as space} from '~/public/game/controllers/common/utils.js';
import {SPRITES} from '~/public/game/controllers/common/textures.js';
import {SCALES, CLASSES} from '~/public/game/controllers/constants';

export default class {
    constructor({machine, type}) {
        this.sprite = type === 'rejected' ? SPRITES.dataServerRejected : SPRITES.dataServerAccepted;
        this.dataServerScale = SCALES.DATA_SERVER[screenSizeDetector()];
        this.directionVector = type === 'rejected' ? -1 : 1;
        this.machine = machine;
        this.$counterTemplate = $(document).find('#js-server-counter-template');
        this.$counterEl = null;
        this.counterId = `data-server-${type}`;
        this.counter = 0;
    
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.5;
        this.sprite.gotoAndStop(0);
        this.createCounterElement();
        this.draw();
        mlLabStageContainer.addChild(this.sprite);
    }

    draw() {
        this.sprite.scale.set(SCALES.DATA_SERVER[screenSizeDetector()]);
        this.machineDim = this.machine.getMachineDimensions();
        this.centerX = space.getCenteredChildX(this.machineDim.x, this.machineDim.width, this.sprite.width);
        this.sprite.x = this.centerX + this.directionVector*1.6*this.sprite.width;
        this.sprite.y = this.machineDim.y - 10;
        // counters
        const {x, y} = this.sprite.getGlobalPosition();
        const serverWidth = this.sprite.width;
        const serverHeight = this.sprite.height;
        this.$counterEl.css({
            'top': `${y + serverHeight*0.19}px`,
            'left': `${x+serverWidth/2 - 10}px`,
        });
    }

    createCounterElement() {
        this.$counterEl = this.$counterTemplate
            .clone()
            .removeAttr('id')
            .attr('data-id', this.counterId)
            .removeClass(CLASSES.IS_INACTIVE)
            .text(this.counter)
            .appendTo('body');
    }

    updateServerCounter(count) {
        this.$counterEl.text(count);
        this.playServerAnimation();
    }

    playServerAnimation() {
        waitForSeconds(0.2)
            .then(() => {
                this.sprite.gotoAndStop(0);
                this.sprite.play();
                return waitForSeconds(1.5);
            })
            .then(() => {
                this.sprite.gotoAndStop(0);
            });
    }

    getSprite() {
        return this.sprite;
    }
}

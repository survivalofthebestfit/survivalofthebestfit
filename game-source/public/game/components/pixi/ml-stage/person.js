import {mlLabStageContainer, eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {SCALES, EVENTS, ANIM} from '~/public/game/controllers/constants/index.js';
import {screenSizeDetector, createPersonSprite, uv2px, getAnimationByName} from '~/public/game/controllers/common/utils.js';

export default class {
    constructor({x, parent, personData, id}) {
        this.personData = personData;
        this.person = createPersonSprite(this.personData.color);
        this.x = x;
        this.parentContainer = parent;
        this.id = id;
        this.personData.id = this.id;
        eventEmitter.on(EVENTS.RESIZE, this._draw.bind(this));
    }

    addToPixi() {
        this.person.id = this.id;
        this.person.animationState = ANIM.IDLE;
        this.person.animationSpeed = 0.6;
        this.person.anchor.set(0.5);
        this.parentContainer.addChild(this.person);
        this._draw();
    }

    _draw() {
        this.person.scale.set(SCALES.PEOPLE[screenSizeDetector()]);
        this.person.x = this.x;
        this.person.y = - this.person.height/2;
    }

    getData() {
        return this.personData;
    }

    playSpriteAnimation(anim) {
        if (this.person.animationState !== anim) this.updateAnimationState(anim);
        this.person.play();
    }
    
    updateAnimationState(anim = ANIM.IDLE) {
        const newAnim = getAnimationByName({color: this.personData.color, animName: anim});
        this.person.stop();
        this.person.textures = newAnim;
        this.person.animationState = anim;
    }

    removeFromLine({decision}) {
        this.decision = decision;
        const {x, y} = this.person.getGlobalPosition();
        mlLabStageContainer.addChild(this.person);
        this.person.x = x;
        this.person.y = y;
        const tween = PIXI.tweenManager.createTween(this.person);
        const velocity = 150; // 150 pixels per second
        let destination;
        
        if (decision === 'accepted') {
            const door = mlLabStageContainer.getChildByName('doorAccepted');
            destination = door.x + 40;
            tween.to({x: destination});
        } else {
            destination = -10;
            tween.to({x: destination, y: uv2px(1.1, 'h')});
        };

        const distance = Math.abs(this.person.x - destination);
        const duration = Math.floor((distance/velocity)*10)*100;
        tween.time = duration;
        tween.on('end', this.removeFromScreen.bind(this));
        tween.start();
        this.playSpriteAnimation(ANIM.WALK_NEUTRAL);
    }

    removeFromScreen() {
        mlLabStageContainer.removeChild(this.person);
        if (this.decision === 'accepted') eventEmitter.emit(EVENTS.PLAY_DOOR_ANIMATION, {direction: 'reverse'});
    }
}

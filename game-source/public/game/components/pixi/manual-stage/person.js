import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {uv2px, screenSizeDetector, createPersonSprite, getAnimationByName} from '~/public/game/controllers/common/utils.js';
import {spotlight} from './office';
import {EVENTS, ANIM, SCALES, ANCHORS} from '~/public/game/controllers/constants';

let showedInstructions = false;

function onPersonHover(event) {
    // PLACEHOLDER FUNCTION FOR HOVER EVENT
    // eventEmitter.emit(EVENTS.PERSON_HOVERED, {});
}

function moveToFromSpotlight(person, newX, newY) {
    playSpriteAnimation.call(person, ANIM.DANGLE);
    person.tween.stop().clear();
    person.tween.to({
        x: newX,
        y: uv2px(ANCHORS.FLOORS.FIRST_FLOOR.y, 'h') - person.height*person.scale.y - 0.9 * (SCALES.FLOOR[screenSizeDetector()] + SCALES.FLOOR_SHADOW[screenSizeDetector()]),
    });
    person.tween.easing=PIXI.tween.Easing.inOutSine();
    person.tween.time = 500;
    person.tween.start();
    person.tween.on('end', () => {
        stopSpriteAnimation.call(person);
    });
}

function moveToDoor(person, newX) {
    playSpriteAnimation.call(person, ANIM.WALK_NEUTRAL);
    person.tween.stop().clear();
    person.tween.to({x: newX});
    person.tween.easing = PIXI.tween.Easing.inOutSine();
    person.tween.time = 1200;
    person.tween.start();
    person.tween.on('end', () => {
        stopSpriteAnimation.call(person);
    });
}

function playSpriteAnimation(anim) {
    const personSprite = this;
    if (personSprite.animationState !== anim) updateAnimationState.call(personSprite, anim);
    personSprite.play();
}

function updateAnimationState(anim = ANIM.IDLE) {
    const personSprite = this;
    const newAnim = getAnimationByName({color: personSprite.color, animName: anim});
    personSprite.stop();
    personSprite.textures = newAnim;
    personSprite.animationState = anim;
}

function stopSpriteAnimation() {
    const personSprite = this;
    updateAnimationState.call(personSprite);
    personSprite.gotoAndStop(0);
}

function moveCandidate() {
    if (!showedInstructions) {
        eventEmitter.emit(EVENTS.UPDATE_INSTRUCTIONS, {type: 'manual-eval-show'});
        showedInstructions = true;
    }
    // display clicked person's CV
    candidateClicked = this.id;
    eventEmitter.emit(EVENTS.DISPLAY_THIS_CV, {});

    // empty spotlight
    if (!this.inSpotlight && candidateInSpot == null) {
        // move candidate to spotlight
        moveToFromSpotlight(this, spotlight.x, spotlight.y);
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: false, spotlightFill: true});

        this.inSpotlight = true;
        candidateInSpot = this.id;
    }
    // candidate in spotlight clicked
    else if (this.inSpotlight) {
        // move candidate back to line
        eventEmitter.emit(EVENTS.RETURN_CANDIDATE, {});
        moveToFromSpotlight(this, this.originalX, this.originalY);
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: true, spotlightFill: false});

        this.inSpotlight = false;
        candidateInSpot = null;
    }
    // candidate in line clicked and spotlight is filled
    else if (!this.inSpotlight && candidateInSpot != null) {
        eventEmitter.emit(EVENTS.RETURN_CANDIDATE, {});
        moveToFromSpotlight(this, spotlight.x, spotlight.y);
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: true, spotlightFill: true});

        this.inSpotlight = true;
        candidateInSpot = this.id;
    }
}

function createPerson(x, y, id, color) {
    const person = createPersonSprite(color); 
    person.scale.set(SCALES.PERSON[screenSizeDetector()]);
    person.interactive = true;
    person.buttonMode = true;
    person.inSpotlight = false;
    person.id = id;
    person.color = color;
    person.uvX = x;
    person.x = uv2px(x, 'w');
    person.y = uv2px(y, 'h') - person.height/2;
    person.originalX = person.x;
    person.originalY = person.y;
    person.type = 'person';
    person.anchor.set(0.5);
    person.tween = PIXI.tweenManager.createTween(person);
    person.loop = true;
    person.animationSpeed = 0.6;
    person.animationState = ANIM.IDLE;
    person
        .on('mouseover', onPersonHover)
        .on('pointerdown', moveCandidate);

    return person;
}

function repositionPerson(person, x, y) {
    person.scale.set(SCALES.PERSON[screenSizeDetector()]);
    person.uvX = x;
    person.x = uv2px(x, 'w');
    person.y = uv2px(y, 'h') - person.height/2;
    person.originalX = person.x;
    person.originalY = person.y;
    if (person.id === candidateInSpot) {
        eventEmitter.emit(EVENTS.RETURN_CANDIDATE, {});
        eventEmitter.emit(EVENTS.CHANGE_SPOTLIGHT_STATUS, {spotlightOccupied: true, spotlightFill: false});
        person.inSpotlight = false;
        candidateInSpot = null;
    }
}

export {createPerson, moveToFromSpotlight, moveToDoor, repositionPerson};

// import $ from 'jquery';
import EVENTS from '~/public/game/controllers/constants/events';
import PersonTooltip from '~/public/game/components/interface/ml/person-tooltip/person-tooltip';
import {clamp} from '~/public/game/controllers/common/utils';
import {ticker} from '~/public/game/controllers/game/gameSetup.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import {OFFICE_PEOPLE_CONTAINER, ML_PEOPLE_CONTAINER} from '~/public/game/controllers/constants/pixi-containers.js';


export default class {
    constructor({parent, stage}) {
        this.parentContainer = parent;
        this.stage = stage;
        this.elapsedTime = 0;
        this.nextTimeUpdate = 3000;
        this.personTooltip = new PersonTooltip();
        // TODO change this to a more robust setup
        this.messages = txt.selfPromoMessages;
        if (this.stage === 'ml') this._addEventListeners();
    }

    // launch timeline: once it starts it runs on its own

    startTimeline() {
        ticker.add(this.tickerHandler.bind(this));
        ticker.start();
    }

    stopTimeline() {
        ticker.stop();
        ticker.remove(this.tickerHandler.bind(this));
    }

    tickerHandler() {
        this.elapsedTime += ticker.elapsedMS;
        if (this.elapsedTime > this.nextTimeUpdate) {
            this.createTooltip();
            this.elapsedTime = 0;
            this.nextTimeUpdate = (Math.floor(Math.random()*8)+1)*1000;
        };
    }

    createTooltip() {
        const peopleContainer = this.parentContainer.getChildByName(this.getContainerByStage(this.stage));
        if (!peopleContainer) return;
        const maxIndex = this.stage === 'ml' ? clamp(peopleContainer.children.length, 0, 8) : peopleContainer.children.length;
        const childIndex = Math.floor(Math.random()*maxIndex);
        const message = this.messages[Math.floor(Math.random()*this.messages.length)];
        // CHECK HERE
        if (childIndex === candidateClicked) return;
        this.personTooltip.showNewTooltip({
            parentContainer: peopleContainer,
            index: childIndex,
            message: message,
        });
    }

    getContainerByStage(stage) {
        switch (stage) {
        case 'ml':
            return ML_PEOPLE_CONTAINER;
        case 'manual':
            return OFFICE_PEOPLE_CONTAINER;
        default:
            console.warn(`invalid stage parameter, cannot find people container for speech bubble tooltips`);
            return undefined;
        }
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.MAKE_ML_PEOPLE_TALK, this.createTooltip.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.MAKE_ML_PEOPLE_TALK, this.createTooltip.bind(this));
    }


    destroy() {
        this.stopTimeline();
        this.personTooltip.destroy();
        this._removeEventListeners();
    }
}

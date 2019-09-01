import {Component} from 'component-loader-js';
import {CLASSES, EVENTS, SOUNDS} from '~/public/game/controllers/constants';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import * as state from '~/public/game/controllers/common/state';
import * as sound from '~/public/game/controllers/game/sound.js';


// publishing custom event to any registered listener
export default class StatsConvChoiceButton extends Component {
    constructor() {
        super(...arguments);
        this._totalSteps = parseInt(this.el.dataset.totalsteps);
        this._step = parseInt(this.el.dataset.step);
        this._replica = this.el.closest('.replica');
        this._textContainer = this.el.querySelector('p');
        this._btn = this.el.querySelector('.button');
        this._onBtnClick = this._onBtnClick.bind(this);
        this._hideBtn = this._hideBtn.bind(this);
        this._clicked = false;
        this._addEventListeners();
    };

    // on button click

    _onBtnClick(e) {
        if (this.clicked) return;
        sound.play(SOUNDS.BUTTON_CLICK);
        // add 'chosen' styling to the button
        if (this._step+1 === this._totalSteps) {
            eventEmitter.emit(EVENTS.EXIT_STATS_CONVERSATION, {});
            // gameFSM.nextStage();
            return;
        };
        // make the text above less prominent 
        this._btn.classList.add(CLASSES.BUTTON_CLICKED);
        // hide the other choice button
        this.publish(EVENTS.STATS_HIDE_UNCHOSEN_BUTTONS, this._step);
        
        // show next replica
        const choiceButtonResponse = this._getChoiceResponse(this._step, this._textContainer.innerHTML);
        this.publish(EVENTS.STATS_REVEAL_REPLICA, {choice_response: choiceButtonResponse, step: this._step+1});
        // remove the event listeners on the clicked button and turn the boolean value
        this._removeEventListeners();
        this.clicked = true;
    }

    _addEventListeners() {
        this.el.addEventListener('click', this._onBtnClick);
        this.subscribe(EVENTS.STATS_HIDE_UNCHOSEN_BUTTONS, this._hideBtn);
    }

    _removeEventListeners() {
        this.el.removeEventListener('click', this._onBtnClick);
        this.unsubscribe(EVENTS.STATS_HIDE_UNCHOSEN_BUTTONS, this._hideBtn);
    }

    _hideBtn(conversationStep) {
        if (this._step === conversationStep && !this._btn.classList.contains(CLASSES.BUTTON_CLICKED)) {
            this.el.classList.add(CLASSES.IS_INACTIVE);
            this._removeEventListeners();
            super.destroy();
        };
    }

    _getChoiceResponse(step, text) {
        const choice = txt.stats_conversation[step].answer_choice.find((choice) => choice.text === text);
        return choice ? choice.response : '';
    }
}

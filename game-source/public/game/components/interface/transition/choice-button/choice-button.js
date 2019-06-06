import {Component} from 'component-loader-js';
import {CLASSES, EVENTS} from '~/public/game/controllers/constants';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';

// publishing custom event to any registered listener
export default class ChoiceButton extends Component {
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
        // add 'chosen' styling to the button
        if (this._step+1 === this._totalSteps) {
            eventEmitter.emit(EVENTS.EXIT_TRANSITION_STAGE, {});
            // gameFSM.nextStage();
            return;
        };
        // make the text above less prominent 
        this._btn.classList.add(CLASSES.BUTTON_CLICKED);
        // hide the other choice button
        this.publish(EVENTS.HIDE_UNCHOSEN_BUTTONS, this._step);
        
        // show next replica
        const choiceButtonResponse = this._getChoiceResponse(this._step, this._textContainer.innerHTML);
        this.publish(EVENTS.REVEAL_REPLICA, {choice_response: choiceButtonResponse, step: this._step+1});
        // remove the event listeners on the clicked button and turn the boolean value
        this._removeEventListeners();
        this.clicked = true;
    }

    _addEventListeners() {
        this.el.addEventListener('click', this._onBtnClick);
        this.subscribe(EVENTS.HIDE_UNCHOSEN_BUTTONS, this._hideBtn);
    }

    _removeEventListeners() {
        this.el.removeEventListener('click', this._onBtnClick);
        this.unsubscribe(EVENTS.HIDE_UNCHOSEN_BUTTONS, this._hideBtn);
    }

    // hide the unchosen button

    _hideBtn(conversationStep) {
        if (this._step === conversationStep && !this._btn.classList.contains(CLASSES.BUTTON_CLICKED)) {
            this.el.classList.add(CLASSES.IS_INACTIVE);
            this._removeEventListeners();
            super.destroy();
        };
    }

    // get response text to a given choice

    _getChoiceResponse(step, text) {
	      const choice = txt.conversation[step].answer_choice.find((choice) => choice.text === text);
        return choice ? choice.response : '';
    }
}

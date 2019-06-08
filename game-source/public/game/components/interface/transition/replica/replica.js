import $ from 'jquery';
import {Component} from 'component-loader-js';
import {waitForSeconds} from '~/public/game/controllers/common/utils';
import {CLASSES, EVENTS} from '~/public/game/controllers/constants';
import * as state from '~/public/game/controllers/common/state';

// publishing custom event to any registered listener
export default class Replica extends Component {
    constructor() {
        super(...arguments);

        this._step = parseInt(this.el.dataset.step);
        this._fileDrag = this.el.dataset.file_drag !== undefined ? true : false;
        this._datasetChoice = this.el.dataset.dataset_choice !== undefined ? true : false;
        console.log(`step ${this._step} ${this._datasetChoice ? 'has' : 'does not have'} a dataset choice`);
        this._revealReplica = this._revealReplica.bind(this);
        this._textContainer = this.el.querySelector('.replica__paragraph');
        this._replicaContent = this.el.querySelector('.replica__content');
        this._dropzone = this.el.querySelector('.replica__dropzone');
        this._typeIcon = this.el.querySelector('.replica__typeIcon');
        this.subscribe(EVENTS.REVEAL_REPLICA, this._revealReplica);
        this.subscribe(EVENTS.GREY_OUT_REPLICA, this._greyOutReplica);
        if (this._step === 0) {
            this._replicaContent.classList.remove(CLASSES.IS_INACTIVE);
            if (this._fileDrag) this._addFileClickListener();
            if (this._datasetChoice) this._addChoiceListener();
        }
    }

    _revealReplica(data) {
        if (this._step === data.step) {
            this.el.classList.remove(CLASSES.IS_INACTIVE);
            this._typeIcon.classList.remove(CLASSES.IS_INACTIVE);
            this.scrollHandler();
            waitForSeconds(Math.round((Math.random()+1)*15)/10).then(() => {
                this._replicaContent.classList.remove(CLASSES.IS_INACTIVE);
                this._typeIcon.classList.add(CLASSES.IS_INACTIVE);
                this._textContainer.innerHTML = data.choice_response + this._textContainer.innerHTML;
                this.scrollHandler();
                if (this._fileDrag) this._addFileClickListener();
                if (this._datasetChoice) this._addChoiceListener();
                this.publish(EVENTS.GREY_OUT_REPLICA, {step: this._step -1});
            });
        }
    }

    _greyOutReplica({step}) {
        // console.log(`grey out text in replica: ${data.step}`);
        // if (this._step === data.step) {
        //     // this.el.classList.remove(CLASSES.IS_INACTIVE);
        //     this._textContainer.classList.add('grey-text');
        //     const choiceButton = this.el.querySelector(this.getButtonSelector());
        //     if (choiceButton) choiceButton.classList.add('grey-text');
        // }
    }

    getButtonSelector() {
        if (this._fileDrag) {
            return '.data-list';
        } else {
            return '.replica__buttons';
        }
    }

    _addFileClickListener() {
        $('#js-cv-all-file').on('click', () => {
            const $fileInstructions = this.el.querySelector('.replica__send-instructions');
            $fileInstructions.classList.add(CLASSES.CONVERSATION_STEP_COMPLETED);
            $fileInstructions.innerHTML = 'Attached cv_all.zip';
            this.publish(EVENTS.REVEAL_REPLICA, {choice_response: '', step: this._step+1});
            $('#js-cv-all-file').off();
        });
    }

    scrollHandler() {
        const $conversation = document.getElementById('transition-conversation-log');
        const isScrolled = $conversation.scrollHeight - $conversation.scrollTop === $conversation.clientHeight;
        if (!isScrolled) {
            $conversation.scrollTop = $conversation.scrollHeight;
        }
    }

    _addChoiceListener() {
        // console.log('we added a choice listener!');
        $('.data-list__choice').on('click', (e) => {
            const $choice = $(`#${e.target.id}`);
            state.set('big-tech-company', $choice.text());
            [...$('.data-list__choice')].map((choice) => $(choice).addClass(CLASSES.IS_INACTIVE));
            $choice.removeClass(CLASSES.IS_INACTIVE).addClass(CLASSES.CONVERSATION_STEP_COMPLETED);
            $choice.find('.data-list__icon').addClass(CLASSES.IS_INACTIVE);
            this.publish(EVENTS.REVEAL_REPLICA, {choice_response: '', step: this._step+1});
            $('.data-list__choice').off();
        });
    }
}

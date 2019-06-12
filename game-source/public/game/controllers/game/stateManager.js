import * as machina from 'machina';
import {eventEmitter} from './gameSetup.js';
import {Office} from '~/public/game/components/pixi/manual-stage/office.js';
import MlLabNarrator from '~/public/game/controllers/game/mlLabNarrator';
import TitlePageUI from '~/public/game/components/interface/ui-title/ui-title';
import TextBoxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import TransitionOverlay from '~/public/game/components/interface/transition/transition-overlay/transition-overlay';
import TrainingStageOverlay from '~/public/game/components/interface/training-stage/training-overlay/training-overlay';
import {EVENTS, STAGES} from '~/public/game/controllers/constants';
import EndGameOverlay from '~/public/game/components/interface/ml/endgame-overlay/endgame-overlay';
import * as state from '~/public/game/controllers/common/state';

let office;
let currentStage;
let revenue;
let transitionOverlay;
let trainingStageOverlay;
let titlePageUI;
let mlLab;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({
    namespace: 'game-fsm',
    states: {
        uninitialized: {
            startGame: function() {
                this.transition('titleStage');
                // this.transition('smallOfficeStage');
                // this.transition('mlTransitionStage');
                // this.transition('mlTrainingStage');
                //this.transition('mlLabStage');
                //this.transition('gameBreakdown');
            },
        },

        /* ///////////////////
        // Title stage
        */// /////////////////
        titleStage: {
            _onEnter: function() {
                state.set('stage', STAGES.TITLE);
                titlePageUI = new TitlePageUI({
                    headerText: txt.titleStage.header,
                    content: txt.titleStage.instruction,
                    responses: txt.titleStage.responses,
                    show: true,
                });

                eventEmitter.on(EVENTS.TITLE_STAGE_COMPLETED, () => {
                    this.handle('nextStage');
                });
                gtag('event', 'enter-title-stage', {'event_category': 'progress', 'event_label': 'states'});
            },

            nextStage: 'smallOfficeStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Small Office Stage
        */// /////////////////
        smallOfficeStage: {
            _onEnter: function() {
                state.set('stage', STAGES.MANUAL_SMALL);
                currentStage = 0;
                new TextBoxUI({
                    subject: txt.smallOfficeStage.subject,
                    content: txt.smallOfficeStage.messageFromVc,
                    responses: txt.smallOfficeStage.responses,
                    show: true,
                    stageNumber: currentStage,
                    overlay: true,
                });
                office = new Office();
                gtag('event', 'enter-small-office', {'event_category': 'progress', 'event_label': 'states'});
            },

            nextStage: 'mediumOfficeStage',

            _onExit: function() {
            },
        },

        /* //////////////////
        // Medium Small Office Stage
        */// /////////////////
        mediumOfficeStage: {
            _onEnter: function() {
                state.set('stage', STAGES.MANUAL_MEDIUM);
                currentStage = 1;
                state.set('hiring-stage-number', currentStage);
                new TextBoxUI({
                    stageNumber: currentStage,
                    subject: txt.mediumOfficeStage.subject,
                    content: txt.mediumOfficeStage.messageFromVc,
                    responses: txt.mediumOfficeStage.responses,
                    show: true,
                    overlay: true,
                    displayScore: true,
                });
                gtag('event', 'enter-medium-office', {'event_category': 'progress', 'event_label': 'states'});
                state.set('hiring-stage-success', false);
            },

            nextStage: 'largeOfficeStage',

            _onExit: function() {
            },
        },

        /* //////////////////
        // Large Small Office Stage
        */// /////////////////
        largeOfficeStage: {
            _onEnter: function() {
                state.set('stage', STAGES.MANUAL_LARGE);
                currentStage = 2;
                state.set('hiring-stage-number', currentStage);
                const {messageFromVc: successMessage, previousStageFailed: failMessage} = txt.largeOfficeStage;
                const previousStageSuccess = state.get('hiring-stage-success');
                new TextBoxUI({
                    stageNumber: currentStage,
                    subject: txt.largeOfficeStage.subject,
                    content: previousStageSuccess ? successMessage : failMessage,
                    responses: txt.largeOfficeStage.responses,
                    show: true,
                    overlay: true,
                    displayScore: true,
                });
                gtag('event', 'enter-large-office', {'event_category': 'progress', 'event_label': 'states'});
                state.set('hiring-stage-success', false);
            },

            nextStage: 'mlTransitionStage',

            _onExit: function() {
            },
        },

       
        mlTransitionStage: {
            _onEnter: function() {
                if (office) office.delete();
                state.set('stage', STAGES.TRANSITION);
                currentStage = 3;
                const {messageFromVc: successMessage, previousStageFailed: failMessage} = txt.mlTransition;
                const previousStageSuccess = state.get('hiring-stage-success');
                new TextBoxUI({
                    stageNumber: currentStage,
                    subject: txt.mlTransition.subject,
                    content: previousStageSuccess ? successMessage : failMessage,
                    responses: txt.mlTransition.responses,
                    show: true,
                    overlay: true,
                    isTransition: true,
                    displayScore: false,
                });

                eventEmitter.on(EVENTS.TRANSITION_INSTRUCTION_ACKED, () => {
                    transitionOverlay = new TransitionOverlay({show: true});
                });
                gtag('event', 'enter-transition-stage', {'event_category': 'progress', 'event_label': 'states'});
            },

            nextStage: 'mlTrainingStage',

            _onExit: function() {
                transitionOverlay.destroy();
            },
        },

        mlTrainingStage: {
            _onEnter: function() {
                state.set('stage', STAGES.TRAINING);
                if (office) office.delete();
                trainingStageOverlay = new TrainingStageOverlay();
                gtag('event', 'enter-training-stage', {'event_category': 'progress', 'event_label': 'states'});
            },

            nextStage: 'mlLabStage',

            _onExit: function() {
                trainingStageOverlay.destroy();
            },
        },

        mlLabStage: {
            _onEnter: function() {
                if (office) office.delete();
                state.set('stage', STAGES.ML_LAB);
                mlLab = new MlLabNarrator();
                gtag('event', 'enter-mllab', {'event_category': 'progress', 'event_label': 'states'});
            },

            nextStage: 'gameBreakdown',

            _onExit: function() {
            },
        },

        gameBreakdown: {
            _onEnter: function() {
                gtag('event', 'enter-game-end', {'event_category': 'progress', 'event_label': 'states'});
                state.set('stage', STAGES.GAME_END);
                new EndGameOverlay();
                if (mlLab) mlLab.destroy();
            },
        },

    },

    startGame: function() {
        this.handle('startGame');
    },

    nextStage: function() {
        this.handle('nextStage');
    },

    repeatStage: function() {
        this.handle('repeatStage');
    },
});

export {gameFSM};
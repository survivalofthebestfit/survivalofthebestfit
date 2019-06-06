import * as machina from 'machina';
import {eventEmitter} from './gameSetup.js';
import {Office} from '~/public/game/components/pixi/manual-stage/office.js';
import MlLabNarrator from '~/public/game/controllers/game/mlLabNarrator';
import TitlePageUI from '~/public/game/components/interface/ui-title/ui-title';
import TextBoxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import TransitionOverlay from '~/public/game/components/interface/transition/transition-overlay/transition-overlay';
import TrainingStageOverlay from '~/public/game/components/interface/training-stage/training-overlay/training-overlay';
import EVENTS from '~/public/game/controllers/constants/events';
import EndGameOverlay from '~/public/game/components/interface/ml/endgame-overlay/endgame-overlay';

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
                // this.transition('titleStage');
                this.transition('smallOfficeStage');
                // this.transition('mlTransitionStage');
                // this.transition('mlTrainingStage');
                // this.transition('mlLabStage');
                // this.transition('gameBreakdown');
            },
        },

        /* ///////////////////
        // Title stage
        */// /////////////////
        titleStage: {
            _onEnter: function() {
                titlePageUI = new TitlePageUI({
                    headerText: txt.titleStage.header,
                    content: txt.titleStage.instruction,
                    responses: txt.titleStage.responses,
                    show: true,
                });

                eventEmitter.on(EVENTS.TITLE_STAGE_COMPLETED, () => {
                    this.handle('nextStage');
                });
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
                currentStage = 1;

                new TextBoxUI({
                    stageNumber: currentStage,
                    subject: txt.mediumOfficeStage.subject,
                    content: txt.mediumOfficeStage.messageFromVc,
                    responses: txt.mediumOfficeStage.responses,
                    show: true,
                    overlay: true,
                    displayScore: true,
                });
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
                currentStage = 2;

                new TextBoxUI({
                    stageNumber: currentStage,
                    subject: txt.largeOfficeStage.subject,
                    content: txt.largeOfficeStage.messageFromVc,
                    responses: txt.largeOfficeStage.responses,
                    show: true,
                    overlay: true,
                    displayScore: true,
                });
            },

            nextStage: 'mlTransitionStage',

            _onExit: function() {
            },
        },

       
        mlTransitionStage: {
            _onEnter: function() {
                if (office) office.delete();

                currentStage = 3;

                new TextBoxUI({
                    stageNumber: currentStage,
                    subject: txt.mlTransition.subject,
                    content: txt.mlTransition.messageFromVc,
                    responses: txt.mlTransition.responses,
                    show: true,
                    overlay: true,
                    isTransition: true,
                    displayScore: false,
                });

                eventEmitter.on(EVENTS.TRANSITION_INSTRUCTION_ACKED, () => {
                    transitionOverlay = new TransitionOverlay({show: true});
                });
            },

            nextStage: 'mlTrainingStage',

            _onExit: function() {
                transitionOverlay.destroy();
            },
        },

        mlTrainingStage: {
            _onEnter: function() {
                if (office) office.delete();
                trainingStageOverlay = new TrainingStageOverlay();
            },

            nextStage: 'mlLabStage',

            _onExit: function() {
                trainingStageOverlay.destroy();
            },
        },

        mlLabStage: {
            _onEnter: function() {
                if (office) office.delete();

                mlLab = new MlLabNarrator();
            },

            nextStage: 'gameBreakdown',

            _onExit: function() {
            },
        },

        gameBreakdown: {
            _onEnter: function() {
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
import * as machina from 'machina';
import {eventEmitter} from './gameSetup.js';
import {Office} from '~/public/game/components/pixi/manual-stage/office.js';
import MlLabNarrator from '~/public/game/controllers/game/mlLabNarrator';
import TitlePageUI from '~/public/game/components/interface/ui-title/ui-title';
import TextBoxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import PerfMetrics from '~/public/game/components/interface/perf-metrics/perf-metrics';
import TransitionOverlay from '~/public/game/components/interface/transition/transition-overlay/transition-overlay';
import TrainingStageOverlay from '~/public/game/components/interface/training-stage/training-overlay/training-overlay';
import EVENTS from '~/public/game/controllers/constants/events';

let office = new Office();
let currentStage;
let revenue;
let transitionOverlay;
let trainingStageOverlay;
let titlePageUI;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({
    namespace: 'game-fsm',
    states: {
        uninitialized: {
            startGame: function() {
                //this.transition('titleStage');
                // this.transition('smallOfficeStage');
                // this.transition('mlTransitionStage');
                // this.transition('mlTrainingStage');
                // this.transition('mlLabStage');
                this.transition('explainerStage');
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

                eventEmitter.on('first-start-button-clicked', () => {
                    this.handle('nextStage');
                });
            },

            nextStage: 'tutorialStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Tutorial stage
        */// /////////////////
        tutorialStage: {
            _onEnter: function() {
                titlePageUI.updateContent({
                    headerText: txt.tutorialStage.header,
                    content: txt.tutorialStage.instruction,
                    responses: txt.tutorialStage.responses,
                    show: true,
                });

                eventEmitter.on('second-start-button-clicked', () => {
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
                    content: txt.smallOfficeStage.messageFromVc,
                    responses: txt.smallOfficeStage.responses,
                    show: true,
                    stageNumber: currentStage,
                    overlay: true,
                });
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
                    content: txt.mlTransition.messageFromVc,
                    responses: txt.mlTransition.responses,
                    show: true,
                    overlay: true,
                    isTransition: true,
                    displayScore: true,
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
                if (revenue) {
                    revenue.show();
                } else {
                    office.delete();
                    new PerfMetrics().show();
                }

                new MlLabNarrator();
            },
            // TODO destroy the lab!
            nextStage: 'explainerStage',

        },


        explainerStage: {
            _onEnter: function() {
                console.log("entered stage");
                var doc = document.getElementById("conclusion");
                doc.style.display = "block";   

                     
                
                //console.log("entered stage");
                //training2 = new TrainingStageOverlay();
            },


            //nextStage: 'mlLabStage',

            
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
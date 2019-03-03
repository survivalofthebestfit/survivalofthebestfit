import * as machina from 'machina';
import {pixiApp, eventEmitter, beltContainer, officeContainer, DRAW_STACK} from './gameSetup.js';
import {createPerson} from '../../components/pixi/person.js';
import {Office} from '../../components/pixi/office.js';
import {createMlOffice} from '../../components/pixi/mlLab.js';
import {incubator} from '../common/textures.js';
import {TextBox} from '../../components/interface/old-pixi-components-demise/instructionBubble.js';
import NewsFeedUI from '../../components/interface/ml/news-feed/news-feed.js';
import MLAlgorithmInspectorUI from '../../components/interface/ml/algorithm-inspector/algorithm-inspector.js';
import MLResumeViewerUI from '../../components/interface/ml/resume-viewer/resume-viewer.js';
import TextBoxUI from '../../components/interface/ui-instruction/ui-instruction';
import ResumeUI from '../../components/interface/ui-resume/ui-resume';
import TaskUI from '../../components/interface/ui-task/ui-task';
import {startTaskTimer} from '../../components/interface/old-pixi-components-demise/taskTimer.js';
import {cvCollection} from '../../assets/text/cvCollection.js';
import {uv2px, animateTo} from '../common/utils.js';

import {xIcon} from '../common/textures.js';
import {beltTexture, doorTexture, cvTexture} from '../common/textures.js';

let office;
let personList;
let cvViewerML;
let cvList;

/**
 * MINIMIZE GAME SETUP CODE HERE. Try to shift setup into other files respective to stage
 * Gamestates is for the orchestration and sequencing of object creation.
 */
const gameFSM = new machina.Fsm({

    namespace: 'game-fsm',
    // initialState: 'mlLabStage',

    states: {
        uninitialized: {
            startGame: function() {
                this.transition('mlLabStage');
            },
        },

        /* ///////////////////
        // Welcome image
        */// /////////////////
        welcomeStage: {
            _onEnter: function() {
                this.timer = setTimeout(() => {
                    this.handle('timeout');
                }, 300);

                this.image = new PIXI.Sprite(incubator);
                pixiApp.stage.addChild(this.image);
                this.image.scale.set(0.7);
            },

            timeout: 'smallOfficeStage',

            _onExit: function() {
                clearTimeout(this.timer);
                this.image.parent.removeChild(this.image);
            },
        },

        /* ///////////////////
        // Small office, hiring from the street
        */// /////////////////

        smallOfficeStage: {
            _onEnter: function() {
                const smallOfficeStageText = new TextBoxUI({content: txt.smallOfficeStage.messageFromVc, show: true});
                eventEmitter.on('instructionAcked', () => {
                    this.handle('setupOffice');
                });
            },

            setupOffice: function() {
                office = new Office();
                personList = [];
                // create People in the office
                let x = 0.12;
                for (let i = 0; i < 12; i++) {
                    const person = createPerson(x, 0.88, office);
                    personList.push(person);
                    x += 0.05;
                }
                new TaskUI({show: true, hires: 5, duration: 30, content: txt.smallOfficeStage.taskDescription});
                new ResumeUI({show: true, features: cvCollection.cvFeatures, scores: cvCollection.smallOfficeStage});
            },

            nextStage: 'mediumOfficeStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Big office, city level view
        */// /////////////////
        mediumOfficeStage: {
            _onEnter: function() {
                // const smallOfficeStageOver = new TextBox(uv2px(0.5, 'w'), uv2px(0.5, 'h'), txt.mediumOfficeStage.messageFromVc);
                const mediumOfficeStageText = new TextBoxUI({content: txt.mediumOfficeStage.messageFromVc, show: true});
                eventEmitter.on('instructionAcked', () => {
                    this.handle('expandOffice');
                });

                eventEmitter.on('time-up', () => {
                    this.handle('retryStage');
                });
            },

            expandOffice: function() {
                office.expandOffice(getUnassignedPeople());

                new TaskUI({show: true, hires: 10, duration: 30, content: txt.mediumOfficeStage.taskDescription});
            },

            nextStage: 'bigOfficeStage',

            _onExit: function() {

            },
        },

        /* ///////////////////
        // Huge office, ccountry level view
        */// /////////////////
        bigOfficeStage: {
            _onEnter: function() {
                office.expandOffice(getUnassignedPeople());
            },

            nextStage: 'mlTransitionStage',

            _onExit: function() {

            },
        },

        mlTransitionStage: {
            _onEnter: function() {

            },

            nextStage: 'mlLabStage',

            _onExit: function() {

            },
        },

        mlLabStage: {

            _onEnter: function() {
                createMlOffice();
<<<<<<< HEAD
            },

            nextStage: 'Oh gish we haven\'t even started it hahah',
=======
                new MLResumeViewerUI({show: true, type: 'accepted'});
                new MLResumeViewerUI({show: true, type: 'rejected'});
                new MLAlgorithmInspectorUI({});
                new NewsFeedUI({show: true});
            },
>>>>>>> 3911dbcc85db31d090f5e9160fb139e5b1db35a8

        },


    },


    startGame: function() {
        this.handle('startGame');
    },
    nextStage: function() {
        this.handle('nextStage');
    },
});

const getUnassignedPeople = () => {
    const unassignedPeople = [];
    for (let i = 0; i < personList.length; i++) {
        if (!personList[i].controller.isSeated()) {
            unassignedPeople.push(personList[i]);
        }
    }
    return unassignedPeople;
};

export {gameFSM};

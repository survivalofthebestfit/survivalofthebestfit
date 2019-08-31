import '@babel/polyfill';
import ComponentLoader from 'component-loader-js';
import {pixiApp, startTweenManager} from './gameSetup.js';
import {gameFSM} from './stateManager.js';
import * as textures from '../common/textures.js';
import * as sound from '../game/sound.js';
import ChoiceButton from '../../components/interface/transition/choice-button/choice-button';
import Replica from '../../components/interface/transition/replica/replica';
import StatsConvChoiceButton from '../../components/interface/stats-conversation/stats-choice-button/stats-choice-button';
import StatsConvReplica from '../../components/interface/stats-conversation/replica/replica';
import Footer from '../../components/interface/footer/footer';


const componentLoader = new ComponentLoader({
    ChoiceButton,
    Replica,
    Footer,
    StatsConvChoiceButton,
    StatsConvReplica,
});

document.getElementById('gameCanvas').appendChild(pixiApp.view);

sound.init();

Promise.all([sound.load(), textures.loadAssets()])
    .then(() => {
        console.log('assets have loaded start the game');
        gameFSM.startGame();
        componentLoader.scan();
        startTweenManager();
    }).catch((err) => {
        console.log(err);
    });



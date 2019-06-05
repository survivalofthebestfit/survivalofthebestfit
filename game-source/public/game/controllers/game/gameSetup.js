import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';
const debounce = require('debounce');
import EVENTS from '../constants/events';

// make fullscreen app
const pixiApp = new PIXI.Application(
    window.innerWidth,
    window.innerHeight,
    {backgroundColor: 0xf9f0e2}
);
pixiApp.renderer.autoResize = true;
// pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
// pixiApp.renderer.antialias = true;


// TODO - should these be pre-defined here?
const officeStageContainer = new PIXI.Container();
const mlLabStageContainer = new PIXI.Container();
const mlTrainingStageContainer = new PIXI.Container();
const timerContainer = new PIXI.Container();
const beltContainer = new PIXI.Container();

pixiApp.stage.addChild(officeStageContainer);
pixiApp.stage.addChild(timerContainer);
pixiApp.stage.addChild(beltContainer);
pixiApp.stage.addChild(mlLabStageContainer);
pixiApp.stage.addChild(mlTrainingStageContainer);

// shared eventEmitter across components
const eventEmitter = new PIXI.utils.EventEmitter();
PIXI.settings.PRECISION_FRAGMENT = 'highp';

// console.log(PIXI.Ticker);
const ticker = pixiApp.ticker;
ticker.autoStart = false;

// setup for the pixi-tween manager  CALLED AT THE END OF MAIN.JS
let raf;
let startTweenManager = function() {
    raf = window.requestAnimationFrame(startTweenManager);
    pixiApp.renderer.render(pixiApp.stage);
    PIXI.tweenManager.update();
};
let stopTweenManager = function() {
    window.cancelAnimationFrame(raf);
};
startTweenManager = startTweenManager.bind(this);
stopTweenManager = startTweenManager.bind(this);

window.addEventListener('resize', debounce(resize, 200));
window.addEventListener('orientationchange', resize);

function resize() {
    console.log('resize the screen!');
    pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
    eventEmitter.emit(EVENTS.RESIZE, {});
    // TODO redraw all the elements!
}

export {pixiApp, beltContainer, officeStageContainer, mlTrainingStageContainer, mlLabStageContainer, timerContainer, eventEmitter, startTweenManager, stopTweenManager, ticker};

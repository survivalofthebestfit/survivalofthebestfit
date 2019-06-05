import * as PIXI from 'pixi.js';
import {uv2px, waitForSeconds} from '~/public/game/controllers/common/utils.js';
import {mlTrainingStageContainer, eventEmitter, pixiApp, ticker} from '~/public/game/controllers/game/gameSetup.js';
import {EVENTS} from '~/public/game/controllers/constants';

export default class {
    constructor() {
        this.minMargin = uv2px(0.1, 'h');
        this.surface = null;
        this.side = null;
        this.elapsedTime = 0;
        this.gridUpdate = 200;
        this.gridOffset = 50;
        this.cols = undefined;
        this.rows = undefined;
        this.marginX = undefined;
        this.marginY = undefined;
        // this.rowsLitUp = this.rows;
        this.rowsLitUp = 0;
        this.addToPixi();
    }

    addToPixi() {
        this.ctx = new PIXI.Graphics();
        this.getGridDimensions();
        mlTrainingStageContainer.addChild(this.ctx);
        this.lightUp();
    }

    lightUp() {
        this._draw({mode: 'lightUp'});
        this.rowsLitUp++;
        waitForSeconds(0.1).then(() => {
            // console.log(`rows lit up: ${this.rowsLitUp} / total rows: ${this.rows}`);
            if (this.rowsLitUp < this.rows) {
                console.log('light up another row!');
                this.lightUp();
            } else {
                console.log('start processing!');
                this.startFlickering();
            }
        });
    }

    lightDown() {
        this._draw({mode: 'lightDown'});
        this.rowsLitUp--;
        waitForSeconds(0.1).then(() => {
            if (this.rowsLitUp >= 0) {
                console.log('light down another row!');
                this.lightDown();
            } else {
                this.ctx.clear();
                console.log('stop processing!');
            }
        });
    }

    startFlickering() {
        ticker.add(this.processingHandler.bind(this));
        ticker.start();
    }

    stopFlickering() {
        ticker.stop();
        ticker.remove(this.processingHandler.bind(this));
    }

    processingHandler() {
        this.elapsedTime += ticker.elapsedMS;
        if (this.elapsedTime > this.gridUpdate) {
            this._draw({mode: 'random'});
            this.elapsedTime = 0;
        };
    }

    getGridDimensions() {
        const {width, height} = pixiApp.screen;
        this.cols = Math.floor((width - 2*this.minMargin)/this.gridOffset);
        this.rows = Math.floor((height - 2*this.minMargin)/this.gridOffset);
        this.marginX = Math.round((width - (this.cols*this.gridOffset))/2);
        this.marginY = Math.round((height - (this.rows*this.gridOffset))/2);
    }

    _draw({mode = undefined}) {
        this.ctx.clear();

        let drawFilter;
        switch (mode) {
        case 'lightUp':
        case 'lightDown':
            drawFilter = (x, y, row, col) => {
                if (row <= this.rowsLitUp) {
                    const x = this.marginX + (col*this.gridOffset);
                    const y = this.marginY + (row*this.gridOffset);
                    this.ctx.beginFill(0xffffff);
                    this.ctx.drawCircle(x, y, 5);
                    this.ctx.endFill();
                }
            };
            break;
        case 'random':
            drawFilter = (x, y, row, col) => {
                if (Math.random() > 0.5) {
                    this.ctx.beginFill(0xffffff);
                    this.ctx.drawCircle(x, y, 5);
                    this.ctx.endFill();
                }
            };
            break;
        default:
            console.warn(`mode ${mode} is invalid for drawing circles`);
        }

        for (let col = 0; col <= this.cols; col++) {
            for (let row = 0; row <= this.rows; row++) {
                // console.log('row');
                const x = this.marginX + (col*this.gridOffset);
                const y = this.marginY + (row*this.gridOffset);
                drawFilter(x, y, row, col);
            }
        }
    }


    // resize function

    _resizeHandler() {
        this.getGridDimensions();
    }

    // add event listeners

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESIZE, this._resizeHandler.bind(this));
    }

    // remove event listeners

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESIZE, this._resizeHandler.bind(this));
    }

    destroy() {
        mlTrainingStageContainer.removeChild(this.ctx);
    }
}

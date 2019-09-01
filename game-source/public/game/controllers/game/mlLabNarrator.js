
import {EVENTS, CLASSES, SOUNDS} from '~/public/game/controllers/constants';
import TextboxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import InfoTooltip from '~/public/game/components/interface/ml/info-tooltip/info-tooltip';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';
import NewsFeedUI from '~/public/game/components/interface/ml/news-feed/news-feed.js';
import MlLabAnimator from '~/public/game/controllers/game/mlLabAnimator.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import StatsConversation from '~/public/game/components/interface/stats-conversation/transition-overlay/transition-overlay';
import * as sound from '~/public/game/controllers/game/sound.js';
import * as state from '~/public/game/controllers/common/state.js';
import TaskUI from '~/public/game/components/interface/ui-task/ui-task';

export default class MlLabNarrator {
    constructor() {
        this.animator = new MlLabAnimator();
        this.newsFeed = new NewsFeedUI({show: true});

        this.ML_TIMELINE = txt.mlLabStage.narration;
        this.newsTimeOffset = 6;
        this.isActive = false;
        this.scheduleTimelineUpdate = this.scheduleTimelineUpdate.bind(this);
        this.populateHiringGoals();

        this.task = new TaskUI({
            showTimer: false, 
            placeLeft: true,
            hires: this.ML_TIMELINE[this.ML_TIMELINE.length-1].delay,
        });

        this._addEventListeners();
        this.start();
    }

    populateHiringGoals() {
        // You can use this to debug so that ML lab stage progresses faster
        const debugMode = true;
        
        let hiringCount = 0;

        if (debugMode) {
            for (let i = 0; i < this.ML_TIMELINE.length; i++) {
                this.ML_TIMELINE[i].delay = i + 1;
            }
        } else {
            const stageGoal = 3;
            for (let i = 0; i < this.ML_TIMELINE.length; i++) {
                hiringCount += stageGoal;
                this.ML_TIMELINE[i].delay = hiringCount;
            }
        }
    }

    start() {
        this.isActive = true;
        // DISPLAY THE FIRST NEWSFEED that happens before the first investor message
        this.newsFeed.updateNewsFeed({news: this.ML_TIMELINE[0].news});
        state.set('ml-sound', SOUNDS.ML_LAB_AMBIENT);
        sound.schedule(state.get('ml-sound'), 1);
        if (!Array.isArray(this.ML_TIMELINE)) throw new Error('The timeline needs to be an array!');
    }

    stop() {
        this.isActive = false;
    }

    scheduleTimelineUpdate() {
        this.updateTimeline();
        if (this.ML_TIMELINE.length === 0 || !this.isActive) return;
        if (!this.ML_TIMELINE[0].hasOwnProperty('delay')) throw new Error('The ML message object needs to have a delay!');
        if ( this.ML_TIMELINE.length === 1) this.ML_TIMELINE[0].isLastMessage = true;

        this._showNewMessage(this.ML_TIMELINE[0]);

        // NEWS UPDATE
        if (!this.ML_TIMELINE[0].hasOwnProperty('news')) return;
        if (this.ML_TIMELINE[0].breaking) {
            console.log('we have breaking news!');
        }
        this.newsFeed.updateNewsFeed({news: this.ML_TIMELINE[0].news});
    };
    
    _showNewMessage(msg) {
        if (!msg.hasOwnProperty('messageFromVc') || !msg.hasOwnProperty('responses')) throw new Error('message object does not have valid properties!');
        let callback = this.textAckCallback.bind(this, msg, this.animator, this.newsFeed);
        if (msg.tooltip) callback = this.showTooltipCallback.bind({}, msg, this.newsFeed, callback);
        
        this.animator.pauseAnimation();
        this.newsFeed.stop();
        this.newsFeed.hide();
        sound.fadeOut(state.get('ml-sound'), false);
        sound.play(SOUNDS.NEW_MESSAGE);

        new TextboxUI({
            show: true,
            type: CLASSES.ML,
            content: msg.messageFromVc,
            responses: msg.responses,
            callback: callback,
        });
    }

    showTooltipCallback(msg, newsFeed, textAckCallback) {
        new InfoTooltip(msg.tooltip, textAckCallback);
        newsFeed.hide();
    }

    textAckCallback(msg, animator, newsFeed) {
        // not starting animation when we need to launch inspector
        // make sure we restart it elsewhere
        if (msg.launchCVInspector) {
            animator.datasetView.show();
            return;
        }

        if (msg.breaking) {
            newsFeed.breaking();
            sound.play(SOUNDS.BREAKING_NEWS);
        }

        if (msg.launchMachineInspector) {
            this.statsConversation = new StatsConversation({show: true, endCallback: this.textAckCallback});
            return;
        }
        // if we are not inspecting anything, continue playing the background sound
        sound.play(state.get('ml-sound'));
        
        if (msg.isLastMessage) {
            gameFSM.nextStage();
            return;
        } 
        animator.datasetView.hide();
        animator.startAnimation();
        newsFeed.start();
        newsFeed.show();
    }

    // update schedule: pop the first timer value from the array
    updateTimeline() {
        this.ML_TIMELINE = this.ML_TIMELINE.slice(1);
        console.log(this.ML_TIMELINE[0]);
    }

    _handleEmailReply() {
        this.ML_TIMELINE[0].launchCVInspector = false;
        this.ML_TIMELINE[0].launchMachineInspector = false;
        const callback = this.textAckCallback.bind({}, this.ML_TIMELINE[0], this.animator, this.newsFeed);

        new TextboxUI({
            show: true,
            type: CLASSES.ML,
            content: this.ML_TIMELINE[0].inspectQuestion,
            responses: this.ML_TIMELINE[0].inspectResponses,
            callback: callback,
            // TODO - can we do overlay??
            overlay: true,
        });        
    }

    _triggerTimelineUpdate(count) {
        if (count === this.ML_TIMELINE[0].delay) {
            this.scheduleTimelineUpdate();
        }
        console.log(count);
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.EMAIL_REPLY, this._handleEmailReply.bind(this));
        eventEmitter.on(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
        eventEmitter.on(EVENTS.ACCEPTED, this._triggerTimelineUpdate.bind(this));
        eventEmitter.on(EVENTS.EXIT_STATS_CONVERSATION, function() {
            this.textAckCallback({launchCVInspector: false, breaking: false, launchMachineInspector: false, isLastMessage: false}, this.animator, this.newsFeed);
        }.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.EMAIL_REPLY, this._handleEmailReply.bind(this));
        eventEmitter.off(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
        eventEmitter.off(EVENTS.ACCEPTED, this._triggerTimelineUpdate.bind(this));
        eventEmitter.off(EVENTS.EXIT_STATS_CONVERSATION, this.textAckCallback.bind({}, {launchCVInspector: false, breaking: false, launchMachineInspector: false, isLastMessage: false}, this.animator, this.newsFeed));
    }

    destroy() {
        sound.fadeOut(state.get('ml-sound'));
        this.stop();
        this.animator.destroy();
        this._removeEventListeners();
        this.newsFeed.destroy();
    }
}

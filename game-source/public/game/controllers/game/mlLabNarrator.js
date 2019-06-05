
import EVENTS from '~/public/game/controllers/constants/events';
import CLASSES from '~/public/game/controllers/constants/classes';
import TextboxUI from '~/public/game/components/interface/ui-textbox/ui-textbox';
import InfoTooltip from '~/public/game/components/interface/ml/info-tooltip/info-tooltip';
import {gameFSM} from '~/public/game/controllers/game/stateManager.js';

import NewsFeedUI from '~/public/game/components/interface/ml/news-feed/news-feed.js';
import MlLabAnimator from '~/public/game/controllers/game/mlLabAnimator.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import { dataModule } from '~/public/game/controllers/machine-learning/dataModule';

export default class MlLabNarrator {
    constructor() {
        this.animator = new MlLabAnimator();
        this.newsFeed = new NewsFeedUI({show: true});
        
        this.ML_TIMELINE = txt.mlLabStage.narration;
        this.newsTimeOffset = 6;
        this.isActive = false;
        this.scheduleTimelineUpdate = this.scheduleTimelineUpdate.bind(this);
        this._addEventListeners();

        this.start();
    }

    start() {
        this.isActive = true;
        // DISPLAY THE FIRST NEWSFEED that happens before the first investor message
        this.newsFeed.updateNewsFeed({news: this.ML_TIMELINE[0].news});
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
        this.newsFeed.updateNewsFeed({news: this.ML_TIMELINE[0].news});
    };
    
    _showNewMessage(msg) {
        if (!msg.hasOwnProperty('messageFromVc') || !msg.hasOwnProperty('responses')) throw new Error('message object does not have valid properties!');
        let callback = this.textAckCallback.bind({}, msg, this.animator, this.newsFeed);
        if (msg.tooltip) callback = this.showTooltipCallback.bind({}, msg, this.newsFeed, callback);

        if (msg.hasOwnProperty('inspect')) {

            let toInspectId = this.animator.chooseCandidateToInspect();
            let toInspectName = dataModule.getNameForPersonId(toInspectId);
            msg.messageFromVc = msg.messageFromVc.replace('{name}', "<u>"+toInspectName+"</u>");
        };
        
        this.animator.pauseAnimation();
        this.newsFeed.stop();
        this.newsFeed.hide();

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
        animator.startAnimation();
        newsFeed.start();
        newsFeed.show();
        
        if (msg.isLastMessage) {
            // whenever you want to log an event in Google Analytics, just call one of these functions with appropriate names
            gtag('event', 'test-game-completed', {
                'event_category': 'default',
                'event_label': 'how-far-do-ppl-get',
            });

            gameFSM.nextStage();
            // new EndGameOverlay();

            return;
        } 
    }

    // update schedule: pop the first timer value from the array
    updateTimeline() {
        this.ML_TIMELINE = this.ML_TIMELINE.slice(1);
    }

    _triggerTimelineUpdate(count) {
        if (count === this.ML_TIMELINE[0].delay) {
            this.scheduleTimelineUpdate();
        }
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
        eventEmitter.on(EVENTS.ACCEPTED, this._triggerTimelineUpdate.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.RESUME_TIMELINE, this.scheduleTimelineUpdate);
        eventEmitter.off(EVENTS.ACCEPTED, this._triggerTimelineUpdate.bind(this));
    }

    destroy() {
        this.stop();
        this.animator.destroy();
        this._removeEventListeners();
        this.newsFeed.destroy();
    }
}

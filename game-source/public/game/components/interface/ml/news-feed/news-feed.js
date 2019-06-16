import $ from 'jquery';
import {TweenLite} from 'gsap/TweenMax';
import CLASSES from '~/public/game/controllers/constants/classes';
import EVENTS from '~/public/game/controllers/constants/events';
import UIBase from '~/public/game/components/interface/ui-base/ui-base';
import {screenSizeDetector} from '~/public/game/controllers/common/utils.js';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';


export default class extends UIBase {
    constructor(options) {
        super();
        this.$el = $('#news-feed');
        this.$newsList = this.$el.find('.NewsList');
        this.$newsElArray = [];
        this._newsArray = [];
        this.isDesktop = screenSizeDetector() === 'desktop';
        this._content = options ? options.content : 'dummy text'; // TODO: change this to null

        this._addEventListeners();
        // instead of showing the news feed right away launch the news updates timeline
        if (options && options.show) {
            // this._newsTimeline.start();
        }
    }

    updateNewsFeed({news}) {
        if (!Array.isArray(news) || news.length < 2) throw new Error('News has to be an array - with at least two members!');

        this.$newsList.empty();
        for (let i = 0; i < 30; i++) {
            news.forEach((n) => {
                this._newsArray.unshift(n); // add element to the beginning of the news array
                this._createNewsElement(n);
            });
        }

        this.animateNews(); // TODO
        this._newsArray = this._newsArray.slice(0, 2); // pop the outdated news from the array
        this.show(); // show the updated news feed
        console.log('SHOW NEWS FEED!');
        // TODO tweak this if needed - schedule to hide the news after some time
    }

    breaking() {
        this.$el.addClass(CLASSES.BREAKING_NEWS);
    }

    _createNewsElement(newsText) {
        const newsEl = document.createElement('p');
        newsEl.classList.add(`${CLASSES.NEWS_FEED_ITEM}`);
        $(newsEl).text(newsText).appendTo(this.$newsList);
        this.$newsElArray.push(newsEl);
    }

    _addEventListeners() {
        eventEmitter.on(EVENTS.HIDE_NEWS_FEED, this.hide.bind(this));
    }

    _removeEventListeners() {
        eventEmitter.off(EVENTS.SHOW_NEWS, () => {});
    }

    show() {
        TweenLite.set('#news-feed', {y: -50}); // set the Y transform before animating it
        this.$el.removeClass(CLASSES.IS_INACTIVE);
        TweenLite.to('#news-feed', 0.3, {y: 0});
    }

    animateNews() {
        this.tween = TweenMax.staggerFromTo('.NewsList', 140, {x: '0vw'}, {x: '-600vw', ease: Power0.easeNone, onComplete: function() {
            this.restart();
        }});
    }

    start() {
        this.tween[0].paused(false);
    }

    stop() {
        this.tween[0].paused(true);
    }

    hide() {
        TweenLite.to('#news-feed', 0.3, {y: -50});
        TweenLite.delayedCall(0.3, () => {
            this.$el.addClass(CLASSES.IS_INACTIVE);
        });
    }

    destroy() {
        super.dispose();
        this.hide();
        this._removeEventListeners();
        this.$el.destroy();
    }
}

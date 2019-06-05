import mq from 'browsernizr/lib/mq';
import {BREAKPOINTS} from '~/public/game/controllers/constants/index.js';
import {pixiApp} from '~/public/game/controllers/game/gameSetup.js';

// let {pixiApp.screen.width, pixiApp.screen.height} = pixiApp.screen;

const screenSizeDetector = () => {
    return mq(BREAKPOINTS.PHONE_LANDSCAPE) ? 'mobile' : 'desktop';
};

const isMobile = () => {
    return mq(BREAKPOINTS.PHONE_LANDSCAPE);
};

const spacingUtils = {
    getRelativePoint(val1, val2, ratio) {
        const min = Math.min(val1, val2);
        const max = Math.max(val1, val2);
        return min + (max - min) * ratio;
    },
    getCenteredChildX(parentX, parentWidth, childWidth) {
        return parentX + (parentWidth - childWidth) / 2;
    },
    getCenteredChildY(parentY, parentHeight, childHeight) {
        return parentY + (parentHeight - childHeight) / 2;
    },
    getOneThirdChildY(parentY, parentHeight, childHeight) {
        return parentY + (parentHeight - childHeight) / 3;
    },
    getTwoThirdsChildY(parentY, parentHeight, childHeight) {
        return parentY + 2 * ((parentHeight - childHeight) / 3);
    },
    // absolute pixiApp.screen.height/pixiApp.screen.width minus a value
    absMinusSize(px, axis) {
        return axis === 'w' ? pixiApp.screen.width - px : pixiApp.screen.height - px;
    },
    screenCenterX(childWidth) {
        return this.getCenteredChildX(0, uv2px(1, 'w'), childWidth);
    },
    screenCenterY(childHeight) {
        return this.getCenteredChildY(0, uv2px(1, 'h'), childHeight);
    },
};

/**
 * convert uv coordinates to screen pixels
 * start drawing at the center of the screen
 *
 * var coorObj = uv2px({x: 0.5, y: 0.5}); // if you prefer objects
 * var coorArray = uv2px([0.5,0.5]); // if you prefer arrays
 */

const uv2px = (uv, axis = null) => {
    // input is object
    if (typeof uv === 'object' && uv !== null) {
        const scaled_x = uv.x !== undefined ? uv.x * pixiApp.screen.width : null;
        const scaled_y = uv.y !== undefined ? uv.y * pixiApp.screen.height : null;
        return {
            x: scaled_x,
            y: scaled_y,
        };
    // input is number + axis
    } else if (typeof uv === 'number' && axis !== null && /^(w|h)$/.test(axis)) {
        return axis === 'w' ? uv * pixiApp.screen.width : uv * pixiApp.screen.height;
    // input is array
    } else if (Array.isArray(uv)) {
        return [uv[0] * pixiApp.screen.width, uv[1] * pixiApp.screen.height];
    } else {
        throw 'You supplied an invalid value to the function, check utils file for valid inputs';
    };
};

const px2uv = (px, axis = null) => {
    // input is object
    if (typeof px === 'object' && px !== null) {
        const uvX = px.x !== undefined ? px.x/pixiApp.screen.width : null;
        const uvY = px.y !== undefined ? px.y/pixiApp.screen.height : null;
        return {
            x: uvX,
            y: uvY,
        };
    // input is number + axis
    } else if (typeof px === 'number' && axis !== null && /^(w|h)$/.test(axis)) {
        return axis === 'w' ? px/pixiApp.screen.width : px/pixiApp.screen.height;
    // input is array
    } else if (Array.isArray(px)) {
        return [px[0] * pixiApp.screen.width, px[1] * pixiApp.screen.height];
    } else {
        throw 'You supplied an invalid value to the function, check utils file for valid inputs';
    };
};

const lerp = (v0, v1, t) => {
    return v0*(1-t)+v1*t;
};

// clamp a value
const clamp = (val, minVal, maxVal) => {
    return Math.max(minVal, Math.min(maxVal, val));
};

const getDateString = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const d = new Date();
    const hourString = `${d.getHours() > 0 ? d.getHours() : `0${d.getHours()}`}:${d.getMinutes() > 0 ? d.getMinutes() : `0${d.getMinutes()}`}`;
    return `${days[d.getDay()]} ${hourString}, ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
};

// convenience function to animate object, parameter default to not moving anywhere
function animateTo({target, x, y, scale=1, scaleY, easing=PIXI.tween.Easing.inQuart(), time=1000} = {}) {
    const X = x === undefined ? target.x : uv2px(x, 'w');
    const Y = y === undefined ? target.y : uv2px(y, 'h');
    const yScale = scaleY === undefined ? scale : scaleY;

    const tween = PIXI.tweenManager.createTween(target);
    tween.easing = easing;
    tween.time = time;
    tween.expire = false;
    tween.from({
        'x': target.x,
        'y': target.y,
        'scale': {'x': target.scale.x, 'y': target.scale.y},
    });
    tween.to({
        'x': X,
        'y': Y,
        'scale': {'x': target.scale.x*scale, 'y': target.scale.y*yScale},
    });
    return tween;
}

// create a new countdown timer

const waitForSeconds = (duration) => {
    const durationInMS = duration*1000;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, durationInMS);
    });
};

const setCanvasBackground = ({color = undefined}) => {
    switch (color) {
    case 'pink':
        console.log('change pixi background color to pink!');
        pixiApp.renderer.backgroundColor = 0xfeccc7;
        break;
    default:
        pixiApp.renderer.backgroundColor = 0xf9f0e2;
    }
};

const createPersonSprite = (color) => {
    const person = getPersonByColor(color);
    return new PIXI.extras.AnimatedSprite(PIXI.loader.resources[person].spritesheet.animations['idle']);
};

const getAnimationByName = ({color, animName}) => {
    const person = getPersonByColor(color);
    return PIXI.loader.resources[person].spritesheet.animations[animName];
};

const getPersonByColor = (color) => {
    switch (color) {
    case 'yellow':
        return 'yellowPerson';
    case 'blue':
        return 'bluePerson';
    default:
        throw new Error(`Invalid spritesheet requested, color '${color}' is invalid`);
    }
};

export {spacingUtils, uv2px, px2uv, clamp, animateTo, lerp, isMobile, getDateString, screenSizeDetector, waitForSeconds, setCanvasBackground, createPersonSprite, getAnimationByName};

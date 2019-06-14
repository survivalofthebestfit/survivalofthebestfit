import SCALES from '~/public/game/controllers/constants/pixi-scales.js';
import {screenSizeDetector} from '~/public/game/controllers/common/utils.js';

const SPRITES = {};

const loader = PIXI.loaders.shared;
loader
    .add('machine', 'assets/img/machine.png')
    .add('scanRay', 'assets/img/scan-ray.png')
    .add('rayAnim', 'assets/spritesheets/machine-ray/ray_spritesheet.json')
    .add('dataServerRejected', 'assets/spritesheets/data-server-rejected/data-server-rejected.json')
    .add('dataServerAccepted', 'assets/spritesheets/data-server-accepted/data-server-accepted.json')
    .add('doorAccepted', 'assets/img/door-accepted.png')
    .add('officeDoor', 'assets/spritesheets/office-door/office-door.json')
    .add('wayOutDoor', 'assets/spritesheets/way-out-door/door-rejected.json')
    .add('bluePerson', 'assets/spritesheets/characters/blue/blue.json')
    .add('yellowPerson', 'assets/spritesheets/characters/yellow/yellow.json');


async function loadAssets() {
    console.log('load assets!');
    await new Promise((resolve, reject) => {
        loader.load((loader, resources) => {
            SPRITES.doorAccepted = new PIXI.extras.AnimatedSprite(resources.officeDoor.spritesheet.animations['door']);
            SPRITES.doorEntry = new PIXI.extras.AnimatedSprite(resources.officeDoor.spritesheet.animations['door']);
            SPRITES.doorRejected = new PIXI.extras.AnimatedSprite(resources.wayOutDoor.spritesheet.animations['door']);
            SPRITES.machine = new PIXI.Sprite(resources.machine.texture);
            SPRITES.scanRay = new PIXI.Sprite(resources.scanRay.texture);
            SPRITES.rayAnim = new PIXI.extras.AnimatedSprite(resources.rayAnim.spritesheet.animations['ray']);
            SPRITES.dataServerAccepted = new PIXI.extras.AnimatedSprite(resources.dataServerAccepted.spritesheet.animations['data-server-accepted']);
            SPRITES.dataServerRejected = new PIXI.extras.AnimatedSprite(resources.dataServerRejected.spritesheet.animations['data-server-rejected']);
            // TODO: move data server scales to the data server component
            SPRITES.dataServerAccepted.scale.set(SCALES.DATA_SERVER[screenSizeDetector()]);
            SPRITES.dataServerRejected.scale.set(SCALES.DATA_SERVER[screenSizeDetector()]);
            console.log('all textures have loaded!');
            resolve();
        });
    });
};


// module to load textures
const yellowPersonTexture = PIXI.Texture.fromImage('assets/img/person_yellow.png');

yellowPersonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const bluePersonTexture = PIXI.Texture.fromImage('assets/img/person_blue.png');
bluePersonTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const incubator = PIXI.Texture.fromImage('assets/img/incubator-winners.jpeg');

const xIcon = PIXI.Texture.fromImage('assets/img/x-icon.png');

const beltTexture = PIXI.Texture.fromImage('assets/img/conveyor_belt.png');
beltTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

const cvTexture = PIXI.Texture.fromImage('assets/img/cv_yellow.png');
cvTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;


export {cvTexture, SPRITES, loadAssets, yellowPersonTexture, bluePersonTexture, incubator, xIcon, beltTexture};

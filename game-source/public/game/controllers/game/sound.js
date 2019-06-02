import {Howl, Howler} from 'howler';
import {SOUNDS} from '../constants';

const SOUNDS_DIR = './assets/sound';
let soundMuted = false;

const {
    MANUAL_AMBIENT,
} = SOUNDS;

const soundsList = [
    {
        name: MANUAL_AMBIENT,
        path: `${SOUNDS_DIR}/${MANUAL_AMBIENT}.mp3`,
        player: null, 
        loop: true,
        playerID: null,
    },
];

export const init = () => window.addEventListener('click', resumeAudioContext);
export const load = () => Promise.all(soundsList.map((sound) => loadSound(sound.name)));

export const toggleVolume = () => {
    soundMuted = !soundMuted;
    Howler.mute(soundMuted);
};


const resumeAudioContext = () => {
    if (Howler.ctx !== null) {
        Howler.ctx.resume();
    } else {
        throw new Error('we did not find an audio context on Howler');
    }
    window.removeEventListener('click', resumeAudioContext);
};


export const stop = (name) => {
    const {player, playerID} = findSoundByName(name);
    if (player && player.playing(playerID)) {
        player.stop(playerID);
    }
};

export const fadeOut = (name) => {
    console.log(`fade out sound ${name}`);
    const {player, playerID} = findSoundByName(name);
    if (player && player.playing(playerID)) {
        player.fade(1.0, 0.0, 1000, playerID);
        setTimeout(() => player.stop(playerID), 1000);
    }
};


export const play = (name) => {
    const sound = findSoundByName(name);
    const {player} = sound;
    if (player && !player.playing(sound.playerID)) {
        sound.playerID = player.play();
    }
};

export const loadSound = (name) => new Promise((resolve, reject) => {
    const sound = findSoundByName(name);
    if (sound) {
        const player = new Howl({
            src: [sound.path],
            loop: sound.loop,
        });
        player.once('load', function() {
            sound.player = player;
            resolve();
        });
        player.on('loaderror', reject);
    } else {
        throw new Error(`sound ${name} is not in the file list!`);
    }
});


const findSoundByName = (name) => soundsList.find((sound) => sound.name === name);

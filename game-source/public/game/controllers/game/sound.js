import {Howl, Howler} from 'howler';
import {SOUND_MANIFEST, DEBUG_MODE} from '../constants';

let soundMuted = false;

export const init = () => {
    window.addEventListener('click', resumeAudioContext);
};
export const load = () => Promise.all(SOUND_MANIFEST.map((sound) => loadSound(sound.name)));

export const toggleVolume = () => {
    soundMuted = !soundMuted;
    Howler.mute(soundMuted);
};

const resumeAudioContext = () => {
    if (Howler.ctx !== null) {
        Howler.ctx.resume();
        if (DEBUG_MODE) {
            console.log('mute sound so you do not go crazy');
            // Howler.mute(true);
        }
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
    const {player, volume = 1.0, playerID} = findSoundByName(name);
    if (player && player.playing(playerID)) {
        player.fade(volume, 0.0, 1000, playerID);
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
            volume: sound.volume || 1.0,
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


const findSoundByName = (name) => SOUND_MANIFEST.find((sound) => sound.name === name);

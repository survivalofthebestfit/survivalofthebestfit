const SOUNDS_DIR = './assets/sound';

export const SOUNDS = {
    MANUAL_AMBIENT: 'manual-stage-ambient',
    PERSON_ACCEPTED: 'person-accepted',
};

export const SOUND_MANIFEST = [
    {
        name: SOUNDS.MANUAL_AMBIENT,
        path: `${SOUNDS_DIR}/${SOUNDS.MANUAL_AMBIENT}.mp3`,
        player: null, 
        loop: true,
        playerID: null,
        volume: 0.3,
    },
    {
        name: SOUNDS.PERSON_ACCEPTED,
        path: `${SOUNDS_DIR}/${SOUNDS.PERSON_ACCEPTED}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },
];



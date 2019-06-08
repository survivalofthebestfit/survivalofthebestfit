const SOUNDS_DIR = './assets/sound';

// values should match mp3 files in the assets folder! they should also all be mp3 files
export const SOUNDS = {
    BUTTON_CLICK: 'button-click',
    NEW_MESSAGE: 'new-message',
    WRITING_MESSAGE: 'writing-message',
    MANUAL_AMBIENT: 'manual-stage-ambient',
    TIME_RUNNING_OUT: 'time-running-out',
    PERSON_ACCEPTED: 'person-accepted',
    STAGE_BEGIN: 'stage-begin',
    STAGE_SUCCEEDED: 'stage-succeeded',
    STAGE_FAILED: 'stage-failed',
    TRAIN_ALGORITHM: 'train-algorithm',
    TRAINING_UPDATE: 'training-update',
    ML_LAB_AMBIENT: 'ml-lab-ambient',
};

export const SOUND_MANIFEST = [
    {
        name: SOUNDS.TRAIN_ALGORITHM,
        path: `${SOUNDS_DIR}/${SOUNDS.TRAIN_ALGORITHM}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 0.8,
    },
    {
        name: SOUNDS.TRAINING_UPDATE,
        path: `${SOUNDS_DIR}/${SOUNDS.TRAINING_UPDATE}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 0.5,
    },
    {
        name: SOUNDS.BUTTON_CLICK,
        path: `${SOUNDS_DIR}/${SOUNDS.BUTTON_CLICK}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },
    {
        name: SOUNDS.WRITING_MESSAGE,
        path: `${SOUNDS_DIR}/${SOUNDS.WRITING_MESSAGE}.mp3`,
        player: null, 
        loop: true,
        playerID: null,
        volume: 0.3,
    },
    {
        name: SOUNDS.NEW_MESSAGE,
        path: `${SOUNDS_DIR}/${SOUNDS.NEW_MESSAGE}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },
    {
        name: SOUNDS.MANUAL_AMBIENT,
        path: `${SOUNDS_DIR}/${SOUNDS.MANUAL_AMBIENT}.mp3`,
        player: null, 
        loop: true,
        playerID: null,
        volume: 0.5,
    },
    {
        name: SOUNDS.ML_LAB_AMBIENT,
        path: `${SOUNDS_DIR}/${SOUNDS.ML_LAB_AMBIENT}.mp3`,
        player: null, 
        loop: true,
        playerID: null,
        volume: 1,
    },
    {
        name: SOUNDS.TIME_RUNNING_OUT,
        path: `${SOUNDS_DIR}/${SOUNDS.TIME_RUNNING_OUT}.mp3`,
        player: null, 
        loop: true,
        playerID: null,
        volume: 1.0,
    },
    {
        name: SOUNDS.PERSON_ACCEPTED,
        path: `${SOUNDS_DIR}/${SOUNDS.PERSON_ACCEPTED}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },
    {
        name: SOUNDS.STAGE_BEGIN,
        path: `${SOUNDS_DIR}/${SOUNDS.STAGE_BEGIN}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },
    {
        name: SOUNDS.STAGE_FAILED,
        path: `${SOUNDS_DIR}/${SOUNDS.STAGE_FAILED}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },
    {
        name: SOUNDS.STAGE_SUCCEEDED,
        path: `${SOUNDS_DIR}/${SOUNDS.STAGE_SUCCEEDED}.mp3`,
        player: null, 
        loop: false,
        playerID: null,
        volume: 1.0,
    },

];



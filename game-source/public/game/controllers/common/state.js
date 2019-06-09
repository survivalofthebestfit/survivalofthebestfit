const store = {
    'big-tech-company': String('BIG COMPANY'),
    'hiring-stage-number': Number(0),
    'hiring-in-progress': Boolean(false),
    'hiring-stage-success': Boolean(false),
    'stage': String('pregame'),
};


export const set = (prop, value) => {
    if (store.hasOwnProperty(prop)) {
        console.log(`update property ${prop} with value: ${value}`);
        store[prop] = value; 
    } else {
        console.warn(`State property ${prop} is invalid`);
    }
};


export const get = (prop) => {
    if (store.hasOwnProperty(prop)) {
        return store[prop];
    } else {
        console.warn(`State property ${prop} is invalid`);
    }
};

const store = {
    'big-tech-company': 'BIG COMPANY',
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

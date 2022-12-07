import { mergeWith } from 'lodash';

function customMerge(a, b) {
    if (b instanceof Array) {
        return b;
    }
    return undefined;
}

function merge(...args) {
    return mergeWith(...args, customMerge);
}

export {
    merge,
};

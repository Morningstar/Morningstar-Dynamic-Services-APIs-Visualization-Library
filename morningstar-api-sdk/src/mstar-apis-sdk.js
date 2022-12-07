import { get, set } from 'lodash';
import ApisSdk from './apis-sdk/apis-sdk';

export default {
    initialize() {
        if (!get(window, 'mstarApisSdk')) {
            set(window, 'mstarApisSdk', new ApisSdk());
        }
    },
};

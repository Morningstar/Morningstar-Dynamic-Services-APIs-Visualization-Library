import dataSources from '../helpers/apis.json';
import hostNames from './host-names.json';

/**
 * Check we have the required parameters
 * @param {object} params - object with values
 * @param {array} requiredParams - array of required parameter names
 */
function checkParams(params, requiredParams) {
    const missingParams = [];
    requiredParams.forEach((requiredParam) => {
        if (params[requiredParam] == null) {
            missingParams.push(requiredParam);
        }
    });
    if (missingParams.length > 0) {
        throw new Error(`Missing parameters - ${missingParams.join(', ')}`);
    }
    return true;
}

/**
 * Replace tokens in the string with matching properties in the object
 * @param {string} - string with tokens in format {{tokenName}}
 * @param {object} - object with values to replace tokens
 */
function replaceParams(str, parameters) {
    let newStr = str;
    Object.keys(parameters).forEach((key) => {
        newStr = newStr.replace(`{{${key}}}`, encodeURIComponent(parameters[key]));
    });
    newStr = newStr.replace(/{{\w*}}/gi, '');
    return newStr;
}

function getUrlTemplate(dataSourceId, sourceApi = 'intl') {
    return dataSources[dataSourceId][sourceApi].url;
}

/**
 * Generate dynamic hostname based on the sourceApi and environment parameters
 * @param {string} environment
 * @param {string} sourceApi
 */
function getHostName(environment, sourceApi='intl') {
    environment = (environment || 'prod').toLowerCase();
    let hostName;
    if (hostNames[sourceApi]) {
        hostName = hostNames[sourceApi][environment];
    }
    return hostName;
}

export {
    checkParams,
    getHostName,
    getUrlTemplate,
    replaceParams,
};
import { merge } from "../helpers/utils";
import { getHostName, getUrlTemplate, replaceParams } from "../helpers/api-helper";

export default class BaseClass {
    constructor(apiNamespace, dataAccess) {
        this._apiNamespace = apiNamespace;
        this._envParams = {};
        this.dataAccess = dataAccess;
    }

    changeEnvironment(newParams) {
        this._envParams = merge(this._envParams || {}, newParams);
        return this; // for chaining
    }

    getEnvironmentParams() {
        return this._envParams;
    }

    getApiParams(paramValues = {}, defaultValues = {}) {
        return merge({}, this._envParams, defaultValues, paramValues);
    }

    getApiUrl(dataSourceId, sourceApi, paramValues, defaultValues = {}) {
        let parameterizedUrl = getUrlTemplate(dataSourceId, sourceApi)
        let apiParams = this.getApiParams(paramValues, defaultValues);
        apiParams.hostName = getHostName(apiParams.environment, sourceApi);

        switch (typeof(apiParams)) {
            case 'object':
                parameterizedUrl = replaceParams(parameterizedUrl, apiParams);
                break;
            case 'string':
            case 'number':
                //TODO: check if we can implement logic to take this string/numeric param as the 1st querystring param of url
                throw 'Unsupported param type';
                break;
        }
        //CHANGE: Create and return request object along with Authn token set, instead of string url
        return parameterizedUrl;
    }

    getApiResponse(fetchParams) {
        return this.dataAccess.fetch(fetchParams);
    }
}
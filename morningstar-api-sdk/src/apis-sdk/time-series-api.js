import BaseClass from "./base-class";

export default class timeSeriesApi extends BaseClass {
    constructor(dataAccess) {
        super('timeSeries', dataAccess);
    }

    /**
     * Fetches data of an investment
     * @param {string} [parameters.method=growth] - A number of methods are pre-defined and can be queried by the API
     * @param {string} securityId - Unique identifier of a security. Multiple values must be pipe-delimited
     * @param {object} [parameters] - Configurable parameters of the timeseries API that you might want to change
     * @param {string} [parameters.idType=msid] - The type of identifier passed as securityId
     * @param {string} [parameters.frequency=monthly] - Time series frequency of data
     * @param {string} [parameters.startDate] - Start date of the series in `yyyy-mm-dd` format
     * @returns {array} An array containing an object that holds all available data for the passed securityIds
     */

    getIntlTimeseriesData(securityId, parameters) {
        const url = this.getApiUrl(this._apiNamespace, 'intl', parameters, {
            method: 'growth',
            idType: 'MSID',
            frequency: 'monthly',
            securityId,
            startDate: '2011-01-31'
        });
        return this.getApiResponse({ url });
    }
}
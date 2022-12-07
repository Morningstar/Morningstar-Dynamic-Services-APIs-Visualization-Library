import BaseClass from "./base-class";

export default class investmentCompareApi extends BaseClass {
    constructor(dataAccess) {
        super('investmentCompare', dataAccess);
    }

    /**
     * Fetches data of comparable investments
     * @param {string} securityIds - Unique identifier of the multiple securities/investments that you need data to compare
     * @param {object} [parameters] - Configurable parameters of the security-details API that you might want to change
     * @param {string} [parameters.idType=msid] - The type of identifier passed as securityId
     * @param {string} [parameters.viewId=CompareAdditional] - The IWT Admin view defined for the client that lists the data-points to be returned when this API is called
     * @returns {array} An array containing an object that holds all available data for the passed securityIds from the list of data-points defined in the view
     */

    getIntlCompareSecurities(securityIds, parameters) {
        const url = this.getApiUrl(this._apiNamespace, 'intl', parameters, {
            idType: 'MSID',
            securityIds,
            viewId: 'CompareAdditional',
        });
        return this.getApiResponse({ url });
    }
}
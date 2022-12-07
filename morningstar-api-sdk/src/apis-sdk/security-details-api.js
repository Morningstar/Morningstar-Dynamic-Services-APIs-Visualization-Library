import BaseClass from "./base-class";

export default class SecurityDetailsApi extends BaseClass {
    constructor(dataAccess) {
        super('securityDetails', dataAccess);
    }

    /**
     * Fetches data of an investment
     * @param {string} securityId - Unique identifier of the security/investment that you need data for
     * @param {object} [parameters] - Configurable parameters of the security-details API that you might want to change
     * @param {string} [parameters.idType=msid] - The type of identifier passed as securityId
     * @param {string} [parameters.viewId=snapshot] - The IWT Admin view defined for the client that lists the data-points to be returned when this API is called
     * @returns {array} An array containing an object that holds all available data for the passed securityId from the list of data-points defined in the view
     */
    getSecurity(securityId, parameters) {
        const url = this.getApiUrl(this._apiNamespace, 'intl', parameters, {
            idType: 'msid',
            securityId,
            viewId: 'snapshot',
        });
        return this.getApiResponse({ url });
    }

    /**
     * Fetches Risk and Rating data of an investment
     * @param {string} securityId - Unique identifier of the security/investment that you need data for
     * @param {object} [parameters] - Configurable parameters of the security-details API that you might want to change
     * @param {string} [parameters.idType=msid] - The type of identifier passed as securityId
     * @param {string} [parameters.viewId=MFsnapshot] - The IWT Admin view defined for the client that lists the data-points to be returned when this API is called
     * @returns {array} An array containing an object that holds all available data for the passed securityId from the list of data-points defined in the view
     */
    getSecurityDetails(securityId, parameters = {}) {
        parameters.viewId = parameters.viewId || 'MFsnapshot';
        return this.getSecurity(securityId, parameters);
    }
}
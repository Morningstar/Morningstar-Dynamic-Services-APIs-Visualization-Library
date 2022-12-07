import BaseClass from "./base-class";

export default class ScreenerApi extends BaseClass {
    constructor(dataAccess) {
        super('screener', dataAccess);
    }

    /**
     * Fetches a list of securities that matches the term passed. To be used in components like autocomplete.
     * @param {string} term - The search string typed in by user to look up for a security
     * @param {object} [parameters] - Configurable parameters of the screener API that you might want to change.
     * @param {string} [parameters.filterValues=''] - Screening filters to reduce the set of securities to be searched
     * @param {number} [parameters.pageSize=100] - Number of results to be returned in one request
     * @param {number} [parameters.page=1] - Page/request number in case total number of records that match search criteria are more than the pageSize
     * @param {string} [parameters.securityDataPoints] - Comma separated list of data-points to be returned for each security that matches the search criteria
     * @param {string} [parameters.sortField] - The data-point on whose basis the search results are to be sorted
     * @param {string} [parameters.sortOrder] - The order in which the search results are to be sorted - 'asc' for ascending, 'dsc' for descending
     * @param {array} [parameters.universeIds] - A list of universe IDs to search the securities within
     * @returns {array} A list of objects containing data of securities that match the search criteria
     */
    searchSecurities(term, parameters) {
        const url = this.getApiUrl(this._apiNamespace, 'intl', parameters, {
            page: 1,
            pageSize: 100,
            sortField: 'Name',
            sortOrder: 'asc',
            universeIds: [],
            securityDataPoints: 'secId,tenforeId,name,investmentType,holdingTypeId,universe'.split(','),
            filterValues: '',
            term,
        });
        return this.getApiResponse({
            credentials: 'same-origin',
            method: 'GET',
            url,
        });
    }

    getIntlFiltersData(parameters) {
        const url = this.getApiUrl('filters', 'intl', parameters, {
            universeIds: [],
            filterDataPoints: 'brandingCompanyId',
            filterValues: '',
        });
        return this.getApiResponse({
            credentials: 'same-origin',
            method: 'GET',
            url,
        });
    }

    getIntlScreenerData(parameters) {
        const url = this.getApiUrl(this._apiNamespace, 'intl', JSON.parse(parameters), {
            page: 1,
            pageSize: 10,
            sortField: 'Name',
            sortOrder: 'asc',
            universeIds: [],
            securityDataPoints: 'secId,tenforeId,name,closePrice,yield_M12,ongoingCharge,starRatingM255,gbrReturnD1,gbrReturnW1,gbrReturnM1,gbrReturnM3,gbrReturnM6,investmentType,holdingTypeId,universe',
            filterValues: '',
            term: '',
        });
        return this.getApiResponse({
            credentials: 'same-origin',
            method: 'GET',
            url,
        });
    }
}
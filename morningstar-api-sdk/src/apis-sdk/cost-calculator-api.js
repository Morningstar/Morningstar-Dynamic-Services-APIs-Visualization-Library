import BaseClass from "./base-class";

export default class CostCalculatorApi extends BaseClass {
    constructor(dataAccess) {
        super('costCalculator', dataAccess);
    }

    getCostCalculation(parameters) {
        const apiParams = this.getApiParams(parameters, {
            growthRatePercent: 5.0,
            yearsToCalculate: 5,
        });
        const url = this.getApiUrl(this._apiNamespace, 'intl', apiParams);
        const body = JSON.stringify({
            growthRatePercent: apiParams.growthRatePercent,
            portfolios: apiParams.portfolios,
            yearsToCalculate: apiParams.yearsToCalculate,
        });
        return this.getApiResponse({
            body,
            headers: {
                'content-type': 'text/plain',
            },
            method: 'POST',
            url,
        });
    }
}
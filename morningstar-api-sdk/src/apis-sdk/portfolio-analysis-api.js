import BaseClass from './base-class';

export default class PortfolioAnalysisApi extends BaseClass {
    constructor(dataAccess) {
        super('portfolioAnalysis', dataAccess);
    }

    getRiskScore(parameters) {
        const apiParams = this.getApiParams(parameters, { apiEndPoint: 'riskScore' });
        const url = this.getApiUrl(this._apiNamespace, 'na', apiParams);
        const body = JSON.stringify({ portfolios: apiParams.portfolios });
        return this.getApiResponse({
            body,
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            responseType: 'application/json',
            url,
        });
    }

    getEsgPerformance(parameters) {
        const apiParams = this.getApiParams(parameters, { apiEndPoint: 'esg' });
        const url = this.getApiUrl(this._apiNamespace, 'na', apiParams);
        const body = JSON.stringify({ portfolios: apiParams.portfolios });
        return this.getApiResponse({
            body,
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            responseType: 'application/json',
            url,
        });
    }

    getEsgPerformanceIntlData(parameters) {
        const apiParams = this.getApiParams(parameters, { apiEndPoint: 'esg' });
        const url = this.getApiUrl(this._apiNamespace, 'intl', apiParams);
        const body = JSON.stringify({ portfolios: apiParams.portfolios });
        return this.getApiResponse({
            body,
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            responseType: 'application/json',
            url,
        });
    }

    getHypotheticalPerformance(parameters) {
        let apiParams = this.getApiParams(parameters, {
            apiEndPoint: 'hypo',
            view: {
                Id: 'Growth',
            },
            requestSettings: {
                OutputReturnsFrequency: 'Monthly',
                AssetClassGroupConfigs: {
                    AssetClassGroupConfig: [
                        {
                            Id: 'ACG-USBROAD'
                        }
                    ]
                },
                HypoCalculationSettings: {
                    HypoType: 'Portfolio',
                    FilingStatus: 'NoTaxes',
                    TaxableIncome: 50000,
                    PayTaxes: 'OutOfPocket',
                    FederalIncomeTaxRate: 0,
                    CapitalGainTaxRate: 0,
                    StateIncomeTaxRate: 0,
                    DividendTaxRate: 0,
                    IllustrationTrailingTimePeriod: 'EarliestCommon',
                    StartDate: '1998-12-31T00:00:00.000Z',
                    EndDate: '2008-12-31T00:00:00.000Z',
                    SynchronizePortfolioStartDate: true,
                    InvestmentDetailReturnsFrequency: 'Monthly',
                    LiquidateOnEndDate: true,
                    SubsequentInvestmentType: 'Invest',
                    SubsequentInvestmentAmount: 0,
                    SubsequentInvestmentWithdrawalFrequency: 'Monthly',
                    AssetBasedAnnualFee: 0,
                    AssetFeeFrequency: 'Annually',
                    AssetFeeType: 'Amount',
                    PayFees: 'OutOfPocketBeginning',
                    PayFeesUseCashFirst: true,
                    FrontLoadType: 'Standard',
                    CustomFeeType: 'Amount',
                    SalesFeeAmount: 0,
                    ApplySalesCharge: true,
                    ApplyFeeForRebalance: false,
                    EntryExitFeeType: 'CustomEntry',
                    RebalanceFrequency: 'None',
                    RebalanceThreshold: 0,
                    ReinvestDividends: true,
                    ReinvestCapitalGains: true,
                    PortfolioAmountFee: 1000
                }
            },
        });
        apiParams = this.getApiParams(apiParams, {
            requestSettings: {
                OutputCurrency: apiParams.currencyId,
            },
        });
        const url = this.getApiUrl(this._apiNamespace, 'na', apiParams);
        const body = JSON.stringify({
            portfolios: apiParams.portfolios,
            requestSettings: apiParams.requestSettings,
            view: apiParams.view,
        });
        return this.getApiResponse({
            body,
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            responseType: 'application/json',
            url,
        });
    }

    getRegulatoryData(parameters) {
        const url = this.getApiUrl(this._apiNamespace, 'na', parameters, { apiEndPoint: 'esg/eusfdr' });
        const body = JSON.stringify({
            portfolios: parameters.portfolios,
        });
        return this.getApiResponse({
            body,
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            url,
        });
    }

    getIdrPdf(securities, parameters) {
        const apiParams = this.getApiParams(parameters, {
            apiEndPoint: 'IDR',
            contentDispositionHeaderValue: 'attachment',
            securities,
        });
        let url = new URL(this.getApiUrl(this._apiNamespace, 'na', apiParams));
        ['securities', 'currencyId', 'contentDispositionHeaderValue'].forEach(queryParam => {
            url.searchParams.append(queryParam, apiParams[queryParam]);
        });
        url = url.toString();
        return this.getApiResponse({ url });
    }
}

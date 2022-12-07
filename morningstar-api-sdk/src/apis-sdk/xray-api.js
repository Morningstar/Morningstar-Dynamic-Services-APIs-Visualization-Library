import BaseClass from "./base-class";
import { getIwtPortfolio } from '../helpers/xray-helper';

export default class XrayApi extends BaseClass {
    constructor(dataAccess) {
        super('xray', dataAccess);
    }

    getAssetAllocationBreakdown(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown',
            cashHoldingIdentifier: 'CASH000000',
            cashHoldingTypeId: 1,
            cashSecurityType: 'C0',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,AssetAllocationMorningstarEUR3',
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId, {
            cashHoldingIdentifier: apiParams.cashHoldingIdentifier,
            cashHoldingTypeId: apiParams.cashHoldingTypeId,
            cashSecurityType: apiParams.cashSecurityType,
        })));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getFixedIncomeCountryData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,CountryExposure'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getFixedIncomeSectorsData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,GlobalBondSector'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getFeesExpensesData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,ongoingCharge,managementFee'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getFixedIncomeSectorsUsData(parameters) {
        return this.getXrayUsData(parameters)
            .then(data => data.XRay[0].Analysis.FixedIncomeAnalysis.FixedIncomeSectors)
            .catch(err => {throw new Error(err)})
    }

    getTrailingReturnsData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            portfolioDataPoints: 'PerformanceReturn|M0|M1|M2|M3|M6|M12|M36|M60|M120',
            benchmarkDataPoints: 'PerformanceReturn|M0|M1|M2|M3|M6|M12|M36|M60|M120'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getPerformanceGraphData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown,HistoricalPerformanceSeries',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,BenchmarkName,HistoricalPerformanceSeries|TotalReturn',
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getPerformanceGraphUsData(parameters) {
        return this.getXrayUsData(parameters)
                    .then(data => ({
                        performanceData: data.XRay[0].Returns.InvestmentActivity,
                        securityReference: data.SecurityReference,
                    }))
                    .catch(err => {throw new Error(err)})
    }

    getSrri(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: '',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,SRRI|W|W260'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getStockStatsData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown,',
            holdingDataPoints: '',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,prospectiveEarningsYield,prospectiveBookValueYield,prospectiveRevenueYield,prospectiveCashFlowYield,'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getStockStatsUsData(parameters) {
        return this.getXrayUsData(parameters)
                    .then(data => ({
                        priceRatios: data.XRay[0].Analysis.EquityAnalysis.PriceRatios,
                        profitability: data.XRay[0].Analysis.EquityAnalysis.Profitability
                    }))
                    .catch(err => {throw new Error(err)})
    }

    getStockSectorsData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,GlobalStockSector',
            holdingDataPoints: '',
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown',
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getXrayUsData(parameters) {
        let apiParams = this.getApiParams(parameters, {
            view: {
                Id: 'XrayOverview',
            },
            config: {
                Id: "Default"
            },
            requestSettings: {
                OutputCurrency: parameters.currencyId || 'USD',
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

    getRiskStatisticsData(parameters) {
        return this.getXrayUsData(parameters)
            .then(data => data["XRay"][0].Risks)
            .catch(err => {throw new Error(err)})
    }

    getStockTypeData(parameters) {
        return this.getXrayUsData(parameters)
            .then(data => data["XRay"][0].Analysis.EquityAnalysis.EquityTypeBreakdown)
            .catch(err => {throw new Error(err)})
    }

    getFeesExpensesUsData(parameters) {
        return this.getXrayUsData(parameters)
                    .then(data => data["XRay"][0].Statistics.FundStatistics.Portfolio)
                    .catch(err => {throw new Error(err)})
    }

    getStockRegionsUsData(parameters) {
        return this.getXrayUsData(parameters)
                    .then(data => data["XRay"][0].Analysis.EquityAnalysis.WorldRegions)
                    .catch(err => {throw new Error(err)})
    }

    getStockRegionsData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            portfolioDataPoints: 'RegionalExposure',
            holdingDataPoints: '',
            benchmarkDataPoints: 'ShowBreakdown'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getPortfolioHoldingsData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,UnderlyingHolding|200|HoldingId|SecurityId|SecurityType|Name|MarketValue|Weight|Sector|SectorId|GlobalSectorId|ISIN|CountryId|Country|CurrencyId|CurrencyName|Symbol,HoldingOverlap',
            holdingDataPoints: 'UseMongoSecurities,RunInThread,HoldingId,SecurityId,Symbol,SectorName,SecurityType,HoldingType,UniverseId,Name,ISIN,PortfolioDate,InitialAmount,InitialWeight,MarketValue,Weight,CurrencyId,StarRatingM255,MorningstarRiskM255,AnalystRatingScale,ShowRiskMeasure,OngoingCharge,FundShareClassId,ReturnM12,ReturnM36,ReturnM60,ReturnM120,ContributionReturn,Units,ExchangeCode',
            benchmarkDataPoints: '',
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getPortfolioHoldingsUsData(parameters) {
        return this.getXrayUsData(parameters)
                    .then(data => ({
                        holdings: data["XRay"][0].Holdings,
                        securityReference: data.SecurityReference,
                    }))
                    .catch(err => {throw new Error(err)})
    }

    getTrailingReturnsUsData(parameters) {
        return this.getXrayUsData(parameters)
            .then(data => data["XRay"][0].Returns.TrailingReturns)
            .catch(err => {throw new Error(err)})
    }

    getStockSectorsUsData(parameters) {
        return this.getXrayUsData(parameters)
            .then(data => data["XRay"][0].Analysis.EquityAnalysis.EquitySectors.EquitySector[0])
            .catch(err => {throw new Error(err)})
    }

    getAssetAllocationUsData(parameters) {
        return this.getXrayUsData(parameters)
            .then(data => data["XRay"][0].Analysis.AssetAllocation[0])
            .catch(err => {throw new Error(err)})
    }

    getXrayIntlData(parameters) {
        const apiParams = this.getApiParams(parameters, {
            benchmarkDataPoints: 'UseMongoSecurities,RunInThread,ShowBreakdown,HistoricalPerformanceSeries,PerformanceReturn|M0|M1|M2|M3|M6|M12|M36|M60|M120',
            holdingDataPoints: 'UseMongoSecurities,RunInThread,HoldingId,SecurityId,Symbol,SectorName,SecurityType,HoldingType,UniverseId,Name,ISIN,PortfolioDate,InitialAmount,InitialWeight,MarketValue,Weight,CurrencyId,StarRatingM255,MorningstarRiskM255,AnalystRatingScale,ShowRiskMeasure,OngoingCharge,FundShareClassId,ReturnM12,ReturnM36,ReturnM60,ReturnM120,ContributionReturn,Units,ExchangeCode',
            portfolioDataPoints: 'UseMongoSecurities,RunInThread,BenchmarkId,BenchmarkName,AssetAllocationMorningstarEUR3,RegionalExposure,GlobalStockSector,HistoricalPerformanceSeries|TotalReturn,StyleBox,BondStyleBox,EffectiveDuration,EffectiveMaturity,AverageCreditQuality,CreditQuality,YieldToMaturity,CountryExposure,GlobalBondSector,MarketCapital,ProspectiveEarningsYield,ProspectiveBookValueYield,ProspectiveCashFlowYield,ProspectiveRevenueYield,ManagementFee,ActualManagementFee,OngoingCharge,PerformanceReturn|M0|M1|M2|M3|M6|M12|M36|M60|M120,UnderlyingHolding|200|HoldingId|SecurityId|SecurityType|Name|MarketValue|Weight|Sector|SectorId|GlobalSectorId|ISIN|CountryId|Country|CurrencyId|CurrencyName|Symbol,HoldingOverlap,CorrelationMatrix|M12,BestWorstPeriods|M1|M3|M6|M12|M36|M60,PortfolioRiskScore,SRRI|W|W260'
        });
        const body = JSON.stringify(JSON.stringify(getIwtPortfolio(apiParams.portfolios, apiParams.currencyId)));
        return this.getIntlData(apiParams, body)
        .catch(err => {throw new Error(err)})
    }

    getIntlData(apiParams, body) {
        const url = this.getApiUrl(this._apiNamespace, 'intl', apiParams);
        return this.getApiResponse({
            body,
            credentials: 'same-origin',
            headers: {
                'content-Type': 'application/json',
            },
            method: 'POST',
            responseType: 'application/json',
            url,
        });
    }
}

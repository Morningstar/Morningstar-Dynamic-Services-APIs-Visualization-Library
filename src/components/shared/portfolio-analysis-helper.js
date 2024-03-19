import { get } from 'lodash';
import assetAllocationMapping from '@/components/asset-allocation/config/mapping-emea.json';
import stockSectorsMapping from '@/components/stock-sectors/config/mapping.json';
import portfolioHoldingsMapping from '@/components/portfolio-holdings/config/mapping.json';
import stockRegionsMapping from '@/components/stock-regions/config/mapping.json';
import fixedIncomeSectorsMapping from '@/components/fixed-income-sectors/config/mapping.json';

function getComponentData(data, portfolioPath, benchmarkPath) {
    if (!data) {
        return {};
    }
    return {
        portfolio: get(data, portfolioPath, []),
        benchmark: get(data, benchmarkPath, []),
    };
}

function getValues(modelData, salePositionType) {
    const data = modelData?.find(
        (item) => item.salePosition === salePositionType,
    ) || {};
    const { values } = data;
    return values;
}

function transformPerformanceChartData(data) {
    const chartData = [];
    data.forEach((item) => {
        const value = ((item.MarketValue - item.BeginningBalance) / item.BeginningBalance) * 100.0;
        const date = item.EndDate;
        chartData.push([
            date,
            value,
        ]);
    });
    return chartData;
}

function getSecurityDetail(securityReference, securityId) {
    return securityReference.find((item) => item.SecurityId === securityId) || {};
}

function getSecurityBreakdownDetails(componentData, securityReference, portfolioHoldings) {
    const breakdown = get(componentData, 'SecurityBreakdown', []);
    return breakdown.map((security) => {
        const currSecurity = security;
        currSecurity.Name = getSecurityDetail(securityReference, currSecurity.SecurityId)?.Name;
        currSecurity.Weight = portfolioHoldings ? getSecurityDetail(
            portfolioHoldings,
            currSecurity.SecurityId,
        )?.PercentAssets : null;
        return currSecurity;
    });
}

function getAssetAllocationData(xrayData) {
    const assetData = getComponentData(
        xrayData,
        'breakdowns.assetAllocation',
        'benchmark[0].breakdowns.assetAllocation',
    );
    const { portfolio, benchmark } = assetData;
    const assetObject = assetAllocationMapping
        .assetAllocation[assetAllocationMapping.default];
    const getParsedData = (data = []) => {
        const long = getValues(data, 'L');
        const net = getValues(data, 'N');
        const short = getValues(data, 'S');
        const results = [];
        Object.keys(assetObject).forEach((item) => {
            results.push({
                key: item,
                long: long[item],
                net: net[item],
                short: short[item],
            });
        });
        return results;
    };

    return {
        portfolio: portfolio ? getParsedData(portfolio) : [],
        benchmark: benchmark ? getParsedData(benchmark) : [],
    };
}

function getCorrelationMatrixData(xRayData) {
    const correlationMatrix={};
    const timePeriodMapping = {
        "M12": "year1",
        "M36": "year3",
        "M60": "year5",
        "M120": "year10",
    }
    xRayData.correlationMatrix.forEach((timePeriod) => {
        const chartData=[];
        timePeriod.correlationMatrixDetail.forEach((correlation, index) => {
            correlation.correlationDetail.forEach((details) => {
                const obj = {};
                obj.x = index + 1;
                obj.y = parseInt(details.id) + 1;
                obj.value = parseFloat(details.correlation) || 0
                chartData.push(obj);
            });
            correlationMatrix[timePeriodMapping[timePeriod.timePeriod]] = chartData;
        });
    });
    return {
        securities: xRayData.holdings.map(s => s.name),
        correlationMatrix
    };
}
function getCorrelationMatrixUsData(xRayData) {
    const correlationMatrix={};
    xRayData.correlationMatrix.forEach((timePeriod) => {
        const chartData=[];
        timePeriod.Correlations.forEach((correlation, index) => {
            correlation.CorrelatedItemKey.forEach((details) => {
                const obj = {};
                obj.SecurityId = correlation.SecurityId,
                obj.x = index + 1;
                obj.y = details.CorrelatedItemKeyId;
                obj.value = parseFloat(details.Value) || 0
                chartData.push(obj);
            });
            correlationMatrix[timePeriod.TrailingTimePeriod] = chartData;
        });
    });
    return {
        securities: xRayData.securities,
        correlationMatrix
    };
}

function getAssetAllocationUsData(assetAllocationData, breakdown = {}) {
    const getParsedData = (reference, data = []) => {
        const assetData = get(data, reference, []);
        return assetData.map((item) => ({
            key: item.Id,
            long: item.Long,
            net: item.Net,
            short: item.Short,
        }));
    };
    const breakdownData = {};
    if (breakdown?.showBreakdown) {
        breakdownData.assetAllocation = assetAllocationData;
        breakdownData.securityBreakdownData = getSecurityBreakdownDetails(
            assetAllocationData,
            breakdown.portfolioSecurityReference,
            breakdown.portfolioHoldings,
        );
    }

    return {
        portfolio: getParsedData('Portfolio', assetAllocationData),
        benchmark: getParsedData('Benchmark', assetAllocationData),
        breakdownData,
    };
}

function getFixedIncomeCountryData(xrayData) {
    const portfolio = get(xrayData, 'breakdowns.countryExposure', [])
        .find((data) => data.type === '2');
    const benchmark = get(xrayData, 'benchmark[0].breakdowns.countryExposure', [])
        .find((data) => data.type === '2');
    return {
        portfolio,
        benchmark,
    };
}

function getFeesExpensesUsData(xrayData, breakdown = {}) {
    const feesExpensesData = get(xrayData, 'XRay[0].Statistics.FundStatistics.Portfolio', {});
    const breakdownData = {};
    if (breakdown?.showBreakdown) {
        const feesExpenses = get(xrayData, 'XRay[0].Statistics.FundStatistics', {});
        breakdownData.securityBreakdownData = getSecurityBreakdownDetails(
            feesExpenses,
            breakdown.portfolioSecurityReference,
            breakdown.portfolioHoldings,
        );
        breakdownData.portfolioAnalyzedPercent = feesExpenses.PortfolioAnalyzed;
    }
    return {
        feesExpensesData,
        breakdownData,
    };
}

function getFixedIncomeSectorsData(xrayData) {
    const portfolioData = get(xrayData, 'breakdowns.globalBondSector[0].values', {});
    const benchmarkData = get(xrayData, 'benchmark[0].breakdowns.globalBondSector[0].values', {});
    const portfolio = {};
    const benchmark = {};
    Object.keys(portfolioData).forEach((sector) => {
        portfolio[fixedIncomeSectorsMapping.fixedIncomeSectors[sector]] = portfolioData[sector];
    });
    Object.keys(benchmarkData).forEach((sector) => {
        benchmark[fixedIncomeSectorsMapping.fixedIncomeSectors[sector]] = benchmarkData[sector];
    });
    return {
        portfolio,
        benchmark,
    };
}

function getFixedIncomeSectorsUsData(xrayData) {
    const portfolioData = get(xrayData, 'Portfolio', []);
    const benchmarkData = get(xrayData, 'Benchmark', []);
    const portfolio = {};
    const benchmark = {};
    portfolioData.forEach((sector) => {
        portfolio[sector.Id] = sector.Value;
    });
    benchmarkData.forEach((sector) => {
        benchmark[sector.Id] = sector.Value;
    });
    return {
        portfolio,
        benchmark,
    };
}

function getPerformanceData(xrayData) {
    const performanceGraphData = getComponentData(
        xrayData,
        'historicalPerformanceSeries',
        'benchmark[0].historicalPerformanceSeries',
    );
    let { portfolio, benchmark } = performanceGraphData;
    portfolio = portfolio?.find((data) => data.timePeriod === 'M1')?.returns;
    benchmark = benchmark?.find((data) => data.timePeriod === 'M1')?.returns;

    return {
        portfolio,
        benchmark,
        benchmarkName: get(xrayData, 'benchmarkName', ''),
    };
}

function getPerformanceUsData(xrayData, portfolio) {
    let benchmarkName;
    if (portfolio[0]?.benchmark?.type !== 'AutoAsset' && portfolio[0]?.benchmark?.type !== 'AutoCategory') {
        const securityId = portfolio[0]?.benchmark?.holdings[0]?.securityId;
        benchmarkName = getSecurityDetail(xrayData.securityReference, securityId)?.Name;
    }
    const parsedPortfolio = get(xrayData, 'performanceData.Portfolio', []);
    const portfolioData = transformPerformanceChartData(parsedPortfolio);
    const parsedBenchmark = get(xrayData, 'performanceData.Benchmark', []);
    const benchmarkData = transformPerformanceChartData(parsedBenchmark);

    return {
        portfolio: portfolioData,
        benchmark: benchmarkData,
        portfolioName: portfolio[0]?.name,
        benchmarkName: benchmarkName || 'Benchmark',
    };
}

function getPortfolioHoldingsData(xrayData) {
    const stockOverlap = get(xrayData, 'holdingOverlap', []);
    const underlyingHoldings = get(xrayData, 'underlyHoldings', []);
    const portfolioHoldings = get(xrayData, 'holdings', []);
    const sectorMapping = portfolioHoldingsMapping.topNetUnderlyingHoldings.sector;
    const holdingOverlap = stockOverlap.map((stockHolding) => {
        const currStockHolding = stockHolding;
        const { globalSectorId, holdingId } = currStockHolding;
        currStockHolding.sectorKey = globalSectorId ? sectorMapping[globalSectorId] : null;
        currStockHolding.symbol = underlyingHoldings
            .find((holding) => holding.holdingId === holdingId)?.symbol || null;
        currStockHolding.parentHoldings = currStockHolding.parentHoldings.map((parentHolding) => {
            const matchHolding = portfolioHoldings.find((holding) => `${holding.holdingId}` === parentHolding.holdingId);
            return { ...matchHolding, ...parentHolding };
        });
        return currStockHolding;
    });
    const preferenceAlignedPercentage = xrayData?.calculatedDataPoints?.[0].portfolioWeight.userPref1;
    return {
        topHoldings: portfolioHoldings,
        topUnderlyingHoldings: underlyingHoldings,
        stockOverlap: holdingOverlap,
        preferenceAlignedPercentage
    };
}

function getPortfolioHoldingsUsData(xrayData) {
    const portfolioHoldings = get(xrayData, 'holdings.PortfolioHoldings.Security', []);
    const stockHoldings = get(xrayData, 'holdings.StockIntersection.Stock', []);
    const topUnderlyingHoldings = get(xrayData, 'holdings.TopNetUnderlyingHoldings.Security', []);
    const topHoldings = portfolioHoldings.map((security) => {
        const secRef = xrayData.securityReference.find((obj) => {
            if (obj.NotClassifiedHoldingId) {
                return obj.NotClassifiedHoldingId === security.NotClassifiedHoldingId;
            }
            return obj.SecurityId === security.SecurityId;
        });
        return { ...secRef, ...security };
    });
    const stockOverlap = stockHoldings.map((holding) => {
        const currentHolding = holding;
        currentHolding.EquitySector = topUnderlyingHoldings.find(
            (obj) => obj.SecurityId === currentHolding.SecurityId,
        )?.EquitySector;
        currentHolding.parentHoldings = currentHolding.SourceOfStock.map((parentHoldings) => {
            const currParentHolding = parentHoldings;
            const secRef = xrayData.securityReference.find((obj) => {
                const holdingData = obj.SecurityId === currParentHolding.SecurityId;
                return holdingData;
            });
            currParentHolding.SecurityName = secRef?.Name;
            currParentHolding.TradingSymbol = secRef?.TradingSymbol;
            return currParentHolding;
        });
        return currentHolding;
    });
    return {
        topHoldings,
        stockOverlap,
    };
}

function getCarbonScoreData(esgData) {
    return getComponentData(
        esgData,
        'portfolio.carbonScore',
        'benchmark.carbonScore',
    );
}

function getProductInvolvementData(esgData) {
    return getComponentData(
        esgData,
        'portfolio.productInvolvement',
        'benchmark.productInvolvement',
    );
}

function getStockSectorsData(xrayData) {
    const sectorTypes = ['cyclical', 'sensitive', 'defensive'];
    const modelData = getComponentData(
        xrayData,
        'breakdowns.globalStockSector[0].values',
        'benchmark[0].breakdowns.globalStockSector[0].values',
    );
    const portfolioData = get(modelData, 'portfolio', {});
    const benchmarkData = get(modelData, 'benchmark', {});

    const portfolio = {};
    const benchmark = {};
    sectorTypes.forEach((sectorType) => {
        const mappingKey = stockSectorsMapping.stockSectors[sectorType];
        Object.keys(mappingKey).forEach((dataKey) => {
            portfolio[mappingKey[dataKey]] = portfolioData[dataKey];
            benchmark[mappingKey[dataKey]] = benchmarkData[dataKey];
        });
    });
    return {
        portfolio,
        benchmark,
    };
}

function getStockSectorsUsData(xrayData, breakdown) {
    const portfolio = xrayData.Portfolio?.reduce((data, currentValue) => {
        const portfolioData = data;
        portfolioData[currentValue.Id] = currentValue.Value;
        return portfolioData;
    }, {});
    const benchmark = xrayData.Benchmark?.reduce((data, currentValue) => {
        const benchmarkData = data;
        benchmarkData[currentValue.Id] = currentValue.Value;
        return benchmarkData;
    }, {});

    const breakdownData = {};
    if (breakdown?.showBreakdown) {
        breakdownData.securityBreakdownData = getSecurityBreakdownDetails(
            xrayData,
            breakdown.portfolioSecurityReference,
            breakdown.portfolioHoldings,
        );
    }

    return {
        portfolio,
        benchmark,
        breakdownData,
    };
}

function getStockStatsData(xrayData) {
    const portfolioData = get(xrayData, 'equityStatistics', {});
    const benchmarkData = get(xrayData, 'benchmark[0].equityStatistics', {});

    const portfolio = {};
    const benchmark = {};

    Object.keys(portfolioData).forEach((item) => {
        portfolio[item] = portfolioData[item].value;
    });
    Object.keys(benchmarkData).forEach((item) => {
        benchmark[item] = benchmarkData[item].value;
    });

    return {
        portfolio,
        benchmark,
    };
}

function getStockStatsUsData(xrayData, breakdown) {
    const portfolio = {
        ...get(xrayData, 'priceRatios.Portfolio', {}),
        ...get(xrayData, 'profitability.Portfolio', {}),
    };
    const benchmark = {
        ...get(xrayData, 'priceRatios.Benchmark', {}),
        ...get(xrayData, 'profitability.Benchmark', {}),
    };

    const breakdownData = {};
    if (breakdown?.showBreakdown) {
        const mergedBreakdown = [];
        Object.keys(xrayData).forEach((item) => {
            const data = get(xrayData, item, []);
            mergedBreakdown.push(...getSecurityBreakdownDetails(
                data,
                breakdown.portfolioSecurityReference,
                breakdown.portfolioHoldings,
            ));
        });
        breakdownData.securityBreakdownData = mergedBreakdown;
    }

    return {
        portfolio,
        benchmark,
        breakdownData,
    };
}

function getStockRegionsParsedData(modelData) {
    const regionValues = getValues(modelData, 'N');
    const mapping = stockRegionsMapping.regions;
    const stockRegionsParsedData = [];
    Object.keys(mapping).forEach((region) => {
        const data = mapping[region];
        const subRegionalModel = {};
        const { keys, subRegions } = data;
        if (regionValues && typeof regionValues[keys[0]] === 'number') {
            subRegionalModel.Value = keys.reduce((sum, key) => sum + regionValues[key], 0);
            subRegionalModel.Id = data.name;
        }
        if (subRegions) {
            subRegionalModel.ExposureItem = [];
            Object.keys(subRegions).forEach((subRegion) => {
                const subRegionObj = {};
                subRegionObj.Value = regionValues ? regionValues[subRegions[subRegion].key] : {};
                subRegionObj.Id = subRegion;
                subRegionalModel.ExposureItem.push(subRegionObj);
            });
        }
        stockRegionsParsedData.push(subRegionalModel);
    });
    return stockRegionsParsedData;
}

function getStockRegionsData(xrayData) {
    const regionData = getComponentData(
        xrayData,
        'breakdowns.regionalExposure',
        'benchmark[0].breakdowns.regionalExposure',
    );
    return {
        portfolio: regionData.portfolio ? getStockRegionsParsedData(regionData.portfolio) : [],
        benchmark: regionData.benchmark ? getStockRegionsParsedData(regionData.benchmark) : [],
    };
}

function getStockRegionsUsData(xrayData, breakdown = {}) {
    const breakdownData = {};
    if (breakdown?.showBreakdown) {
        breakdownData.securityBreakdownData = getSecurityBreakdownDetails(
            xrayData,
            breakdown.portfolioSecurityReference,
            breakdown.portfolioHoldings,
        );
    }
    return {
        ...getComponentData(xrayData, 'Portfolio', 'Benchmark'),
        breakdownData,
    };
}

function getStockTypeUsData(stockTypeData, breakdown = {}) {
    const breakdownData = {};
    if (breakdown.showBreakdown) {
        breakdownData.securityBreakdownData = getSecurityBreakdownDetails(
            stockTypeData,
            breakdown.portfolioSecurityReference,
            breakdown.portfolioHoldings,
        );
    }
    return {
        stockTypeData,
        breakdownData,
    };
}

function getTrailingReturnsData(xrayData) {
    return getComponentData(
        xrayData,
        'trailingPerformance[0].returns',
        'benchmark[0].trailingPerformance[0].returns',
    );
}

function getTrailingReturnsUsData(xrayData) {
    const portfolioData = get(xrayData, 'Portfolio.TimePeriod', []);
    const benchmarkData = get(xrayData, 'Benchmark.TimePeriod', []);
    const portfolio = portfolioData.map((data) => ({
        timePeriod: data.Id,
        value: data.Value,
    }));
    const benchmark = benchmarkData.map((data) => ({
        timePeriod: data.Id,
        value: data.Value,
    }));
    return {
        portfolio,
        benchmark,
    };
}

/**
 * Transformation for APAC/EMEA Xray Component
 * @param {Array} apiData - Accepts an array
 * @param {Object} sections - Configurable sections of the components in xray
 * @returns {Object} Object contains parsed data for all child components
*/
function getXrayData(apiData, sections, portfolio) {
    const modelData = {};
    const xrayData = apiData[0]?.value || null;
    const esgData = apiData[1]?.value || null;
    const riskScoreData = apiData[2]?.value || null;
    const calculateData = apiData[3]?.value || null;
    modelData.portfolioName = portfolio?.name;
    sections.forEach((section) => {
        section.components.forEach((component) => {
            switch (component) {
            case 'assetAllocation': {
                modelData.assetAllocation = getAssetAllocationData(xrayData);
                break;
            }
            case 'feesExpenses': {
                modelData.feesExpenses = {
                    feesExpensesData: calculateData,
                };
                break;
            }
            case 'fixedIncomeSectors': {
                modelData.fixedIncomeSectors = getFixedIncomeSectorsData(xrayData);
                break;
            }
            case 'fixedIncomeCountry': {
                modelData.fixedIncomeCountry = getFixedIncomeCountryData(xrayData);
                break;
            }
            case 'performanceGraph': {
                modelData.performanceGraph = getPerformanceData(xrayData);
                break;
            }
            case 'portfolioHoldings': {
                modelData.portfolioHoldings = getPortfolioHoldingsData(xrayData);
                break;
            }
            case 'portfolioSrri': {
                modelData.portfolioSrri = get(xrayData, 'riskStatistics');
                break;
            }
            case 'carbonScore': {
                modelData.carbonScore = getCarbonScoreData(get(esgData, 'sustainability[0]', {}));
                break;
            }
            case 'productInvolvement': {
                modelData.productInvolvement = getProductInvolvementData(get(esgData, 'sustainability[0]', {}));
                break;
            }
            case 'riskScore': {
                modelData.riskScore = riskScoreData;
                break;
            }
            case 'stockRegions': {
                modelData.stockRegions = getStockRegionsData(xrayData);
                break;
            }
            case 'stockSectors': {
                modelData.stockSectors = getStockSectorsData(xrayData);
                break;
            }
            case 'stockStats': {
                modelData.stockStats = getStockStatsData(xrayData);
                break;
            }
            case 'esgRisk': {
                modelData.sustainability = get(esgData, 'ESG[0].sustainability', {});
                break;
            }
            case 'trailingReturns': {
                modelData.trailingReturns = getTrailingReturnsData(xrayData);
                break;
            }
            default:
                break;
            }
        });
    });
    return modelData;
}

/**
 * Transformation for Americas Xray Component
 * @param {Array} apiData - Accepts an array
 * @param {Object} componentsOptions - Configurable sections of the components in xray
 * @param {Object} portfolio - Portfolios passed to the component
 * @returns {Object} Object contains parsed data for all child components
*/
function getXrayUsData(apiData, componentsOptions, portfolio) {
    const modelData = {};
    const xrayData = apiData[0]?.value || null;
    const esgData = apiData[1]?.value || null;
    const riskScoreData = apiData[2]?.value || null;
    const { showBreakdown } = componentsOptions;
    const securityReference = get(xrayData, 'SecurityReference', []);
    const portfolioSecurityReference = portfolio[0].holdings.map(
        (holding) => getSecurityDetail(securityReference, holding.securityId),
    );

    modelData.invalidSecurities = (() => portfolioSecurityReference
        .filter((security) => (
            (security.SecurityReferenceTypes?.includes('InvalidSecurity')
                || security.SecurityReferenceTypes?.includes('NotEntitled')
                || security.SecurityReferenceTypes?.includes('InactiveSecurity'))
        ))
        .map((security) => security?.Name))();

    const breakdownDetails = {
        portfolioSecurityReference,
        portfolioHoldings: get(xrayData, 'XRay[0].Holdings.PortfolioHoldings.Security', []),
        showBreakdown,
    };
    modelData.portfolioName = portfolio[0]?.name;
    componentsOptions.sections.forEach((section) => {
        section.components.forEach((component) => {
            switch (component) {
            case 'assetAllocation': {
                const assetAllocationData = get(xrayData, 'XRay[0].Analysis.AssetAllocation[0]', {});
                modelData.assetAllocation = getAssetAllocationUsData(
                    assetAllocationData,
                    breakdownDetails,
                );
                break;
            }
            case 'feesExpenses': {
                modelData.feesExpenses = getFeesExpensesUsData(xrayData, breakdownDetails);
                break;
            }
            case 'fixedIncomeSectors': {
                const sectorData = get(xrayData, 'XRay[0].Analysis.FixedIncomeAnalysis.FixedIncomeSectors', {});
                modelData.fixedIncomeSectors = getFixedIncomeSectorsUsData(sectorData);
                break;
            }
            case 'performanceGraph': {
                const performanceGraphData = {
                    performanceData: get(xrayData, 'XRay[0].Returns.InvestmentActivity', {}),
                    securityReference: get(xrayData, 'SecurityReference', []),
                };
                modelData.performanceGraph = getPerformanceUsData(performanceGraphData, portfolio);
                break;
            }
            case 'portfolioHoldings': {
                const portfolioHoldingsData = {
                    holdings: get(xrayData, 'XRay[0].Holdings', {}),
                    securityReference: get(xrayData, 'SecurityReference', []),
                };
                modelData.portfolioHoldings = getPortfolioHoldingsUsData(portfolioHoldingsData);
                break;
            }
            case 'carbonScore': {
                modelData.carbonScore = getCarbonScoreData(get(esgData, 'sustainability[0]', {}));
                break;
            }
            case 'productInvolvement': {
                modelData.productInvolvement = getProductInvolvementData(get(esgData, 'sustainability[0]', {}));
                break;
            }
            case 'riskScore': {
                modelData.riskScore = riskScoreData;
                break;
            }
            case 'riskStatistics': {
                const riskStatisticsData = get(xrayData, 'XRay[0].Risks', {});
                modelData.riskStatistics = riskStatisticsData;
                break;
            }
            case 'stockRegions': {
                const stockRegionsData = get(xrayData, 'XRay[0].Analysis.EquityAnalysis.WorldRegions', {});
                modelData.stockRegions = getStockRegionsUsData(
                    stockRegionsData,
                    breakdownDetails,
                );
                break;
            }
            case 'stockSectors': {
                const stockSectorsData = get(
                    xrayData,
                    'XRay[0].Analysis.EquityAnalysis.EquitySectors.EquitySector[0]',
                    {},
                );
                modelData.stockSectors = getStockSectorsUsData(stockSectorsData, breakdownDetails);
                break;
            }
            case 'stockStats': {
                const stockPath = get(xrayData, 'XRay[0].Analysis', {});
                const stockStatsData = {
                    priceRatios: get(stockPath, 'EquityAnalysis.PriceRatios', []),
                    profitability: get(stockPath, 'EquityAnalysis.Profitability', []),
                    equityStyle: get(stockPath, 'InvestmentStyle.EquityStyle', []),
                    equityStyleBreakdown: get(stockPath, 'InvestmentStyle.EquityStyle.EquityStyleBreakdown', []),
                };
                modelData.stockStats = getStockStatsUsData(stockStatsData, breakdownDetails);
                break;
            }
            case 'stockType': {
                const stockTypeData = get(xrayData, 'XRay[0].Analysis.EquityAnalysis.EquityTypeBreakdown', {});
                modelData.stockType = getStockTypeUsData(
                    stockTypeData,
                    breakdownDetails,
                );
                break;
            }
            case 'esgRisk': {
                modelData.esgRisk = get(esgData, 'sustainability[0]', {});
                break;
            }
            case 'trailingReturns': {
                const trailingReturnsData = get(xrayData, 'XRay[0].Returns.TrailingReturns', {});
                modelData.trailingReturns = getTrailingReturnsUsData(trailingReturnsData);
                break;
            }
            default:
                break;
            }
        });
    });
    return modelData;
}

export default {
    getAssetAllocationData,
    getAssetAllocationUsData,
    getCorrelationMatrixData,
    getCorrelationMatrixUsData,
    getFixedIncomeCountryData,
    getFixedIncomeSectorsData,
    getFixedIncomeSectorsUsData,
    getPerformanceData,
    getPerformanceUsData,
    getPortfolioHoldingsData,
    getPortfolioHoldingsUsData,
    getCarbonScoreData,
    getProductInvolvementData,
    getStockSectorsData,
    getStockSectorsUsData,
    getStockStatsData,
    getStockStatsUsData,
    getStockRegionsData,
    getStockRegionsUsData,
    getStockTypeUsData,
    getTrailingReturnsData,
    getTrailingReturnsUsData,
    getXrayData,
    getXrayUsData,
};

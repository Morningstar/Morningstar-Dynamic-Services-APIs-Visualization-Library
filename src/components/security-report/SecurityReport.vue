<template>
    <div class="security-report">
        <v-row v-if="showHeader">
            <v-col cols="12" class="header-title">
                <h2>Security Fund Report</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div v-for="(section, index) in componentsOptions.sections" :key="index">
                    <v-row v-if="section.title">
                        <v-col class="group-title">
                            <h3>{{ section.title }}</h3>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            sm="12"
                            :md="getCols(component) || section.components.length === 1 ? '12' : '6'"
                            cols="12"
                            class="security-wrapper"
                            v-for="(component, index) in section.components" :key="index">
                                <component
                                    :is="componentMapping[component].type"
                                    :model-data="getModelData(component)"
                                    :show-header="componentMapping[component].showHeader || false"
                                    v-bind="getProps(component)">
                                </component>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <floating-scroll-button></floating-scroll-button>
    </div>
</template>

<script>
import ChartTablePanel from '@/components/shared/ChartTablePanel.vue';
import FundManagement from '@/components/fund-management/FundManagement.vue';
import PerformanceGraph from '@/components/performance-graph/PerformanceGraph.vue';
import Portfolio from '@/components/shared/portfolio/Portfolio.vue';
import RiskRating from '@/components/risk-rating/RiskRating.vue';
import SecurityReportHeader from '@/components/security-report-header/SecurityReportHeader.vue';

import mapping from '@/components/security-report/config/mapping.json';
import stockSectorsMapping from '@/components/stock-sectors/config/mapping.json';
import portfolioHoldingsMapping from '@/components/portfolio-holdings/config/mapping.json';
import assetAllocationMapping from '@/components/asset-allocation/config/mapping-emea.json';
import stockRegionsMapping from '@/components/stock-regions/config/mapping.json';
import {
    get, camelCase, filter, find,
} from 'lodash';

import ComponentMixin from '../component-helper-mixin';
import FloatingScrollButton from '../shared/FloatingScrollButton.vue';

export default {
    mixins: [ComponentMixin],
    components: {
        ChartTablePanel,
        FundManagement,
        PerformanceGraph,
        Portfolio,
        RiskRating,
        FloatingScrollButton,
        SecurityReportHeader,
    },
    props: {
        /** To set components for security report component */
        componentsOptions: {
            type: Object,
            default: () => ({
                sections: [
                    {
                        components: [
                            'securityReportHeader',
                        ],
                    },
                    {
                        title: 'Performance',
                        components: [
                            'performanceGraph',
                            'annualPerformance',
                            'calendarYearReturns',
                            'trailingReturns',
                        ],
                    },
                    {
                        title: 'Portfolio',
                        components: [
                            'portfolio',
                        ],
                    },
                    {
                        title: 'Risk & Rating',
                        components: [
                            'riskRating',
                        ],
                    },
                    {
                        title: 'Fund Management',
                        components: [
                            'fundManagement',
                        ],
                    },
                ],
                props: {
                    performanceGraph: {
                        showTimeSeriesData: false,
                        title: 'Growth of Investment',
                    },
                    annualPerformance: {
                        displays: ['table'],
                        title: 'Annual Performance (%)',
                    },
                    calendarYearReturns: {
                        height: 600,
                        title: 'Calendar Year Returns (%)',
                    },
                    trailingReturns: {
                        height: 360,
                        title: 'Trailing Returns (%)',
                    },
                    portfolio: {
                        componentsOptions: {
                            showSectionHeader: false,
                            sections: [
                                {
                                    section: 'overview',
                                    components: [
                                        'assetAllocation',
                                        'stockRegions',
                                        'stockSectors',
                                        'stockStats',
                                        'portfolioHoldings',
                                    ],
                                },
                            ],
                            props: {
                                portfolioHoldings: {
                                    showTabs: false,
                                    fieldDefinitions: {
                                        topHoldings: [
                                            {
                                                text: 'Security Name',
                                                value: 'securityName',
                                            },
                                            {
                                                text: 'Sector',
                                                value: 'globalSectorId',
                                            },
                                            {
                                                text: 'Country',
                                                value: 'countryId',
                                            },
                                            {
                                                text: '% of Assets',
                                                value: 'weighting',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            }),
        },
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Array, Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            componentMapping: mapping.componentMapping,
            securityReportData: {},
            sectorTypes: ['cyclical', 'sensitive', 'defensive'],
        };
    },
    watch: {
        modelData: {
            handler(newVal) {
                if (newVal) {
                    this.securityReportData.securityDetails = newVal || null;
                    this.securityReportData.performance = this.getPerformance();
                    this.securityReportData.portfolio = this.getPortfolio(
                        this.securityReportData.securityDetails,
                    );
                }
            },
            immediate: true,
        },
    },
    methods: {
        getModelData(option) {
            const { modelPath } = this.componentMapping[option];
            return get(this.securityReportData, modelPath);
        },
        getCols(component) {
            return this.componentMapping[component]?.cols;
        },
        getProps(component) {
            return this.componentsOptions.props ? this.componentsOptions.props[component] : null;
        },
        camelizeKeys(obj) {
            if (Array.isArray(obj)) {
                return obj.map((v) => this.camelizeKeys(v));
            } if (obj !== null && obj.constructor === Object) {
                return Object.keys(obj).reduce(
                    (result, key) => ({
                        ...result,
                        [camelCase(key)]: this.camelizeKeys(obj[key]),
                    }),
                    {},
                );
            }
            return obj;
        },
        getPortfolio() {
            const data = this.securityReportData.securityDetails;
            if (!data) {
                return false;
            }
            const currentSecurityObj = this.camelizeKeys(data[0]);

            return {
                assetAllocation: this.getAssetAllocationData(currentSecurityObj),
                stockRegions: this.getStockRegionsData(currentSecurityObj),
                stockSectors: this.getStockSectorsData(currentSecurityObj),
                stockStats: this.getStockStatsData(currentSecurityObj),
                portfolioHoldings: this.getPortfolioHoldings(currentSecurityObj),
            };
        },
        getAssetAllocationData(data) {
            const portfolio = this.getComponentData(data, 'portfolios[0].assetAllocations');
            const benchmark = this.getComponentData(data, 'portfolios[0].assetAllocations', '', 'PrimaryBenchmark');
            const assetType = assetAllocationMapping.default;
            const assetObject = assetAllocationMapping
                .assetAllocation[assetType];
            const getParsedData = (modelData, type) => {
                const assetData = filter(modelData, (item) => item.type === type);
                const long = this.getFilteredvalues(assetData, 'L');
                const net = this.getFilteredvalues(assetData, 'N');
                const short = this.getFilteredvalues(assetData, 'S');
                const results = [];
                Object.keys(assetObject).forEach((item) => {
                    results.push({
                        key: item,
                        long: filter(long, (arr) => arr.type === item)[0]?.value,
                        net: filter(net, (arr) => arr.type === item)[0]?.value,
                        short: filter(short, (arr) => arr.type === item)[0]?.value,
                    });
                });
                return results;
            };

            return {
                benchmark: getParsedData(benchmark, assetType),
                portfolio: getParsedData(portfolio, assetType),
            };
        },
        getStockRegionsData(data) {
            const portfolioData = this.getComponentData(data, 'portfolios[0].regionalExposure', 'N');
            const benchmarkData = this.getComponentData(data, 'portfolios[0].regionalExposure', 'N', 'PrimaryBenchmark');
            const portfolioValues = this.getValues(portfolioData.breakdownValues);
            const benchmarkValues = this.getValues(benchmarkData.breakdownValues);
            return {
                portfolio: this.getStockRegionsParsedData(portfolioValues),
                benchmark: this.getStockRegionsParsedData(benchmarkValues),
            };
        },
        getStockRegionsParsedData(regionValues = {}) {
            if (Object.keys(regionValues).length) {
                const regionMapping = stockRegionsMapping.regions;
                const stockRegionsParsedData = [];
                Object.keys(regionMapping).forEach((region) => {
                    const data = regionMapping[region];
                    const subRegionalModel = {};
                    const { keys, subRegions } = data;
                    if (typeof regionValues[keys[0]] === 'number') {
                        subRegionalModel.Value = keys
                            .reduce((sum, key) => sum + regionValues[key], 0);
                        subRegionalModel.Id = data.name;
                    }
                    if (subRegions) {
                        subRegionalModel.ExposureItem = [];
                        Object.keys(subRegions).forEach((subRegion) => {
                            const subRegionObj = {};
                            subRegionObj.Value = regionValues[subRegions[subRegion].key];
                            subRegionObj.Id = subRegion;
                            subRegionalModel.ExposureItem.push(subRegionObj);
                        });
                    }
                    stockRegionsParsedData.push(subRegionalModel);
                });
                return stockRegionsParsedData;
            }
            return [];
        },
        getStockSectorsData(data) {
            let portfolioData = this.getComponentData(data, 'portfolios[0].globalStockSectorBreakdown', 'N');
            let benchmarkData = this.getComponentData(data, 'portfolios[0].globalStockSectorBreakdown', 'N', 'PrimaryBenchmark');

            portfolioData = this.getValues(portfolioData.breakdownValues);
            benchmarkData = this.getValues(benchmarkData.breakdownValues);
            const portfolio = {};
            const benchmark = {};
            this.sectorTypes.forEach((sectorType) => {
                const mappingKey = stockSectorsMapping.stockSectors[sectorType];
                Object.keys(mappingKey).forEach((dataKey) => {
                    portfolio[mappingKey[dataKey]] = portfolioData && portfolioData[dataKey];
                    benchmark[mappingKey[dataKey]] = benchmarkData && benchmarkData[dataKey];
                });
            });
            return {
                portfolio,
                benchmark,
            };
        },
        getStockStatsData(data) {
            const portfolio = this.getComponentData(data, 'portfolios[0].equityStatistics');
            const benchmark = this.getComponentData(data, 'benchmark[0].portfolios[0].equityStatistics');

            return {
                portfolio,
                benchmark,
            };
        },
        getPortfolioHoldings(data) {
            const holdingsData = this.getComponentData(data, 'portfolios[0].portfolioHoldings');
            const sectorMapping = portfolioHoldingsMapping.topNetUnderlyingHoldings.sector;
            const portfolioHoldingsData = holdingsData.map((holding) => {
                const currHolding = holding;
                const { globalSectorId } = currHolding;
                currHolding.globalSectorId = globalSectorId ? sectorMapping[globalSectorId] : null;
                return currHolding;
            });
            return {
                topHoldings: portfolioHoldingsData,
            };
        },
        getComponentData(modelData, referenceNode, salePositionType, benchmarkType) {
            let data = modelData;
            if (benchmarkType) {
                data = filter(data.benchmark, (item) => item.type === benchmarkType);
                data = get(data[0], referenceNode, []);
            } else {
                data = get(modelData, referenceNode, []);
            }

            if (salePositionType) {
                data = data.find(
                    (item) => item.salePosition === salePositionType,
                ) || {};
            }
            return data;
        },
        getValues(data) {
            return data?.reduce((acc, obj) => ({ ...acc, [obj.type]: obj.value }), {});
        },
        getFilteredvalues(modelData, salePositionType) {
            const data = modelData.find(
                (item) => item.salePosition === salePositionType,
            ) || {};
            const { breakdownValues } = data;
            return breakdownValues;
        },
        getPerformance() {
            const securityDetails = this.securityReportData.securityDetails[0];
            const benchmarkData = securityDetails.Benchmark.find((benchmark) => benchmark.Type === 'Category');
            return {
                annualPerformance: this.getAnnualPerformance(securityDetails, benchmarkData),
                calendarYearReturns: this.getCalendarYearReturns(securityDetails, benchmarkData),
                performanceGraph: this.getPerformanceChartData(securityDetails, benchmarkData),
                trailingReturns: this.getTrailingReturns(securityDetails, benchmarkData),
            };
        },
        getAnnualPerformance(securityDetails, benchmarkDetails) {
            const filterItem = 'HistoricalPerformanceSeries';
            const filters = {
                Frequency: 'Q',
                ReturnType: 'GbPostTax',
                TimePeriod: 'M12',
            };
            const pickItem = 'Return';
            const labels = [];
            const fundData = [];
            const benchmarkData = [];
            const fundReturns = this
                .getFilteredData(securityDetails, filterItem, filters, pickItem) || [];
            const benchmarkReturns = this
                .getFilteredData(benchmarkDetails, filterItem, filters, pickItem) || [];
            const dates = fundReturns.map((dataItem) => dataItem.Date);
            benchmarkReturns.forEach((dataItem) => {
                if (dates.indexOf(dataItem.Date) === -1) {
                    dates.push(dataItem.Date);
                }
            });
            dates.sort().forEach((date) => {
                const currentDate = new Date(date);
                const lastYearDate = new Date(currentDate.getTime())
                    .setFullYear(currentDate.getFullYear() - 1);
                labels.push(`${this.formatDate(lastYearDate)} - ${this.formatDate(currentDate)}`);
                let returnDataItem = fundReturns.find((dataItem) => dataItem.Date === date) || {};
                fundData.push(returnDataItem.Value);
                returnDataItem = benchmarkReturns.find((dataItem) => dataItem.Date === date) || {};
                benchmarkData.push(returnDataItem.Value);
            });
            return {
                labels,
                datasets: [
                    {
                        label: 'Fund',
                        backgroundColor: '#024A7A',
                        data: fundData,
                    },
                    {
                        label: benchmarkDetails?.Name,
                        backgroundColor: '#1DADE2',
                        data: benchmarkData,
                    },
                ],
            };
        },
        getPerformanceChartData(securityDetails, benchmarkData) {
            return {
                portfolio: this.parseHistoricDetailsData('GrowthOf10K[0]', 'StartValue', 'HistoryDetails', securityDetails),
                portfolioName: securityDetails?.LegalName,
                benchmark: this.parseHistoricDetailsData('GrowthOf10K[0]', 'StartValue', 'HistoryDetails', benchmarkData),
                benchmarkName: benchmarkData?.Name,
            };
        },
        getCalendarYearReturns(securityDetails, benchmarkDetails) {
            let filterItem = 'HistoricalPerformanceSeries';
            let filters = {
                Frequency: 'Y',
                ReturnType: 'GbPostTax',
            };
            const pickItem = 'Return';
            const labels = [];
            const fundData = [];
            const benchmarkData = [];
            let fundReturns = this.getFilteredData(
                securityDetails,
                filterItem,
                filters,
                pickItem,
            ) || [];
            let benchmarkReturns = this.getFilteredData(
                benchmarkDetails,
                filterItem,
                filters,
                pickItem,
            ) || [];
            fundReturns.forEach((dataItem) => {
                labels.unshift(new Date(dataItem.Date).getFullYear());
                fundData.unshift(dataItem.Value);
                const sameDateBenchmarkData = find(benchmarkReturns, { Date: dataItem.Date }) || {};
                benchmarkData.unshift(sameDateBenchmarkData.Value);
            });
            filterItem = 'TrailingPerformance';
            filters = {
                Type: 'DayEnd',
                ReturnType: 'GbPostTax',
            };
            fundReturns = this.getFilteredData(
                securityDetails,
                filterItem,
                filters,
                pickItem,
            ) || [];
            benchmarkReturns = this.getFilteredData(
                benchmarkDetails,
                filterItem,
                filters,
                pickItem,
            ) || [];
            labels.push('YTD');
            let dataItem = find(fundReturns, { TimePeriod: 'M0' }) || {};
            fundData.push(dataItem.Value);
            dataItem = find(benchmarkReturns, { TimePeriod: 'M0' }) || {};
            benchmarkData.push(dataItem.Value);
            return {
                labels,
                datasets: [
                    {
                        label: 'Fund',
                        backgroundColor: '#024A7A',
                        data: fundData,
                    },
                    {
                        label: benchmarkDetails?.Name,
                        backgroundColor: '#1DADE2',
                        data: benchmarkData,
                    },
                ],
            };
        },
        getFilteredData(data, filterItem, filters, pickItem) {
            const filteredData = find(get(data, filterItem, []), filters) || {};
            return filteredData[pickItem];
        },
        getTrailingPerformance(data, filterItem, filters, pickItem, timePeriods) {
            const returns = this.getFilteredData(data, filterItem, filters, pickItem) || [];
            return timePeriods.map((timePeriod) => {
                const returnData = returns
                    .find((dataItem) => dataItem.Annualized && dataItem.TimePeriod === timePeriod)
                    || {};
                return returnData.Value;
            });
        },
        getTrailingReturns(securityDetails, benchmarkDetails) {
            const timePeriods = {
                M1: '1M',
                M3: '3M',
                M6: '6M',
                M12: '1Y(ann)',
                M36: '3Y(ann)',
                M60: '5Y(ann)',
            };
            const filterItem = 'TrailingPerformance';
            const filters = {
                Type: 'DayEnd',
                ReturnType: 'GbPostTax',
            };
            const pickItem = 'Return';
            const timePeriodDataPoints = Object.keys(timePeriods);
            const fundReturns = this.getTrailingPerformance(
                securityDetails,
                filterItem,
                filters,
                pickItem,
                timePeriodDataPoints,
            );
            const benchmarkReturns = this.getTrailingPerformance(
                benchmarkDetails,
                filterItem,
                filters,
                pickItem,
                timePeriodDataPoints,
            );
            return {
                labels: Object.values(timePeriods),
                datasets: [
                    {
                        label: 'Fund',
                        backgroundColor: '#024A7A',
                        data: fundReturns,
                    },
                    {
                        label: benchmarkDetails?.Name,
                        backgroundColor: '#1DADE2',
                        data: benchmarkReturns,
                    },
                ],
            };
        },
        parseHistoricDetailsData(growth10KReference, startValueRef, historicDetailsRef, data = {}) {
            const growth10KData = get(data, growth10KReference, {});
            const rebaseValue = 10000 / get(growth10KData, startValueRef, 10000);
            const timeSeriesData = get(growth10KData, historicDetailsRef, []);
            const timeSeriesDetails = [];

            const details = timeSeriesData.map((item) => [item.EndDate, item.Value * rebaseValue]);
            timeSeriesDetails.push(...details);

            return timeSeriesDetails;
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.security-report {
    .header-title h2 {
        @include mixin.border(mixin.$wal-color-light-grey, bottom, 2px);
        padding: map.get(mixin.$wal, 'space', '1-x') 0;
        font-size: map.get(mixin.$wal, 'font-size', xxl);
    }

    .group-title h3 {
        @include mixin.border(mixin.$wal-color-black, top, 2px);
        font-size: map.get(mixin.$wal, 'font-size', xxl);
        padding: map.get(mixin.$wal, 'space', 'three-quarter-x') 0;
    }

    .portfolio__component {
        border-top: 0;
        padding: 10px;

        .title {
            margin: 0;
            padding: map.get(mixin.$wal, 'space', '1-and-a-quarter-x') 0;
            @include mixin.border(mixin.$wal-color-light-grey, bottom, 1px);

            h2 {
                padding: 0;
                padding-left: map.get(mixin.$wal, 'space', 'three-quarter-x');
            }
        }
    }
}

</style>

import { action } from '@storybook/addon-actions';
import Xray from '@/components/xray/Xray.vue';
import docPageEMEA from '@/components/xray/doc-emea.mdx';
import docPageAmericas from '@/components/xray/doc-americas.mdx';
import helper from '@/stories/stories-helper';
import mapping from '@/components/fixed-income-sectors/config/mapping.json';
import xrayIntlData from '@/components/xray/config/xray-intl-data.json';
import xrayUsData from '@/components/xray/config/xray-us-data.json';
import fieldDefFeesExpenses from '@/components/fees-expenses/config/fieldDefinitionsIntlMifid.json';
import fieldDefFeesExpensesUs from '@/components/fees-expenses/config/fieldDefinitionsUs.json';
import fieldDefPortfolioHoldings from '@/components/portfolio-holdings/config/fieldDefinitions.json';
import stockStatsDataPoints from '@/components/stock-stats/config/dataPoints.json';
import trailingReturnsDataPoints from '@/components/trailing-returns/config/dataPoints.json';
import assetAllocationMappingEmea from '@/components/asset-allocation/config/mapping-emea.json';
import assetMappingsAmericas from '@/components/asset-allocation/config/mapping-americas.json';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';

export default {
    title: 'Tools/X-Ray',
    component: Xray,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        componentsOptions: Object,
        portfolio: Object,
    },
    parameters: {
        docs: {
            page: docPageEMEA,
        },
    },
};

const Template = (args, { argTypes, loaded }) => {
    let response = {};
    if (loaded && Object.keys(loaded).length) {
        response = loaded;
        action('Component loaded')('API Data');
    } else {
        // eslint-disable-next-line no-param-reassign
        args.componentsOptions.props.riskScore.chartId = `${args.componentsOptions.props.riskScore.chartId}-docs`;
        response.modelData = args.modelData;
        action('Component loaded')('Static Data');
    }
    return {
        props: Object.keys(argTypes),
        components: { Xray },
        template: `<xray :model-data='${JSON.stringify(response.modelData)}'
                        :show-header='showHeader'
                        :components-options='componentsOptions'
                        :portfolio='${JSON.stringify(loaded.portfolio)}'/>`,
    };
};

/** ***** Xray (APAC/EMEA) ***** */

const componentsOptions = {
    showSectionHeader: true,
    showBreakdown: false,
    sections: [
        {
            section: 'overview',
            components: [
                'riskScore',
                'assetAllocation',
            ],
        },
        {
            section: 'performance',
            components: [
                'performanceGraph',
                'trailingReturns',
                'feesExpenses',
            ],
        },
        {
            section: 'assetClass',
            components: [
                'stockRegions',
                'stockStats',
                'stockSectors',
                'fixedIncomeSectors',
                'fixedIncomeCountry',
                'portfolioSrri',
            ],
        },
        {
            section: 'sustainability',
            components: [
                'productInvolvement',
                'carbonScore'
            ],
        },
        {
            section: 'holdings',
            components: [
                'portfolioHoldings',
            ],
        },
    ],
    props: {
        assetAllocation: {
            assetAllocationMapping: assetAllocationMappingEmea,
        },
        performanceGraph: {
            showTimeSeriesData: false,
        },
        feesExpenses: {
            fieldDefinitions: fieldDefFeesExpenses,
        },
        riskScore: {
            chartId: 'gauge',
        },
        trailingReturns: {
            chartHeight: 432,
        },
    },
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await Promise.allSettled([
            window.mstarApisSdk.xray.getXrayIntlData({
                portfolios: helper.samplePortfolio,
            }),
            window.mstarApisSdk.portfolioAnalysis.getSustainabilityData({
                portfolios: helper.sampleEsgPortfolio,
            }),
            window.mstarApisSdk.portfolioAnalysis.getRiskScore({
                portfolios: helper.sampleUsPortfolio,
            }),
            window.mstarApisSdk.costCalculator.getCostCalculation({
                portfolios: helper.sampleCostCalculationPortfolio,
            }),
        ])
            .then((apiData) => xrayHelper.getXrayData(
                apiData,
                componentsOptions.sections,
                helper.samplePortfolio,
            )),
        portfolio: helper.samplePortfolio,
    }),
];

StoryDetails.args = {
    modelData: xrayIntlData,
    showHeader: true,
    portfolio: helper.samplePortfolio,
    componentsOptions,
};

/** ***** Xray (Americas) ***** */

const componentsOptionsUs = {
    showSectionHeader: true,
    showBreakdown: true,
    sections: [
        {
            section: 'overview',
            components: [
                'riskScore',
                'assetAllocation',
                'esgRisk',
            ],
        },
        {
            section: 'performance',
            components: [
                'performanceGraph',
                'trailingReturns',
                'feesExpenses',
                'riskStatistics',
            ],
        },
        {
            section: 'assetClass',
            components: [
                'stockRegions',
                'stockStats',
                'stockType',
                'stockSectors',
                'fixedIncomeSectors',
            ],
        },
        {
            section: 'sustainability',
            components: [
                'productInvolvement',
                'carbonScore'
            ],
        },
        {
            section: 'holdings',
            components: [
                'portfolioHoldings',
            ],
        },
    ],
    props: {
        assetAllocation: {
            assetAllocationMapping: assetMappingsAmericas,
        },
        feesExpenses: {
            fieldDefinitions: fieldDefFeesExpensesUs,
        },
        fixedIncomeSectors: {
            dataPoints: mapping.dataPointsUs,
        },
        performanceGraph: {
            portfolio: helper.sampleUsPortfolio,
            showTimeSeriesData: false,
        },
        portfolioHoldings: {
            fieldDefinitions: fieldDefPortfolioHoldings.america,
            tabs: ['topHoldings', 'stockOverlap'],
        },
        riskScore: {
            chartId: 'gauge-us',
        },
        stockStats: {
            dataPoints: stockStatsDataPoints.america,
        },
        trailingReturns: {
            dataPoints: trailingReturnsDataPoints.america,
            chartHeight: 384,
        },
    },
};

export const StoryDetailsUS = Template.bind({});
StoryDetailsUS.storyName = 'Americas';
StoryDetailsUS.parameters = {
    docs: {
        page: docPageAmericas,
    },
};
StoryDetailsUS.loaders = [
    async () => ({
        modelData: await Promise.allSettled([
            window.mstarApisSdk.xray.getXrayUsData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            }),
            window.mstarApisSdk.portfolioAnalysis.getSustainabilityData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            }),
            window.mstarApisSdk.portfolioAnalysis.getRiskScore({
                portfolios: helper.sampleUsPortfolio,
            }),
        ])
            .then((apiData) => xrayHelper
                .getXrayUsData(apiData, componentsOptionsUs, helper.sampleUsPortfolio)),
        portfolio: helper.sampleUsPortfolio,
    }),
];

StoryDetailsUS.args = {
    modelData: xrayUsData,
    showHeader: true,
    portfolio: helper.sampleUsPortfolio,
    componentsOptions: componentsOptionsUs,
};

import StockStats from '@/components/stock-stats/StockStats.vue';
import docPageEMEA from '@/components/stock-stats/doc-emea.mdx';
import docPageAmericas from '@/components/stock-stats/doc-americas.mdx';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import { action } from '@storybook/addon-actions';
import sampleStockStatsData from '@/components/stock-stats/config/sampleStockStatsData.json';
import dataPoints from '@/components/stock-stats/config/dataPoints.json';
import helper from './stories-helper';

export default {
    title: 'Components/Stock Stats',
    component: StockStats,
    argTypes: {
        dataPoints: Object,
        modelData: Object,
        showHeader: Boolean,
    },
    parameters: {
        docs: {
            page: docPageEMEA,
        },
    },
};

const Template = (args, { argTypes, loaded }) => {
    let response = {};
    if (loaded?.modelData) {
        response = loaded;
        action('Component loaded')('API Data');
    } else {
        response.modelData = args.modelData;
        action('Component loaded')('Static Data');
    }
    return {
        props: Object.keys(argTypes),
        components: { StockStats },
        methods: { viewBreakdown: action('ViewBreakdownEvent') },
        template: `<stock-stats :model-data='${JSON.stringify(response.modelData)}'
                                :showHeader='showHeader' :showBreakdown='showBreakdown'
                                :dataPoints='dataPoints'
                                @show-security-level-breakdown='viewBreakdown' />`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';

StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getStockStatsData({ portfolios: helper.samplePortfolio })
            .then((apiData) => xrayHelper.getStockStatsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetails.args = {
    dataPoints: dataPoints.emea,
    modelData: sampleStockStatsData,
    showHeader: true,
    showBreakdown: false,
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
        modelData: await window.mstarApisSdk.xray
            .getStockStatsUsData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            })
            .then((apiData) => xrayHelper.getStockStatsUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    dataPoints: dataPoints.america,
    modelData: sampleStockStatsData,
    showHeader: true,
    showBreakdown: false,
};

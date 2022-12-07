import PerformanceGraph from '@/components/performance-graph/PerformanceGraph.vue';
import sampleData from '@/components/performance-graph/config/samplePerformance.json';
import docPageEMEA from '@/components/performance-graph/docs/doc-growth-chart-emea.mdx';
import docPageAmericas from '@/components/performance-graph/docs/doc-growth-chart-americas.mdx';
import { action } from '@storybook/addon-actions';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import helper from './stories-helper';

export default {
    title: 'Components/Performance Graph Growth of 10K',
    component: PerformanceGraph,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        portfolio: Object,
        showTimeSeriesData: Boolean,
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
        components: { PerformanceGraph },
        template: `<performance-graph :model-data='${JSON.stringify(response.modelData)}'
                        :showHeader='showHeader'
                        :showTimeSeriesData='showTimeSeriesData'
                        :portfolio='${JSON.stringify(loaded.portfolio)}'/>`,
    };
};

/** ***** Growth of 10k chart (APAC/EMEA) ***** */

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getPerformanceGraphData({ portfolios: helper.samplePortfolio })
            .then((ApiData) => xrayHelper.getPerformanceData(ApiData))
            .catch((error) => console.log(error)),
        portfolio: helper.samplePortfolio,
        showTimeSeriesData: false,
    }),
];

StoryDetails.args = {
    modelData: sampleData,
    showHeader: true,
    portfolio: helper.samplePortfolio,
    showTimeSeriesData: false,
};

/** ***** Growth of 10k chart (US) ***** */

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
            .getPerformanceGraphUsData({ portfolios: helper.sampleUsPortfolio, languageId: 'en-US' })
            .then((ApiData) => xrayHelper.getPerformanceUsData(ApiData, helper.sampleUsPortfolio))
            .catch((error) => console.log(error)),
        portfolio: helper.sampleUsPortfolio,
        showTimeSeriesData: false,
    }),
];

StoryDetailsUS.args = {
    modelData: sampleData,
    showHeader: true,
    portfolio: helper.sampleUsPortfolio,
    showTimeSeriesData: false,
};

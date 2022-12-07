import TrailingReturns from '@/components/trailing-returns/TrailingReturns.vue';
import docPageEMEA from '@/components/trailing-returns/doc-emea.mdx';
import docPageAmericas from '@/components/trailing-returns/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import sampleTrailingReturnsData from '@/components/trailing-returns/config/sampleData.json';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import dataPoints from '@/components/trailing-returns/config/dataPoints.json';
import helper from './stories-helper';

export default {
    title: 'Components/Trailing Returns',
    component: TrailingReturns,
    argTypes: {
        dataPoints: Array,
        modelData: Object,
        showHeader: Boolean,
        chartHeight: Number,
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
        components: { TrailingReturns },
        template: `<trailing-returns 
                                    :dataPoints='dataPoints'
                                    :model-data='${JSON.stringify(response.modelData)}'
                                    :showHeader='showHeader'
                                    :chartHeight='${loaded.chartHeight}'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        chartHeight: 432,
        modelData: await window.mstarApisSdk.xray
            .getTrailingReturnsData({ portfolios: helper.samplePortfolio })
            .then((apiData) => xrayHelper.getTrailingReturnsData(apiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    modelData: sampleTrailingReturnsData.emea,
    showHeader: true,
    dataPoints: dataPoints.emea,
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
        chartHeight: 384,
        modelData: await window.mstarApisSdk.xray
            .getTrailingReturnsUsData({ portfolios: helper.sampleUsPortfolio, languageId: 'en-US' })
            .then((ApiData) => xrayHelper.getTrailingReturnsUsData(ApiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetailsUS.args = {
    modelData: sampleTrailingReturnsData.america,
    showHeader: true,
    dataPoints: dataPoints.america,
};

import RiskStatistics from '@/components/risk-statistics/RiskStatistics.vue';
import sampleRiskStatisticsModel from '@/components/risk-statistics/sampleRiskStatisticsModel';
import docPage from '@/components/risk-statistics/doc.mdx';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';

export default {
    title: 'Components/RiskStatistics',
    component: RiskStatistics,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        fieldDefinitions: Array,
    },
    parameters: {
        docs: {
            page: docPage,
        },
    },
};

const modelData = sampleRiskStatisticsModel;
const fieldDefinitions = [
    {
        text: 'Year 1',
        value: 'year1',
    },
    {
        text: 'Year 3',
        value: 'year3',
    },
    {
        text: 'Year 5',
        value: 'year5',
    },
    {
        text: 'Year 10',
        value: 'year10',
    },
];

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
        components: { RiskStatistics },
        template: `<risk-statistics :model-data='${JSON.stringify(response.modelData)}'
                                    :showHeader='showHeader'
                                    :field-definitions='fieldDefinitions'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray.getRiskStatisticsData({ portfolios: helper.sampleUsPortfolio, languageId: 'en-US' })
            .catch((error) => console.log(error)),

    }),
];

StoryDetails.storyName = 'Risk Statistics';
StoryDetails.args = {
    modelData,
    showHeader: true,
    fieldDefinitions,
};

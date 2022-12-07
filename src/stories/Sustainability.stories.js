import Sustainability from '@/components/sustainability/Sustainability.vue';
import sampleSustainabilityData from '@/components/sustainability/config/sampleSustainabilityData.json';
import docPageEMEA from '@/components/sustainability/doc-emea.mdx';
import docPageAmericas from '@/components/sustainability/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';

export default {
    title: 'Components/Sustainability',
    component: Sustainability,
    argTypes: {
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
        components: { Sustainability },
        template: `<sustainability :model-data='${JSON.stringify(response.modelData)}'
                                   :showHeader='showHeader'
                                   :range='range'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.portfolioAnalysis.getEsgPerformanceIntlData(
            { portfolios: helper.sampleEsgPortfolio },
        )
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    modelData: sampleSustainabilityData,
    showHeader: true,
    range: [0, 50],
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
        modelData: await window.mstarApisSdk.portfolioAnalysis.getEsgPerformance({
            portfolios: helper.sampleEsgPortfolio,
            languageId: 'en-US',
        })
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    modelData: sampleSustainabilityData,
    showHeader: true,
    range: [0, 50],
};

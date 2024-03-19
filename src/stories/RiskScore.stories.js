import RiskScore from '@/components/risk-score/RiskScore.vue';
import sampleRiskScoreData from '@/components/risk-score/config/sampleRiskScore.json';
import docPage from '@/components/risk-score/doc.mdx';
import { action } from '@storybook/addon-actions';
import helper from './stories-helper';

export default {
    title: 'Components/RiskScore',
    component: RiskScore,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
    },
    parameters: {
        docs: {
            page: docPage,
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
        components: { RiskScore },
        template: `<risk-score :model-data='${JSON.stringify(response.modelData)}'
                                :showHeader='showHeader'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Risk Score';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.portfolioAnalysis.getRiskScore({
            portfolios: helper.sampleUsPortfolio,
        })
            .catch((error) => console.log(error)),
    }),
];

StoryDetails.args = {
    modelData: sampleRiskScoreData,
    showHeader: true,
};

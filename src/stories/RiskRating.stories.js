import RiskRating from '@/components/risk-rating/RiskRating.vue';
import docPage from '@/components/risk-rating/doc.mdx';
import { action } from '@storybook/addon-actions';
import sampleRiskRatingData from '@/components/risk-rating/config/sampleRiskRatingData.json';

export default {
    title: 'Components/Risk&Rating',
    id: 'components-riskrating',
    component: RiskRating,
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
        components: { RiskRating },
        template: `<risk-rating :model-data='${JSON.stringify(response.modelData)}' :show-header='showHeader' />`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.id = 'components-riskrating--story-details';
StoryDetails.storyName = 'Risk & Rating';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.securityDetails
            .getSecurityDetails('F0GBR050DD').then((apiData) => {
                if (apiData.length) {
                    return [{
                        CollectedSRRI: apiData[0].CollectedSRRI,
                        RiskAndRating: apiData[0].RiskAndRating,
                        RiskStatistics: apiData[0].RiskStatistics,
                    }];
                }
                return apiData;
            })
            .catch((error) => console.log(error)),

    }),
];
StoryDetails.args = {
    modelData: sampleRiskRatingData,
    showHeader: true,
};

import CarbonScore  from '@/components/carbon-score/CarbonScore.vue';
import asyncApiTemplate from '@/components/shared/async-api-template';
import docPageGlobalAsync from '@/components/carbon-score/doc-global-async.mdx';
import sampleCarbonScoreData from '@/components/carbon-score/config/sampleData.json';

export default {
    title: 'Components/Carbon Score',
    component: CarbonScore,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
    },
    parameters: {
        docs: {
            page: docPageGlobalAsync,
        },
    },
};

export const AsyncStoryDetails = asyncApiTemplate(sampleCarbonScoreData, 'Carbon Score', true).bind({});
AsyncStoryDetails.storyName = 'Carbon Score';

AsyncStoryDetails.loaders = [
    async () => ({
        useAsyncApi: true,
    }),
];

AsyncStoryDetails.args = {
    modelData: sampleCarbonScoreData,
    showHeader: true,
};
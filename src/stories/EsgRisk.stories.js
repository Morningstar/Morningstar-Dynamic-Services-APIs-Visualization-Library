import EsgRisk from '@/components/esg-risk/EsgRisk.vue';
import docPageGlobalAsync from '@/components/esg-risk/doc-global-async.mdx';
import asyncApiTemplate from '@/components/shared/async-api-template';
import sampleEsgRiskData from '@/components/esg-risk/config/sampleEsgData.json';

export default {
    title: 'Components/ESG Risk Rating',
    component: EsgRisk,
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

export const AsyncStoryDetails = asyncApiTemplate(sampleEsgRiskData).bind({});
AsyncStoryDetails.storyName = 'ESG Risk Rating';

AsyncStoryDetails.loaders = [
    async () => ({
        useAsyncApi: true,
    }),
];

AsyncStoryDetails.args = {
    modelData: sampleEsgRiskData,
    showHeader: true,
};

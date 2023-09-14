import ProductInvolvement from '@/components/product-involvement/ProductInvolvement.vue';
import docPageGlobalAsync from '@/components/product-involvement/doc-global-async.mdx';
import asyncApiTemplate from '@/components/shared/async-api-template';
import sampleProductInvolvementData from '@/components/product-involvement/config/sampleData.json';

export default {
    title: 'Components/Product Involvement',
    component: ProductInvolvement,
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

export const AsyncStoryDetails = asyncApiTemplate(sampleProductInvolvementData, 'Product Involvement', true).bind({});
AsyncStoryDetails.storyName = 'Product Involvement';

AsyncStoryDetails.loaders = [
    async () => ({
        useAsyncApi: true,
    }),
];

AsyncStoryDetails.args = {
    modelData: sampleProductInvolvementData,
    showHeader: true,
};

import ProductInvolvement from '@/components/product-involvement/ProductInvolvement.vue';
import docPageEMEA from '@/components/product-involvement/doc-emea.mdx';
import docPageAmericas from '@/components/product-involvement/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import sampleModelData from '@/components/product-involvement/config/sampleData.json';
import helper from './stories-helper';

export default {
    title: 'Components/Product Involvement',
    component: ProductInvolvement,
    argTypes: {
        fieldDefinitions: Array,
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
        components: { ProductInvolvement },
        template: `<product-involvement :model-data='${JSON.stringify(response.modelData)}' 
                                        :showHeader='showHeader'
                                        :field-definitions='fieldDefinitions'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.portfolioAnalysis.getEsgPerformanceIntlData({
            portfolios: helper.sampleEsgPortfolio,
        })
            .then((apiData) => xrayHelper.getproductInvolvementData(apiData))
            .catch((error) => console.log(error)),
    }),
];

const fieldDefinitions = [
    {
        text: 'Product Type',
        value: 'name',
    },
    {
        text: 'Fund %',
        value: 'portfolio',
        align: 'end',
    },
    {
        text: 'Benchmark %',
        value: 'benchmark',
        align: 'end',
    },
];

StoryDetails.args = {
    modelData: sampleModelData,
    showHeader: true,
    fieldDefinitions,
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
            .then((apiData) => xrayHelper.getproductInvolvementData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    modelData: sampleModelData,
    showHeader: true,
    fieldDefinitions,
};

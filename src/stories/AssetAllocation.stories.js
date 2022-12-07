import AssetAllocation from '@/components/asset-allocation/AssetAllocation.vue';
import docPageEMEA from '@/components/asset-allocation/doc-emea.mdx';
import docPageAmericas from '@/components/asset-allocation/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import sampleAssetAllocationData from '@/components/asset-allocation/config/sampleAssetAllocationData.json';
import assetMappingsEmea from '@/components/asset-allocation/config/mapping-emea.json';
import assetMappingsAmericas from '@/components/asset-allocation/config/mapping-americas.json';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import helper from './stories-helper';

export default {
    title: 'Components/Asset Allocation',
    component: AssetAllocation,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        assetAllocationMapping: Object,
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
        components: { AssetAllocation },
        methods: { changed: action('TabEvent') },
        template: `<asset-allocation @tab-change='changed'
                                    :model-data='${JSON.stringify(response.modelData)}'
                                    :showHeader='showHeader'
                                    :assetAllocationMapping="assetAllocationMapping"/>`,
    };
};

/* ********** APAC/EMEA *********** */

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getAssetAllocationBreakdown({ portfolios: helper.samplePortfolio })
            .then((apiData) => xrayHelper.getAssetAllocationData(apiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    modelData: sampleAssetAllocationData.emea,
    showHeader: true,
    assetAllocationMapping: assetMappingsEmea,
};

/* ********** Americas *********** */

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
            .getAssetAllocationUsData({ portfolios: helper.sampleUsPortfolio, languageId: 'en-US' })
            .then((apiData) => xrayHelper.getAssetAllocationUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetailsUS.args = {
    modelData: sampleAssetAllocationData.americas,
    showHeader: true,
    assetAllocationMapping: assetMappingsAmericas,
};

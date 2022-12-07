import PortfolioHoldings from '@/components/portfolio-holdings/PortfolioHoldings.vue';
import docPageEMEA from '@/components/portfolio-holdings/doc-emea.mdx';
import docPageAmericas from '@/components/portfolio-holdings/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import helper from '@/stories/stories-helper';
import fieldDefinitions from '@/components/portfolio-holdings/config/fieldDefinitions.json';
import sampleModelData from '@/components/portfolio-holdings/config/samplePortfolioHoldingsModel.json';

export default {
    title: 'Components/Portfolio Holdings',
    component: PortfolioHoldings,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        fieldDefinitions: Object,
        maxTopNetUnderlyingHoldingsNumber: Number,
        showTabs: Boolean,
        tabs: Array,
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
        components: { PortfolioHoldings },
        template: `<portfolio-holdings :model-data='${JSON.stringify(response.modelData)}' 
                                       :showHeader='showHeader'
                                       :field-definitions="fieldDefinitions"
                                       :max-top-net-underlying-holdings-number="maxTopNetUnderlyingHoldingsNumber"
                                       :showTabs='showTabs'
                                       :tabs='tabs'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getPortfolioHoldingsData({ portfolios: helper.samplePortfolio })
            .then((apiData) => xrayHelper.getPortfolioHoldingsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetails.args = {
    fieldDefinitions: fieldDefinitions.emea,
    maxTopNetUnderlyingHoldingsNumber: 10,
    modelData: sampleModelData.emea,
    showHeader: true,
    showTabs: true,
    tabs: ['topHoldings', 'topUnderlyingHoldings', 'stockOverlap'],
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
        modelData: await window.mstarApisSdk.xray
            .getPortfolioHoldingsUsData({ portfolios: helper.sampleUsPortfolio, languageId: 'en-US' })
            .then((apiData) => xrayHelper.getPortfolioHoldingsUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    fieldDefinitions: fieldDefinitions.america,
    maxTopNetUnderlyingHoldingsNumber: 10,
    modelData: sampleModelData.america,
    showHeader: true,
    showTabs: true,
    tabs: ['topHoldings', 'stockOverlap'],
};

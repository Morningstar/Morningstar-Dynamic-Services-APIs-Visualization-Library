import StockRegions from '@/components/stock-regions/StockRegions.vue';
import docPageEMEA from '@/components/stock-regions/doc-emea.mdx';
import docPageAmericas from '@/components/stock-regions/doc-americas.mdx';
import sampleStockRegionsData from '@/components/stock-regions/config/sampleStockRegionsData.json';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import helper from '@/stories/stories-helper';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Components/Stock Regions',
    component: StockRegions,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        fieldDefinitions: Array,
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
        components: { StockRegions },
        methods: {
            changed: action('TabEvent'),
            onMouseOverTooltip: action('MouseMoveEvent'),
        },
        template: `<stock-regions @tab-change='changed' @show-tooltip='onMouseOverTooltip' :model-data='${JSON.stringify(response.modelData)}' 
                :field-definitions="fieldDefinitions" :show-breakdown='showBreakdown' :show-header='showHeader'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getStockRegionsData({ portfolios: helper.samplePortfolio })
            .then((apiData) => xrayHelper.getStockRegionsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

const fieldDefinitions = [
    {
        text: 'Region',
        value: 'name',
        width: '50%',
    },
    {
        text: 'Weight %',
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
    modelData: sampleStockRegionsData,
    showHeader: true,
    fieldDefinitions,
    showBreakdown: false,
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
            .getStockRegionsUsData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            })
            .then((apiData) => xrayHelper.getStockRegionsUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    modelData: sampleStockRegionsData,
    showHeader: true,
    fieldDefinitions,
    showBreakdown: false,
};

import StockSectors from '@/components/stock-sectors/StockSectors.vue';
import docPageEMEA from '@/components/stock-sectors/doc-emea.mdx';
import docPageAmericas from '@/components/stock-sectors/doc-americas.mdx';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';
import sampleStockSectorsData from '@/components/stock-sectors/config/sampleData.json';

export default {
    title: 'Components/Stock Sectors',
    component: StockSectors,
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
        components: { StockSectors },
        methods: { viewBreakdown: action('ViewBreakdownEvent') },
        template: `<stock-sectors :model-data='${JSON.stringify(response.modelData)}'
            :showHeader='showHeader'
            :field-definitions='fieldDefinitions'
            :showBreakdown='showBreakdown'
            @show-security-level-breakdown='viewBreakdown' />`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getStockSectorsData({ portfolios: helper.samplePortfolio })
            .then((apiData) => xrayHelper.getStockSectorsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

const fieldDefinitions = [
    {
        text: 'Sector Type',
        value: 'name',
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
    modelData: sampleStockSectorsData,
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
            .getStockSectorsUsData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            }).then((apiData) => xrayHelper.getStockSectorsUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    modelData: sampleStockSectorsData,
    showHeader: true,
    fieldDefinitions,
};

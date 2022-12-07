import StockType from '@/components/stock-type/StockType.vue';
import docPage from '@/components/stock-type/doc.mdx';
import { action } from '@storybook/addon-actions';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import helper from '@/stories/stories-helper';
import sampleModelData from '@/components/stock-type/config/sampleData.json';

export default {
    title: 'Components/StockType',
    component: StockType,
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

const modelData = sampleModelData;

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
        components: { StockType },
        methods: { viewBreakdown: action('ViewBreakdownEvent') },
        template: `<stock-type :model-data='${JSON.stringify(response.modelData)}'
                              :showHeader='showHeader'
                              :showBreakdown='showBreakdown'
                              @show-security-level-breakdown='viewBreakdown'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getStockTypeData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            })
            .then((apiData) => xrayHelper.getStockTypeUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.storyName = 'Stock Type';
StoryDetails.args = {
    modelData,
    showHeader: true,
    showBreakdown: false,
};

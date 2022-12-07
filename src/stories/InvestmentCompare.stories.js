import InvestmentCompare from '@/components/investment-compare/InvestmentCompare.vue';
import docPage from '@/components/investment-compare/doc.mdx';
import { action } from '@storybook/addon-actions';
import sampleCompareData from '@/components/investment-compare/config/sampleData.json';
import fieldDefinitions from '@/components/investment-compare/config/fieldDefinitions.json';

export default {
    title: 'Tools/InvestmentCompare',
    component: InvestmentCompare,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        fieldDefinitions: Array,
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
        components: { InvestmentCompare },
        template: `<investment-compare :model-data='${JSON.stringify(response.modelData)}' 
            :show-header="showHeader"
            :fieldDefinitions="fieldDefinitions" />`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Investment Compare';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.investmentCompare
            .getIntlCompareSecurities('F0GBR050DD|F00000Q5PZ|F000015O6Z')
            .catch((error) => console.log(error)),
    }),
];

StoryDetails.args = {
    modelData: sampleCompareData,
    showHeader: true,
    fieldDefinitions,
};

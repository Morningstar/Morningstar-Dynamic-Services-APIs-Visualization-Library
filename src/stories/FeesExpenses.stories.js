import FeesExpenses from '@/components/fees-expenses/FeesExpenses.vue';
import docPageEMEA from '@/components/fees-expenses/doc-emea.mdx';
import docPageAmericas from '@/components/fees-expenses/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';
import fieldDefinitionsIntlMifid from '@/components/fees-expenses/config/fieldDefinitionsIntlMifid.json';
import sampleFeesExpenseDataIntlMifid from '@/components/fees-expenses/config/sampleFeesExpenseDataIntlMifid.json';
import fieldDefinitionsUs from '@/components/fees-expenses/config/fieldDefinitionsUs.json';
import sampleFeesExpensesUsData from '@/components/fees-expenses/config/sampleFeesExpensesUsData.json';

export default {
    title: 'Components/Fees Expenses',
    component: FeesExpenses,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        fieldDefinitions: Object,
    },
    parameters: {
        docs: {
            page: docPageEMEA,
        },
    },
};

const Template = (args, { argTypes, loaded }) => {
    let response = {};
    if (loaded?.modelData?.feesExpensesData) {
        response = loaded;
        action('Component loaded')('API Data');
    } else {
        response.modelData = args.modelData;
        action('Component loaded')('Static Data');
    }
    return {
        props: Object.keys(argTypes),
        components: { FeesExpenses },
        template: `<fees-expenses :model-data='${JSON.stringify(response.modelData)}'
                        :showHeader='showHeader'
                        :fieldDefinitions="fieldDefinitions" />`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: {
            feesExpensesData: await window.mstarApisSdk.costCalculator
                .getCostCalculation({ portfolios: helper.sampleCostCalculationPortfolio })
                .catch((error) => console.log(error)),
        },
    }),
];
StoryDetails.args = {
    modelData: sampleFeesExpenseDataIntlMifid,
    showHeader: true,
    fieldDefinitions: fieldDefinitionsIntlMifid,
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
        modelData: {
            feesExpensesData: await window.mstarApisSdk.xray.getFeesExpensesUsData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            })
                .catch((error) => console.log(error)),
        },
    }),
];

StoryDetailsUS.args = {
    modelData: sampleFeesExpensesUsData,
    showHeader: true,
    fieldDefinitions: fieldDefinitionsUs,
};

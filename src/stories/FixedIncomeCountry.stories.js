import FixedIncomeCountry from '@/components/fixed-income-country/FixedIncomeCountry.vue';
import docPage from '@/components/fixed-income-country/doc.mdx';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';
import sampleData from '@/components/fixed-income-country/config/sampleData.json';
import portfolioAnalysisHelper from '@/components/shared/portfolio-analysis-helper';

export default {
    title: 'Components/Fixed Income Country',
    component: FixedIncomeCountry,
    argTypes: {
        fieldDefinitions: Array,
        modelData: Object,
        showHeader: Boolean,
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
        components: { FixedIncomeCountry },
        template: `<fixed-income-country :model-data='${JSON.stringify(response.modelData)}'
                                         :field-definitions="fieldDefinitions"
                                         :showHeader='showHeader'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Fixed Income Country';

StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getFixedIncomeCountryData({ portfolios: helper.samplePortfolio })
            .then((apiData) => portfolioAnalysisHelper.getFixedIncomeCountryData(apiData))
            .catch((error) => console.log(error)),
    }),
];

const fieldDefinitions = [
    {
        text: 'Country',
        value: 'name',
    },
    {
        text: 'Portfolio %',
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
    fieldDefinitions,
    modelData: sampleData,
    showHeader: true,
};

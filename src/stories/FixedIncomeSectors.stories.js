import FixedIncomeSectors from '@/components/fixed-income-sectors/FixedIncomeSectors.vue';
import docPageEMEA from '@/components/fixed-income-sectors/doc-emea.mdx';
import docPageAmericas from '@/components/fixed-income-sectors/doc-americas.mdx';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';
import portfolioAnalysisHelper from '@/components/shared/portfolio-analysis-helper';
import mapping from '@/components/fixed-income-sectors/config/mapping.json';
import sampleData from '@/components/fixed-income-sectors/config/sampleData.json';

export default {
    title: 'Components/Fixed Income Sectors',
    component: FixedIncomeSectors,
    argTypes: {
        dataPoints: Array,
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
        components: { FixedIncomeSectors },
        template: `<fixed-income-sectors :model-data='${JSON.stringify(response.modelData)}'
                                         :dataPoints='dataPoints'
                                         :showHeader='showHeader'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';

StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getFixedIncomeSectorsData({ portfolios: helper.samplePortfolio })
            .then((apiData) => portfolioAnalysisHelper.getFixedIncomeSectorsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetails.args = {
    dataPoints: mapping.dataPoints,
    modelData: sampleData,
    showHeader: true,
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
            .getFixedIncomeSectorsUsData({
                portfolios: helper.sampleUsPortfolio,
                languageId: 'en-US',
            })
            .then((apiData) => portfolioAnalysisHelper.getFixedIncomeSectorsUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];

StoryDetailsUS.args = {
    dataPoints: mapping.dataPointsUs,
    modelData: sampleData,
    showHeader: true,
};

import PortfolioSrri from '@/components/portfolio-srri/PortfolioSrri.vue';
import docPage from '@/components/portfolio-srri/doc.mdx';
import helper from '@/stories/stories-helper';
import sampleModelData from '@/components/portfolio-srri/config/samplePortfolioSrriModel.json';
import { action } from '@storybook/addon-actions';
import { get } from 'lodash';

export default {
    title: 'Components/Portfolio SRRI',
    component: PortfolioSrri,
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
        components: { PortfolioSrri },
        template: `<portfolio-srri :model-data='${JSON.stringify(response.modelData)}'
            :show-header="showHeader" />`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Portfolio SRRI';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getSrri({ portfolios: helper.samplePortfolio })
            .then((apiData) => get(apiData, 'riskStatistics'))
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    modelData: sampleModelData,
    showHeader: true,
};

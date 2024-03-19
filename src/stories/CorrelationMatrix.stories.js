import CorrelationMatrix from '@/components/correlation-matrix/CorrelationMatrix';
import docPageAmericas from '@/components/correlation-matrix/doc-americas.mdx';
import docPageEMEA from '@/components/correlation-matrix/doc-emea.mdx';
import sampleCorrelationData from '@/components/correlation-matrix/config/sampleData.json';
import {action} from '@storybook/addon-actions';
import helper from "@/stories/stories-helper";
import xrayHelper from "@/components/shared/portfolio-analysis-helper";

export default {
    title: 'Components/Correlation Matrix',
    component: CorrelationMatrix,
    argTypes: {
        modelData: Object,
        showHeader: Boolean
    },
    parameters: {
        docs: {
            page: docPageEMEA,
        },
    },
};

const Template = (args, {argTypes, loaded}) => {
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
        components: {CorrelationMatrix},
        template: `
            <correlation-matrix :model-data='${JSON.stringify(response.modelData)}'
                                :showHeader='showHeader'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'APAC/EMEA';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.xray
            .getCorrelationMatrixData({portfolios: helper.samplePortfolio})
            .then((apiData) => xrayHelper.getCorrelationMatrixData(apiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    modelData: sampleCorrelationData,
    showHeader: true
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
            .getCorrelationMatrixUsData({portfolios: helper.sampleUsPortfolio})
            .then((apiData) => xrayHelper.getCorrelationMatrixUsData(apiData))
            .catch((error) => console.log(error)),
    }),
];
StoryDetailsUS.args = {
    modelData: sampleCorrelationData,
    showHeader: true
};

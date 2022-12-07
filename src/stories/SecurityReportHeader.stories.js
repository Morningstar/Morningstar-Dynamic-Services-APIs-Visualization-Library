import SecurityReportHeader from '@/components/security-report-header/SecurityReportHeader.vue';
import docPage from '@/components/security-report-header/doc.mdx';
import { action } from '@storybook/addon-actions';
import sampleModelData from '@/components/security-report-header/config/sampleData.json';

export default {
    title: 'Components/SecurityReportHeader',
    component: SecurityReportHeader,
    argTypes: {
        fieldDefinitions: Array,
        modelData: Array,
        showHeader: {
            type: Boolean,
            default: () => true,
        },
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
        response.modelData[0].ManagerList = [];
        action('Component loaded')('API Data');
    } else {
        response.modelData = args.modelData;
        action('Component loaded')('Static Data');
    }
    return {
        props: Object.keys(argTypes),
        components: { SecurityReportHeader },
        template: `<security-report-header :model-data='${JSON.stringify(response.modelData)}'
                                           :field-definitions='fieldDefinitions' 
                                           :show-header='showHeader'/>`,
    };
};

export const StoryDetails = Template;
StoryDetails.storyName = 'Security Report Header';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.securityDetails
            .getSecurity('FOUSA00B4J')
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    showHeader: true,
    modelData: sampleModelData,
    fieldDefinitions: [
        {
            fieldName: 'id',
            modelPath: 'Id',
        },
        {
            fieldName: 'isin',
            modelPath: 'Isin',
        },
        {
            fieldName: 'currency',
            modelPath: 'Currency.Id',
        },
        {
            fieldName: 'exchange',
            modelPath: 'Exchange',
        },
        {
            fieldName: 'legalStructure',
            modelPath: 'LegalStructure',
        },
        {
            fieldName: 'fundBenchmark',
            modelPath: 'FundBenchmark.0.Name',
        },
    ],
};
StoryDetails.parameters = { controls: { hideNoControlsWarning: true } };

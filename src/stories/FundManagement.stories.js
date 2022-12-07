import FundManagement from '@/components/fund-management/FundManagement.vue';
import docPage from '@/components/fund-management/doc.mdx';
import { action } from '@storybook/addon-actions';
import sampleData from '@/components/fund-management/config/sampleData.json';
import helper from '@/stories/stories-helper';

export default {
    title: 'Components/FundManagement',
    component: FundManagement,
    argTypes: {
        modelData: Array,
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
        components: { FundManagement },
        template: `<fund-management :model-data='${helper.parseModelData(response.modelData)}'
                                      :showHeader='showHeader'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Fund Management';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.securityDetails
            .getSecurityDetails('F0GBR050DD').then((apiData) => {
                if (apiData.length) {
                    return [{
                        Domicile: apiData[0].Domicile,
                        InceptionDate: apiData[0].InceptionDate,
                        ManagerList: apiData[0].ManagerList,
                        ProviderCompany: apiData[0].ProviderCompany,
                        FundAttributes: apiData[0].FundAttributes,
                    }];
                }
                return apiData;
            })
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    modelData: sampleData,
    showHeader: true,
};

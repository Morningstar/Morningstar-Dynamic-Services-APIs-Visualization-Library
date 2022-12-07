import SecurityReport from '@/components/security-report/SecurityReport.vue';
import docPage from '@/components/security-report/doc.mdx';
import securityDetailsData from '@/components/security-report/config/sampleData.json';
import assetAllocationMappingEmea from '@/components/asset-allocation/config/mapping-emea.json';
import helper from '@/stories/stories-helper';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Tools/SecurityReport',
    component: SecurityReport,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        componentsOptions: Object,
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
        components: { SecurityReport },
        template: `<security-report :model-data='${helper.parseModelData(response.modelData)}'
                                      :showHeader='showHeader'
                                      :components-options='componentsOptions'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Security Report';
StoryDetails.loaders = [
    async () => ({
        modelData: await window.mstarApisSdk.securityDetails.getSecurityDetails('F000001EZZ')
            .catch((error) => console.log(error)),

    }),
];

StoryDetails.args = {
    modelData: securityDetailsData,
    showHeader: true,
    componentsOptions: {
        sections: [
            {
                components: [
                    'securityReportHeader',
                ],
            },
            {
                title: 'Performance',
                components: [
                    'performanceGraph',
                    'annualPerformance',
                    'calendarYearReturns',
                    'trailingReturns',
                ],
            },
            {
                title: 'Portfolio',
                components: [
                    'portfolio',
                ],
            },
            {
                title: 'Risk & Rating',
                components: [
                    'riskRating',
                ],
            },
            {
                title: 'Fund Management',
                components: [
                    'fundManagement',
                ],
            },
        ],
        props: {
            performanceGraph: {
                showTimeSeriesData: true,
                title: 'Growth of Investment',
            },
            annualPerformance: {
                displays: ['table'],
                title: 'Annual Performance (%)',
            },
            calendarYearReturns: {
                height: 600,
                title: 'Calendar Year Returns (%)',
            },
            trailingReturns: {
                height: 360,
                title: 'Trailing Returns (%)',
            },
            portfolio: {
                componentsOptions: {
                    showSectionHeader: false,
                    sections: [
                        {
                            section: 'overview',
                            components: [
                                'assetAllocation',
                                'stockRegions',
                                'stockSectors',
                                'stockStats',
                                'portfolioHoldings',
                            ],
                        },
                    ],
                    props: {
                        portfolioHoldings: {
                            showTabs: false,
                            fieldDefinitions: {
                                topHoldings: [
                                    {
                                        text: 'Security Name',
                                        value: 'securityName',
                                    },
                                    {
                                        text: 'Sector',
                                        value: 'globalSectorId',
                                    },
                                    {
                                        text: 'Country',
                                        value: 'countryId',
                                    },
                                    {
                                        text: '% of Assets',
                                        value: 'weighting',
                                    },
                                ],
                            },
                        },
                        assetAllocation: {
                            assetAllocationMapping: assetAllocationMappingEmea,
                        },
                    },
                },
            },
        },
    },
};

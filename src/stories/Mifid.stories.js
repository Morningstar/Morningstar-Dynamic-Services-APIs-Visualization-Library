import Questionnaire from '@/components/questionnaire/Questionnaire.vue';
import Screener from '@/components/screener/Screener.vue';
import Xray from '@/components/xray/Xray.vue';
import docPage from '@/workflow/Mifid/doc.mdx';
import { action } from '@storybook/addon-actions';
import helper from '@/stories/stories-helper';
import fieldDefinitions from '@/workflow/Mifid/screenerDef.json';
import portfolioHoldingsFieldDefinations from '@/workflow/Mifid/portfolio-holdings-field-defs-mifidii.json';
import screenerFiltersModelData from '@/workflow/Mifid/sampleFilterDataResponse.json';
import screenerSecurityListData from '@/workflow/Mifid/sampleSecurityListDataResponse.json';
import xrayIntlData from '@/workflow/Mifid/xray-intl-data.json';
import assetAllocationMappingEmea from '@/workflow/Mifid/assetAllocationMappingEmea.json';
import questions from '@/workflow/Mifid/questionairre.json';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';

export default {
    title: 'Workflow/Investor Preferences',
    argTypes: {
        showHeader: Boolean,
        screenerFiltersModelData: Object,
        screenerSecurityListData: Object,
        componentsOptions: Object,
        portfolio: Object,
        questionairre: Object,
    },
    parameters: {
        docs: {
            page: docPage,
            iframeHeight: 700,
        },
    },
};
const componentsOptions = {
    showSectionHeader: true,
    showBreakdown: false,
    sections: [
        {
            section: 'holdings',
            components: ['portfolioHoldings'],
        },
        {
            section: 'overview',
            components: ['assetAllocation'],
        },
        {
            section: 'performance',
            components: ['performanceGraph', 'trailingReturns'],
        },
        {
            section: 'assetClass',
            components: [
                'stockRegions',
                'stockStats',
                'stockSectors',
                'fixedIncomeSectors',
                'fixedIncomeCountry',
                'portfolioSrri',
            ],
        },
    ],
    props: {
        assetAllocation: {
            assetAllocationMapping: assetAllocationMappingEmea,
        },
        performanceGraph: {
            showTimeSeriesData: false,
        },
        trailingReturns: {
            chartHeight: 432,
        },
        portfolioHoldings: {
            fieldDefinitions: portfolioHoldingsFieldDefinations,
            tabs: ['topHoldings'],
        },
    },
};

const defaultParams = {
    page: 1,
    pageSize: 10,
    sortOrder: 'name asc',
    universeIds: 'FOGBR$$ALL',
    securityDataPoints: [
        'secId',
        'tenforeId',
        'name',
        'closePrice',
        'yield_M12',
        'ongoingCharge',
        'initialPurchase',
        'maxFrontEndLoad',
        'starRatingM255',
        'analystRatingScale',
        'lowCarbonDesignation',
        'sustainabilityRank',
        'average12MonthCarbonRiskScore',
        'gbrReturnD1',
        'gbrReturnW1',
        'gbrReturnM1',
        'gbrReturnM3',
        'gbrReturnM6',
        'investmentType',
        'holdingTypeId',
        'universe',
    ],
    filterValues: '',
    term: '',
    calculatedDataPoints: '',
};

const Template = (args, { argTypes, loaded }) => {
    let response = {};
    let isApiData = loaded?.useApiData
    /**
     *  When loaded.useApiData true then storybook loads API data otherwise use mock data
     */
    if (isApiData) {
        response = loaded;
    } else {
        response.portfolio = args.portfolio;
    }

    return {
        props: Object.keys(argTypes),
        components: {
            Questionnaire,
            Screener,
            Xray,
        },
        template: `
                <div>
                    <questionnaire
                        v-if="showQuestionairre"
                        :questionairre='questionairre'
                        :showHeader='showHeader'
                        @onButtonClick="handleClick"
                    />
                    <v-btn
                        v-if="!showQuestionairre"
                        class="mb-4"
                        @click="handleClick"
                    >
                        <v-icon class="mr-2">mdi-arrow-left</v-icon>
                        Back
                    </v-btn>
                    <div>
                        <screener
                            v-if="showScreener"
                            :show-header="showHeader"
                            :requestDetails="requestDetails"
                            :field-definitions='fieldDefinitions'
                        />
                        <xray
                            v-if="showXray"
                            :model-data='xrayModelData'
                            :show-header='showHeader'
                            :components-options='componentsOptions'
                            :portfolio='${JSON.stringify(response.portfolio)}'
                        />
                    </div>
                    <v-container fluid fill-height>
                        <v-overlay :value="showLoader" opacity="dark" color="white">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            size="64"
                        ></v-progress-circular>
                        </v-overlay>
                    </v-container>
                </div>
            `,
        data() {
            return {
                showQuestionairre: true,
                showScreener: false,
                showXray: false,
                requestDetails: {
                    params: {},
                    methodName: '',
                },
                securityListData: {},
                filterData: {},
                xrayModelData: {},
                showLoader: false,
            };
        },
        methods: {
            async handleClick(requestParams) {
                if (requestParams.source === 'screener' ) {
                    defaultParams.calculatedDataPoints = requestParams.params.calculatedDataPoints;
                    defaultParams.filters = "UserPref1:EQ:True";

                    this.requestDetails.params = defaultParams;
                    this.requestDetails.methodName = 'getIntlScreenerPostData';

                    this.showQuestionairre = false;
                    this.showScreener = true;
                    this.showXray = false;
                    action('Component loaded')('API Data');
                    action('Component Action')(
                        'Screener Component is called and Questionairre is hidden',
                    );
                } else if (requestParams.source === 'xray') {
                    if (!isApiData) {
                        this.xrayModelData = xrayIntlData;
                        await this.$nextTick();
                        this.showQuestionairre = false;
                        this.showScreener = false;
                        this.showXray = true;
                        action('Component loaded')('Static Data');
                    } else {
                        this.showLoader = true
                        helper.investorPreferencesPortfolio.calculatedDataPoints = requestParams.params.calculatedDataPoints;
                        window.mstarApisSdk.xray.getXrayIntlData({
                            portfolios: helper.investorPreferencesPortfolio,
                        })
                        .then( async (apiData) => {
                            action('Component loaded')('API Data');
                            apiData.holdings.forEach((holding) => { 
                                holding.preferenceAligned = holding.userPref1 === 1;
                            });
                            const modelData = xrayHelper.getXrayData(
                                [{ value: apiData }],
                                componentsOptions.sections,
                                helper.investorPreferencesPortfolio,
                            )
                            this.xrayModelData = modelData;
                            this.showLoader = false;
                            await this.$nextTick();
                            this.showQuestionairre = false;
                            this.showScreener = false;
                            this.showXray = true;
                        });
                    }
                    action('Component Action')(
                        'Xray Component is called and Questionairre is hidden',
                    );
                } else {
                    this.showQuestionairre = true;
                    this.showScreener = false;
                    this.showXray = false;
                }
            },
        },
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Investor Preferences';
StoryDetails.loaders = [
    async () => ({
        useApiData: true,
    }),
];
StoryDetails.args = {
    showHeader: true,
    screenerFiltersModelData,
    screenerSecurityListData,
    xrayIntlData,
    portfolio: helper.investorPreferencesPortfolio,
    componentsOptions,
    fieldDefinitions,
    questionairre: questions,
};

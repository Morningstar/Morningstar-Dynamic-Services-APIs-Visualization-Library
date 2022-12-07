import { action } from '@storybook/addon-actions';
import Screener from '@/components/screener/Screener.vue';
import filtersModelData from '@/components/screener/components/sampleFilterDataResponse.json';
import securityListData from '@/components/screener/components/sampleSecurityListDataResponse.json';
import docPage from '@/components/screener/doc.mdx';
import helper from '@/stories/stories-helper';
import fieldDefinitions from '@/components/screener/config/fieldDefinitions.json';

export default {
    title: 'Tools/Screener',
    component: Screener,
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
    if (loaded.securityListData && loaded.filtersModelData) {
        response = loaded;
        response.securityListData = loaded.securityListData;
        response.filtersModelData = loaded.filtersModelData;
        action('Component loaded')('API Data');
    } else {
        response.filtersModelData = args.filtersModelData;
        response.securityListData = args.securityListData;
        action('Component loaded')('Static Data');
    }

    return {
        props: Object.keys(argTypes),
        components: { Screener },
        methods: {
            updatedFilters: action('onUpdatedFilters'),
            resetFilters: action('onResetFilters'),
            updatedTable: action('onUpdatedTable'),
        },
        template: `<screener :show-header="showHeader" 
            :filters-model-data='${helper.parseModelData(response.filtersModelData)}'
            :list-model-data='${helper.parseModelData(response.securityListData)}'
            :field-definitions='fieldDefinitions'
            @onUpdatedFilters='updatedFilters'
            @onResetFilters='resetFilters'
            @onUpdatedTable='updatedTable'
        />`,
    };
};

export const StoryDetails = Template.bind({});
const defaultParams = {
    page: 1,
    pageSize: 10,
    sortField: 'name',
    sortOrder: 'asc',
    universeIds: 'FOGBR$$ALL|E0EXG$XLON',
    securityDataPoints: 'secId,tenforeId,name,closePrice,yield_M12,ongoingCharge,initialPurchase,maxFrontEndLoad,starRatingM255,analystRatingScale,lowCarbonDesignation,sustainabilityRank,average12MonthCarbonRiskScore,gbrReturnD1,gbrReturnW1,gbrReturnM1,gbrReturnM3,gbrReturnM6,investmentType,holdingTypeId,universe',
    filterValues: '',
    term: '',
};
StoryDetails.storyName = 'Screener';
StoryDetails.loaders = [
    async () => ({
        filtersModelData: await window.mstarApisSdk.screener.getIntlFiltersData()
            .catch((error) => console.log(error)),
        securityListData: await window
            .mstarApisSdk
            .screener.getIntlScreenerData(JSON.stringify(defaultParams, null, 2))
            .catch((error) => console.log(error)),
    }),
];
StoryDetails.args = {
    filtersModelData,
    securityListData,
    fieldDefinitions,
    showHeader: true,
};

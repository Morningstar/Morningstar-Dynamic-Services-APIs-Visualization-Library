<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Screener</h2>
            </v-col>
        </v-row>
        <Filters
            ref="filterRef"
            :model-data="filtersModelData"
            :filter-definitions="getFilters"
            :quick-filter-definitions="getQuickFilters"
            @updated-filters="updatedFilters"
            @reset-filter="resetFilter"
        />
        <v-row class="mb-4">
            <v-col v-if="chipFilterValues.length > 0">
                <span>
                    Filtered By:
                </span>
                <span
                    v-for="key in chipFilterValues"
                    :key="key"
                >
                    <v-chip
                        class="ma-2"
                        close
                        @click:close="closeChip(key)"
                        >
                        {{key}}
                    </v-chip>
                </span>
            </v-col>
        </v-row>
        <div class="mt-4 mb-10">
            <SecurityList
                :showHeader="false"
                :model-data="securityListData"
                :filter-definitions="fieldDefs.securityList"
                :loader="loading"
                @updated-options="updatedListOptions"
            >
            </SecurityList>
        </div>
        <floating-scroll-button></floating-scroll-button>
    </div>
</template>

<script>
import SecurityList from '@/components/screener/components/SecurityList.vue';
import Filters from '@/components/screener/components/Filter.vue';
import FloatingScrollButton from '../shared/FloatingScrollButton.vue';

export default {
    components: {
        Filters,
        FloatingScrollButton,
        SecurityList,
    },
    props: {
        /** Accepts the response object for Filters returned from API Data Access Library. */
        filtersModelData: {
            type: Object,
            default: () => ({}),
        },
        /** Accepts the response object for security list returned from API Data Access Library. */
        listModelData: {
            type: Object,
            default: () => ({}),
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Show fields based on field definitions. */
        fieldDefinitions: {
            type: Object,
            default: () => ({}),
        },

        /** Except params and sdk method name from parent component */
        requestDetails: {
            type: Object,
            default: () => ({
                params: {},
                methodName: '',
            }),
        },
    },
    watch: {
        selectedFiltersValues: {
            handler(newVal) {
                this.chipFilterValues = this.calculateChips();
                if (!this.parentFilterRequest) {
                    const filterParams = this.setFilterParams(newVal);
                    const params = {
                        filterValues: filterParams,
                    };
                    this.getDataFromSdk(params);
                }
            },
            deep: true,
        },
    },
    data() {
        return {
            securityListData: this.listModelData,
            loading: false,
            selectedFiltersValues: {},
            chipFilterValues: [],
            parentFilters: {},
            parentFilterRequest: false,
            selectedQuickFilter: '',
            fieldDefs: {},
        };
    },
    created() {
        this.fieldDefs = this.fieldDefinitions;
        // scroll to top in case of scroll position is changed in workflow
        this.$vuetify.goTo(0);
    },
    computed: {
        getFilters() {
            return (this.fieldDefs.filters && Object.keys(this.fieldDefs.filters).length > 0) ? this.fieldDefs.filters : null;
        },
        getQuickFilters() {
            return (this.fieldDefs.quickFilters && Object.keys(this.fieldDefs.quickFilters).length > 0) ? this.fieldDefs.quickFilters : null;
        },
    },
    methods: {
        setFilterParams(values) {
            const getKeys = Object.keys(values);
            const result = Object.values(values).filter((val) => val);

            getKeys.forEach((value) => {
                const isParentFilter = this.fieldDefs
                    .filters[value]?.childFiltersId?.length > 0 || false;
                const parentFilterValue = this.parentFilters[value];
                const parentApiParamIndex = result.indexOf(parentFilterValue);

                if (isParentFilter && parentApiParamIndex !== -1) {
                    result.splice(parentApiParamIndex, 1);
                }
            });
            return result.join('|');
        },
        calculateChips() {
            const selectedFilterKeys = Object.keys(this.selectedFiltersValues);
            let currentSelection = [];
            if (this.selectedQuickFilter.length > 0) {
                const quickFilterObj = this.fieldDefs.quickFilters[this.selectedQuickFilter];
                currentSelection = quickFilterObj.filterLabel.split();
            } else {
                currentSelection = selectedFilterKeys
                    .filter((key) => this.selectedFiltersValues[key] !== '')
                    .map((key) => {
                        const result = key.replace(/([A-Z])/g, ' $1');
                        return result.charAt(0).toUpperCase() + result.slice(1);
                    });
            }
            return currentSelection;
        },
        closeChip(key) {
            if (this.selectedQuickFilter.length > 0) {
                this.$refs.filterRef.selectedFilterIndex = undefined;
                this.fieldDefs.quickFilters[this.selectedQuickFilter].placeholderLabelId = '';
                this.selectedFiltersValues[this.selectedQuickFilter] = '';
                this.selectedQuickFilter = '';
            } else {
                const camelCaseKey = key.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
                    if (+match === 0) return '';
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                });
                const isParentFilter = this.fieldDefs
                    .filters[camelCaseKey]?.childFiltersId?.length > 0 || false;
                this.selectedFiltersValues[camelCaseKey] = '';
                if (isParentFilter) {
                    const { childFiltersId } = this.fieldDefs.filters[camelCaseKey];
                    childFiltersId.forEach((value) => {
                        this.fieldDefs.filters[value].disableState = true;
                        this.fieldDefs.filters[value].placeholderLabelId = '';
                        this.selectedFiltersValues[value] = '';
                    });
                }
                this.fieldDefs.filters[camelCaseKey].placeholderLabelId = '';
            }
        },
        resetFilter() {
            this.setSelectedFiltersValues();
            this.selectedQuickFilter = '';
            this.getDataFromSdk();
            this.$emit('onResetFilters', 'Filters have been Reset');
        },
        setSelectedFiltersValues() {
            this.selectedFiltersValues = Object.keys({ ...this.fieldDefs.filters, ...this.fieldDefs.quickFilters }).reduce((prev, curr) => ({ ...prev, [curr]: '' }), {});
        },
        updatedFilters(data) {
            if (this.selectedQuickFilter.length > 0 || data.isQuickFilter) {
                this.setSelectedFiltersValues();
            }
            if (data.isQuickFilter) {
                this.selectedFiltersValues[data.id] = data.value;
                this.selectedQuickFilter = data.id;
            } else {
                this.selectedQuickFilter = '';
                const { apiParam } = this.fieldDefs.filters[data.id];
                const isParentFilter = this.fieldDefs
                    .filters[data.id]?.childFiltersId?.length > 0 || false;
                const selectedValue = apiParam ? `${apiParam}${data.value}` : data.value;
                const isData = data.value !== '' && data.value.length > 0;
                if (isParentFilter && isData) {
                    this.parentFilters[data.id] = selectedValue;
                    this.selectedFiltersValues[data.id] = selectedValue;
                    this.parentFilterRequest = true;
                } else if (isData) {
                    this.selectedFiltersValues[data.id] = selectedValue.replace(/,/g, ':');
                    this.parentFilterRequest = false;
                } else {
                    this.selectedFiltersValues[data.id] = '';
                    this.parentFilterRequest = false;
                }
            }
            this.$emit('onUpdatedFilters', this.selectedFiltersValues[data.id]);
        },
        updatedListOptions(data) {
            const filterParams = Object.values(this.selectedFiltersValues).filter((val) => val).join('|');
            const params = {
                sortField: data.sortBy,
                sortOrder: data.sortOrder,
                page: data.page,
                pageSize: data.itemsPerPage,
                filterValues: filterParams,
            };
            this.getDataFromSdk(params);
            this.$emit('onUpdatedTable', data);
        },
        async getDataFromSdk(params = {}) {
            this.loading = true;
            const defaultParams = {
                page: params.page || 1,
                pageSize: params.pageSize || 10,
                sortOrder: `${params.sortField ?? 'name'} ${params.sortOrder ?? 'asc'}`,
                universeIds: 'FOGBR$$ALL|E0EXG$XLON',
                securityDataPoints: 'secId,tenforeId,name,closePrice,yield_M12,ongoingCharge,initialPurchase,maxFrontEndLoad,starRatingM255,analystRatingScale,lowCarbonDesignation,sustainabilityRank,average12MonthCarbonRiskScore,gbrReturnD1,gbrReturnW1,gbrReturnM1,gbrReturnM3,gbrReturnM6,investmentType,holdingTypeId,universe',
                filterValues: params.filterValues || '',
                term: '',
            };

            const methodName = this.requestDetails.methodName ? this.requestDetails.methodName : 'getIntlScreenerData';
            const reqParams = Object.keys(this.requestDetails.params).length ? this.requestDetails.params : defaultParams;
            if (Object.keys(this.requestDetails.params).length) {
                reqParams.page = params.page ?? reqParams.page;
                reqParams.pageSize = params.pageSize ?? reqParams.pageSize;
                reqParams.sortOrder = `${params.sortField ? params.sortField : reqParams.sortField} ${params.sortOrder ?  params.sortOrder : reqParams.sortOrder}`;
            }

            this.securityListData = await window
                .mstarApisSdk
                .screener[methodName](reqParams)
                .then((data) => {
                    // TODO: Need to remove below code when API integration is done.
                    data.rows.map((item) => {
                        if (item.UserPref1) {
                            item.preferenceAligned = true;
                        }
                    });
                    this.$emit('onUpdatedTable', data);
                    return data;
                });
            this.loading = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
</style>

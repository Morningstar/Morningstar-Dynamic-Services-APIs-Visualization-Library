<template>
    <div>
        <v-row>
            <!-- Fund Provider -->
            <v-expansion-panels
                v-model="expansionPanel"
                class="pa-4">
                <v-expansion-panel v-if="filterDefinitions">
                    <v-expansion-panel-header>
                       <h4>Quick Filters</h4>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-btn-toggle
                                v-model="selectedFilterIndex"
                                @change="onQuickFilterChange"
                                class="flex-wrap"
                                >
                                <v-btn v-for="(filter, index) in quickFilterDefinitions"
                                    :key="index"
                                    class="ma-2"
                                    elevation="2"
                                    small>
                                    {{filter.label}}
                                </v-btn>
                            </v-btn-toggle>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="quickFilterDefinitions">
                    <v-expansion-panel-header>
                        <h4>Custom Filters</h4>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col
                                v-for="(key, index) in filters"
                                :key="index"
                                sm="6"
                                md="3"
                                lg="3"
                                cols="12"
                            >
                                <v-select
                                    v-if="filterDef[key].type === 'select'"
                                    v-model="filterDef[key].placeholderLabelId"
                                    :items="filterDef[key].listItems"
                                    :label="filterDef[key].label"
                                    :disabled="'disableState' in filterDef[key] ?
                                        filterDef[key].disableState : false"
                                    item-text="name"
                                    item-value="id"
                                    @change="filtersChanged(filterDef[key].placeholderLabelId
                                    , key)"
                                >
                                </v-select>
                                <v-combobox
                                    v-if="filterDef[key].type === 'combobox'"
                                    v-model="filterDef[key].placeholderLabelId"
                                    :items="filterDef[key].listItems"
                                    :label="filterDef[key].label"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    @change="filtersChanged(filterDef[key].placeholderLabelId
                                    , key)"
                                >
                                </v-combobox>
                            </v-col>
                        </v-row>

                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
        <v-row v-if="filterDefinitions || quickFilterDefinitions">
            <v-col class="mb-4 text-end">
                <v-btn
                    color="secondary"
                    small
                    @click="emitResetFilter"
                >
                Reset Filters
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: Object,
            default: () => ({}),
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Show filters based on filter definition passed to the Filter component. */
        filterDefinitions: {
            type: Object,
            default: () => ({}),
        },
        quickFilterDefinitions: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            filterDef: {},
            filters: [],
            expansionPanel: 0,
            selectedFilterIndex: undefined,
        };
    },
    mounted() {
        const filtersData = this.modelData.filters ? this.modelData.filters[0] : null;
        this.filterDef = this.filterDefinitions;
        this.filters = this.filterDefinitions ? [...Object.keys(this.filterDefinitions)] : [];
        const dynamicFilterNames = this.getDynamicFilters(this.filterDefinitions);
        // Set Dynamic Filters data coming from API.
        dynamicFilterNames.forEach((value) => {
            const currValDataPoint = this.filterDefinitions[value].fetchFromApiData;
            const result = filtersData.filter((data) => Object.keys(data)[0] === currValDataPoint);

            this.setDynamicFilterData(result[0], currValDataPoint, value);
        });
    },
    methods: {
        enableChildFilterState(data) {
            const { childFiltersId } = this.filterDef[data.id];
            const hasChildFilter = childFiltersId?.length > 0 || false;
            if (hasChildFilter) { // Should enable child filters by changing disableState to false
                childFiltersId.forEach((value) => {
                    this.filterDef[value].disableState = false;
                    this.filterDef[value].parentValue = data.value;
                });
            }
        },
        setDynamicFilterData(apiData, dataPointName, filterName) {
            this.filterDef[filterName].listItems = [
                ...this.filterDef[filterName].listItems,
                ...apiData[dataPointName],
            ];
        },
        emitResetFilter() {
            this.resetCustomFilters();
            this.selectedFilterIndex = undefined;
            this.$emit('reset-filter');
        },
        filtersChanged(val, name) {
            const data = {
                id: name,
                value: val,
            };
            const { parentValue } = this.filterDef[data.id];
            if (parentValue) {
                data.value = `${parentValue}${val}`;
            }
            this.selectedFilterIndex = undefined;
            this.enableChildFilterState(data);
            this.$emit('updated-filters', data);
        },
        getDynamicFilters(filterDef) {
            const result = [];
            this.filters.forEach((filter) => {
                if (!filterDef[filter].dynamic) return;
                result.push(filter);
            });
            return result;
        },
        onQuickFilterChange() {
            if (this.selectedFilterIndex !== undefined) {
                const selectedKey = Object
                    .keys(this.quickFilterDefinitions)[this.selectedFilterIndex];
                const selectedQuickFilterDef = this.quickFilterDefinitions[selectedKey];
                const data = {
                    id: selectedKey,
                    value: selectedQuickFilterDef.apiParam,
                    isQuickFilter: true,
                };
                this.resetCustomFilters();
                this.$emit('updated-filters', data);
            } else {
                this.emitResetFilter();
            }
        },
        resetCustomFilters() {
            const filterKeys = Object.keys(this.filterDef);
            filterKeys.forEach((key) => {
                this.filterDef[key].placeholderLabelId = '';
                if ('disableState' in this.filterDef[key]) {
                    this.filterDef[key].disableState = !this.filterDef[key].disableState;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;
// Mixin
@mixin applyIcon($url) {
    background-image: url($url);
    height: 20px;
    width: 20px;
}

.header {
    &__text {
        font-size: 14px;
    }
}

.title {
    margin: 10px;
    &__text {
        font-size: 18px;
        font-weight: 500;
    }
}

.rating-title {
    display: block;
    margin-bottom: 20px;
}

.ratings {
    width: 100%;
    display: inline-flex;
    margin: 0;
    height: 20px;

    & > div {
        margin: 0;
    }

    &__star-rating {
        @include applyIcon('@/assets/star_rating.svg')
    }
}

.v-expansion-panel-content__wrap .v-btn {
    &--active {
        background-color: mixin.$wal-color-light-blue;
        color: mixin.$wal-color-white;
    }
}

</style>

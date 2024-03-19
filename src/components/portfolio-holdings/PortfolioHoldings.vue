<template>
    <div class="portfolio-holdings">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Portfolio Holdings</h2>
            </v-col>
        </v-row>
        <v-row v-if="hasPreferenceAlignedPercentage">
            <v-col>
                <h3 class="subtitle-1 font-weight-bold d-inline-flex">
                    Portion of Portfolio Aligned
                </h3>
                <div
                    role="img"
                    title="User Preference Logo"
                    class="d-inline-flex justify-center user-preference-badge">
                    <span class="user-preference-badge__text">
                        {{modelData.preferenceAlignedPercentage}}%
                    </span>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-tabs
                    v-if="showTabs"
                    v-model="selectedTab"
                    background-color="transparent"
                    color="black"
                    show-arrows>
                    <v-tab
                        class="portfolio-holdings-btn"
                        v-for="item in tabs"
                        :key="item">{{ tabsMapping[item] }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="selectedTab">
                    <v-tab-item
                        v-for="tab in tabs"
                        :key="tab">
                        <v-row>
                            <v-col>
                                <v-data-table
                                    :headers="selectedFieldDefinitions"
                                    :items="parsedModelData"
                                    :item-key="fieldDefinitions.stockOverlap ?
                                        fieldDefinitions.stockOverlap[0].value : 'name'"
                                    :items-per-page="5"
                                    :show-expand="tab === 'stockOverlap'"
                                    no-data-text="No Data Available">
                                    <template v-slot:[`item.preferenceAligned`]="{ value }">
                                        <div
                                            v-if="value !== '-'"
                                            class="d-inline-flex user-preference">
                                            <div
                                                role="img"
                                                title="User Preference Logo"
                                                class="user-preference__logo">
                                            </div>
                                        </div>
                                        <div v-else class="userPreference">{{ value }}</div>
                                    </template>
                                    <template v-slot:expanded-item="{ item }"
                                        v-if="fieldDefinitions.stockOverlap">
                                        <td>
                                            <ul>
                                                <li v-for="child in item.childRows"
                                                   :key="child.name"></li>
                                            </ul>
                                        </td>
                                        <td v-for="index in fieldDefinitions.stockOverlap.length"
                                            :key="index">
                                            <ul>
                                                <li v-for="child in item.childRows"
                                                   :key="child.name">
                                                   {{ child[fieldDefinitions.stockOverlap[index - 1]
                                                        .value] }}
                                                </li>
                                            </ul>
                                        </td>
                                    </template>
                                    <template v-if="hasPreferenceAlignedPercentage" v-slot:footer.prepend>
                                        <div class="preferences d-inline-block ml-6">
                                            <img src="@/assets/badge.svg" class="badge" width="12" height="15" />
                                            <span>Investments aligned with my selected preferences.</span>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import outputMapping from '@/components/portfolio-holdings/config/mapping.json';
import { get } from 'lodash';
import fieldDefinitions from '@/components/portfolio-holdings/config/fieldDefinitions.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    props: {
        /** Define the table columns. */
        fieldDefinitions: {
            type: Object,
            default: () => fieldDefinitions.emea,
        },
        /** Displays Top Net Underlying Holdings. */
        maxTopNetUnderlyingHoldingsNumber: {
            type: Number,
            default: 10,
        },
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Array, Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Show or hide tabs. */
        showTabs: {
            type: Boolean,
            default: true,
        },
        tabs: {
            type: Array,
            default: () => ['topHoldings', 'topUnderlyingHoldings', 'stockOverlap'],
        },
    },
    data() {
        return {
            expanded: [],
            selectedTab: 0,
            tabsMapping: outputMapping.tabs,
            numberOfStockHoldings: 0,
        };
    },
    computed: {
        hasPreferenceAlignedPercentage() {
            return Object.keys(this.modelData) && this.modelData.preferenceAlignedPercentage;
        },
        parsedModelData() {
            if (this.modelData) {
                const selectedTab = this.tabs[this.selectedTab];
                if (selectedTab === 'topHoldings') {
                    return this.getTopHoldingsModelData();
                }
                if (selectedTab === 'topUnderlyingHoldings') {
                    return this.getTopNetUnderlyingHoldings();
                }
                if (selectedTab === 'stockOverlap') {
                    return this.getStockOverlapModelData();
                }
            }
            return {};
        },
        selectedFieldDefinitions() {
            const selectedTab = this.tabs[this.selectedTab];
            return this.fieldDefinitions[selectedTab];
        },
    },
    methods: {
        getRows(holding, currentField) {
            return this.fieldDefinitions[currentField].reduce((preValue, currValue) => {
                let field;
                if (typeof holding[currValue.value] === 'number') {
                    field = this.formatNumber(holding[currValue.value]);
                } else {
                    field = holding[currValue.value] || '-';
                }
                return {
                    ...preValue,
                    [currValue.value]: field,
                };
            }, {});
        },
        getStockOverlapModelData() {
            const newStockOverlap = [];
            const stockHoldings = get(this.modelData, 'stockOverlap', []);
            this.numberOfStockHoldings = stockHoldings.length;
            stockHoldings.forEach((stockHolding) => {
                const stockOverlapObject = this.getStockOverlapObject(stockHolding);
                newStockOverlap.push(stockOverlapObject);
            });
            return newStockOverlap;
        },
        getStockOverlapObject(stockHolding) {
            const stockOverlapObject = this.getRows(stockHolding, 'stockOverlap');
            stockOverlapObject.childRows = [];
            stockHolding.parentHoldings.forEach((parentHolding) => {
                const currParentHolding = parentHolding;
                currParentHolding.sectorKey = currParentHolding?.sectorName;
                const stockOverlapParentObject = this.getRows(currParentHolding, 'stockOverlap');
                stockOverlapObject.childRows.push(stockOverlapParentObject);
            });
            return stockOverlapObject;
        },
        getTopHoldingsModelData() {
            const holdings = get(this.modelData, 'topHoldings', []);
            return holdings.map((holding) => this.getRows(holding, 'topHoldings'));
        },
        getTopNetUnderlyingHoldings() {
            const sectorMapping = outputMapping.topNetUnderlyingHoldings.sector;
            const securityTypeMapping = outputMapping.topNetUnderlyingHoldings.securityType;
            const underlyingHoldings = get(this.modelData, 'topUnderlyingHoldings', []);
            underlyingHoldings.sort((v1, v2) => {
                const w1 = v1.weight;
                const w2 = v2.weight;
                if (w1 > w2) {
                    return -1;
                }
                if (w1 < w2) {
                    return 1;
                }
                return 0;
            });
            const newUnderlyingHoldings = underlyingHoldings
                .slice(0, this.maxTopNetUnderlyingHoldingsNumber);
            const newUnderlyingHoldingsData = newUnderlyingHoldings.map((holding) => {
                const holdingData = holding;
                holdingData.sector = sectorMapping[holdingData.globalSectorId];
                holdingData.securityType = securityTypeMapping[holdingData.securityType];
                return holdingData;
            });
            return newUnderlyingHoldingsData.map((holding) => this.getRows(holding, 'topUnderlyingHoldings'));
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.portfolio-holdings {
    @include mixin.wal-component-title;
    @include mixin.wal-component-subtitle(false, true, true);
    @include mixin.wal-table;

    // constants
    $badge-size: 75px;

    .user-preference-badge {
        height: $badge-size;
        width: $badge-size;
        background-image: url("@/assets/badge.svg");

        &__text {
            font-size: map.get(mixin.$wal, 'font-size', 'xs');
            align-self: center;
            color: mixin.$wal-color-white;
        }
    }
    table {
        .user-preference {
            margin: map.get(mixin.$wal, "space", "1-and-a-quarter-x");

            &__logo {
                @include mixin.applyIcon("@/assets/badge.svg");
            }
        }
        td ul {
            list-style: none;
            padding-left: 0;
            li {
                padding: map.get(mixin.$wal, 'space', '1-x') 0;
            }
        }
        td:last-child ul {
            text-align: end;
        }
    }
    .preferences * {
        vertical-align: middle;
    }
}
</style>

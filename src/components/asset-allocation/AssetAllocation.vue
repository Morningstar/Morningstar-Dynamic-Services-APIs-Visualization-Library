<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Asset Allocation</h2>
            </v-col>
        </v-row>
        <v-row
            v-if="!isDataAvailable"
            class="text-center">
            <v-col> No Data Available </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-tabs
                    v-model="selectedTab" color="#000000" right
                    @change="$emit('tab-change', { tabId: tabs[selectedTab] });"
                >
                    <v-tab v-for="tab in tabs" :key="tab">
                        {{ tab }}
                    </v-tab>
                </v-tabs>
            <v-tabs-items v-model="selectedTab">
                <v-tab-item v-for="tab in tabs" :key="tab">
                    <v-row>
                        <v-col lg="6" class="asset-class-chart-wrapper">
                            <DoughnutChart
                                v-show="!isStackChartVisible"
                                ref="pieChart"
                                :chart-data="computedPieChartData"
                                :width="200"
                                :height="200"
                            />
                            <StackChart
                                ref="bar"
                                v-show="isStackChartVisible"
                                :chart-data="computedStackChartData"
                                :width="160"
                                :height="288"
                            />
                        </v-col>
                        <v-col lg="6">
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead class="header">
                                        <tr>
                                            <th class="text-left">
                                                <span class="header__text">
                                                    {{
                                                        isStackChartVisible
                                                            ? tableLabel
                                                                  .StackChart[0]
                                                            : tableLabel
                                                                  .pieChart[0]
                                                    }}
                                                </span>
                                            </th>
                                            <th class="text-right">
                                                <span class="header__text">
                                                    {{
                                                        isStackChartVisible
                                                            ? tableLabel
                                                                  .StackChart[1]
                                                            : tableLabel
                                                                  .pieChart[1]
                                                    }}
                                                </span>
                                            </th>
                                            <th
                                                class="text-right"
                                            >
                                                <span class="header__text">
                                                    {{
                                                        isStackChartVisible
                                                            ? tableLabel
                                                                  .StackChart[2]
                                                            : tableLabel
                                                                  .pieChart[2]
                                                    }}
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in parsedModelData"
                                            :key="item.key"
                                        >
                                            <td class="text-left">
                                                <span
                                                    class="asset-class__icon"
                                                    :style="{
                                                        'border-color':
                                                            pieChartColors[index],
                                                    }"
                                                ></span>
                                                <span
                                                    class="asset-class__label"
                                                    >{{ item.assetClass }}</span
                                                >
                                            </td>
                                            <td class="text-right">
                                                {{isStackChartVisible
                                                        ? formatNumber(item.long)
                                                        : formatNumber(item.net)
                                                }}
                                            </td>
                                            <td
                                                class="text-right"
                                            >
                                                {{ getBenchmarkData(item) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs-items>
            </v-col>
        </v-row>
        <v-row v-if="showBreakdown && isDataAvailable">
            <v-btn plain @click="$emit('show-security-level-breakdown', {
                type: 'asset-allocation',
                modelData: parsedBreakdownData,
                fields: assetAllocationMapping.breakdown.fields,
                assetAllocationMapping: assetAllocationMapping,
            })">
                View Details
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-row>
    </div>
</template>

<script>
import DoughnutChart from '@/components/shared/DoughnutChart.vue';
import ComponentMixin from '@/components/component-helper-mixin';
import StackChart from '@/components/asset-allocation/StackChart.vue';

export default {
    mixins: [ComponentMixin],
    components: {
        StackChart,
        DoughnutChart,
    },
    props: {
        /** Define the asset allocation mapping */
        assetAllocationMapping: {
            type: Object,
            default: () => ({}),
        },
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: Object,
        },
        /** Toggles security breakdown button. */
        showBreakdown: {
            type: Boolean,
            default: false,
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            pieChartColors: [
                '#4daf4a',
                '#377eb8',
                '#ff7f00',
                '#984ea3',
                '#e41a1c',
                '#a41b1c',
            ],
            StackChartColors: [
                'rgba(77, 175, 74, 0.2)',
                'rgba(55, 126, 184, 0.2)',
                'rgba(255, 127, 0, 0.2)',
                'rgba(152, 78, 163, 0.2)',
                'rgba(228, 26, 28, 0.2)',
                'rgba(164, 27, 28, 0.2)',
            ],
            selectedTab: 0,
            tabs: ['Pie Chart', 'Bar Chart'],
            tableLabel: {
                pieChart: ['Asset Class', 'Net %', 'Benchmark %'],
                StackChart: ['Asset Class', 'Long %', 'Short %'],
            },
        };
    },
    computed: {
        isDataAvailable() {
            return (this.modelData?.portfolio?.length || this.modelData?.benchmark?.length);
        },
        parsedBreakdownData() {
            const {
                assetAllocation,
                securityBreakdownData,
            } = this.modelData.breakdownData;
            const securityBreakdown = [];
            const portfolioAnalyzed = [];
            const assetAllocationType = this.assetAllocationMapping
                .assetAllocationTypeMapping[assetAllocation.Id];
            const assetAllocationTypeMap = this.assetAllocationMapping
                .breakdown.mapping[assetAllocationType];
            const portfolioAnalyzedPercent = assetAllocation.PortfolioAnalyzed;
            securityBreakdownData.forEach((security) => {
                const securityName = security?.Name;
                const weight = security?.Weight;
                const analyzedPercent = security.Analyzed;
                const notAnalyzedPercent = security.NotAnalyzed;
                const formattedBreakdown = this.formatObject(
                    security.AssetClass || [],
                    assetAllocationType,
                    assetAllocationTypeMap,
                );
                if (formattedBreakdown && Object.keys(formattedBreakdown).length > 0) {
                    securityBreakdown.push({
                        securityName,
                        weight,
                        ...formattedBreakdown,
                    });
                }
                portfolioAnalyzed.push({
                    securityName,
                    analyzedPercent,
                    notAnalyzedPercent,
                    weight,
                });
            });
            return {
                ...this.modelData,
                securityBreakdown,
                portfolioAnalyzed,
                portfolioAnalyzedPercent,
                assetAllocationType,
            };
        },
        parsedModelData() {
            if (this.isDataAvailable && Object.keys(this.assetAllocationMapping).length !== 0) {
                const assetAllocationRawData = this.modelData;
                const assetObject = this.assetAllocationMapping
                    .assetAllocation[this.assetAllocationMapping.default];
                return Object.entries(assetObject)
                    .map((itemArr) => {
                        const number = itemArr[0];
                        const { portfolio, benchmark } = assetAllocationRawData;
                        return {
                            key: itemArr[1],
                            assetClass: itemArr[1],
                            bmark: this.getAssetAllocationValue(number, benchmark).net,
                            long: this.getAssetAllocationValue(number, portfolio).long,
                            short: this.getAssetAllocationValue(number, portfolio).short,
                            net: this.getAssetAllocationValue(number, portfolio).net,
                        };
                    });
            }
            return [];
        },
        isStackChartVisible() {
            return this.selectedTab === 1;
        },
        computedPieChartData() {
            const labels = [];
            const data = [];
            this.parsedModelData.forEach((item) => {
                labels.push(item.assetClass);
                data.push(this.formatNumber(item.net));
            });
            return {
                labels,
                datasets: [
                    {
                        backgroundColor: this.pieChartColors,
                        data,
                    },
                ],
            };
        },
        computedStackChartData() {
            const labels = [];
            const data = [
                {
                    data: [],
                    label: 'Long',
                    borderColor: this.pieChartColors,
                    backgroundColor: this.StackChartColors,
                    order: 1,
                },
                {
                    data: [],
                    label: 'Net',
                    borderColor: this.pieChartColors,
                    backgroundColor: this.pieChartColors,
                    order: 3,
                },
                {
                    data: [],
                    label: 'Short',
                    borderColor: this.pieChartColors,
                    backgroundColor: this.StackChartColors,
                    order: 2,
                },
            ];
            this.parsedModelData.forEach((item) => {
                labels.push(item.assetClass);
                data[0].data.push(this.formatNumber(item.long));
                data[1].data.push(this.formatNumber(item.net));
                data[2].data.push(this.formatNumber(item.short));
            });
            return {
                labels,
                datasets: data,
            };
        },
    },
    methods: {
        formatObject(data, assetAllocationType, assetAllocationTypeMap) {
            return data?.reduce((newValue, currentValue) => {
                const key = `${assetAllocationType}_${assetAllocationTypeMap[currentValue.Id]}`;
                const value = currentValue.Net.toFixed(2);
                return {
                    ...newValue,
                    [key]: value,
                };
            }, {});
        },
        getAssetAllocationValue(value, assetAllocationData) {
            if (!assetAllocationData) { return false; }
            const data = assetAllocationData.find(
                (item) => item.key === value,
            ) || {};
            return data;
        },
        getBenchmarkData(item) {
            if (this.isStackChartVisible) {
                return this.formatNumber(item.short * 1);
            }
            return this.formatNumber(item.bmark);
        },
    },
};
</script>

<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;

.asset-class {
    $icon-size: map.get(mixin.$wal, space, '1-and-a-quarter-x');

    &-chart-wrapper {
        margin-top: map.get(mixin.$wal, space, '1-and-a-quarter-x');
    }

    &__icon {
        width: $icon-size;
        height: $icon-size;
        display: inline-block;
        border-radius: 100%;
        border: solid 3px;
        margin-right: map.get(mixin.$wal, space, 'half-x');
    }

    &__label {
        font-weight: 500;
    }
}
.chart-container {
    text-align: center;
    margin: auto;
}
</style>

<template>
    <div class="security-breakdown">
        <v-container fluid>
            <v-row>
                <v-btn
                    ref="backToSummary"
                    class="back-to-summary" plain @click="$emit('show-xray')">
                    <v-icon>mdi-chevron-left</v-icon>
                    Back to Summary
                </v-btn>
            </v-row>
            <section>
                <v-row>
                    <v-col cols="12" v-if="hasModelData">
                        <component
                            class="portfolio__component"
                            :is="type"
                            v-bind="breakdownProps"
                            :show-breakdown="false"
                        />
                    </v-col>
                    <v-col v-else class="text-center">
                        No Data Available
                    </v-col>
                </v-row>
            </section>
            <section>
                <v-row>
                    <v-col cols="12" class="title">
                        <h2>Security Breakdown</h2>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" v-if="modelData
                            && modelData.securityBreakdown
                            && modelData.securityBreakdown.length">
                        <v-tabs
                            v-if="showTabs"
                            v-model="selectedTab"
                            color="#000000"
                            show-arrows
                            right
                            @change="$emit('tab-change', { tabId: fields.tabs[selectedTab] });">
                            <v-tab v-for="tab in fields.tabs" :key="tab">
                                {{mappings.dataPoints[tab]}}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items
                            v-if="showTabs"
                            v-model="selectedTab">
                            <v-tab-item
                                v-for="tab in fields.tabs"
                                :key="tab">
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead class="header">
                                        <tr>
                                            <th
                                                v-for="(field, index) in parsedBreakdownFields"
                                                :class="[field === 'securityName'
                                                        ? 'text-left'
                                                        : 'text-right']"
                                                :key="index">
                                            <span class="header__text">
                                                {{ mappings.dataPoints[field] }}
                                            </span>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr
                                            v-for="security in modelData.securityBreakdown"
                                            :key="security.securityName">
                                            <td
                                                v-for="(field, index) in parsedBreakdownFields"
                                                    :class="[field === 'securityName'
                                                        ? 'text-left'
                                                        : 'text-right']"
                                                    :key="index">
                                                {{ security[field] }}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-tab-item>
                        </v-tabs-items>
                        <v-simple-table v-else>
                            <template v-slot:default>
                                <thead class="header">
                                <tr>
                                    <th
                                        v-for="(field, index) in parsedBreakdownFields"
                                        :class="[field === 'securityName'
                                                ? 'text-left'
                                                : 'text-right']"
                                        :key="index">
                                    <span class="header__text">
                                        {{ mappings.dataPoints[field] }}
                                    </span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr
                                    v-for="security in modelData.securityBreakdown"
                                    :key="security.securityName">
                                    <td
                                        v-for="(field, index) in parsedBreakdownFields"
                                            :class="[field === 'securityName'
                                                ? 'text-left'
                                                : 'text-right']"
                                            :key="index">
                                        {{ security[field] }}
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                    <v-col v-else class="text-center">
                        No Data Available
                    </v-col>
                </v-row>
            </section>
            <section>
                <v-row>
                    <v-col cols="12" class="title">
                        <h2 class="title__text">Percentage of Portfolio Analyzed</h2>
                    </v-col>
                </v-row>
                <v-row v-if="modelData
                            && modelData.portfolioAnalyzed
                            && modelData.portfolioAnalyzed.length">
                    <v-col cols="12" sm="4">
                        <DoughnutChart
                            :chart-data="chartData"
                            :chart-options="analyzedChartOptions"/>
                    </v-col>
                    <v-col cols="12" sm="8">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead class="header">
                                    <tr>
                                        <th
                                            v-for="(field, index) in [
                                                'securityName',
                                                'analyzedPercent',
                                                'notAnalyzedPercent',
                                                'weight'
                                            ]"
                                            :class="[field === 'securityName'
                                                ? 'text-left'
                                                : 'text-right']"
                                            :key="index"
                                        >
                                            <span class="header__text">
                                                {{ mappings.dataPoints[field] }}
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr
                                    v-for="security in modelData.portfolioAnalyzed"
                                    :key="security.securityName">
                                    <td
                                        v-for="item in Object.keys(security)"
                                        :class="[item === 'securityName' ?
                                         'text-left' : 'text-right']"
                                        :key="item">
                                        {{ security[item] }}
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col class="text-center">
                        No Data Available
                    </v-col>
                </v-row>
            </section>
            <section>
                <v-row>
                    <v-col cols="12" class="title">
                        <h2 class="title__text">
                            Securities not included due to insufficient or inapplicable data:</h2>
                    </v-col>
                </v-row>
                <v-row v-if="invalidSecurities && invalidSecurities.length">
                    <v-col cols="12">
                        <span> {{ invalidSecurities.join(', ') }} </span>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col class="text-center">
                        There is no invalid security available in the portfolio.
                    </v-col>
                </v-row>
            </section>
        </v-container>
    </div>
</template>

<script>
import { isEmpty } from 'lodash';
import AssetAllocation from '@/components/asset-allocation/AssetAllocation.vue';
import FeesExpenses from '@/components/fees-expenses/FeesExpenses.vue';
import StockRegions from '@/components/stock-regions/StockRegions.vue';
import StockSectors from '@/components/stock-sectors/StockSectors.vue';
import StockStats from '@/components/stock-stats/StockStats.vue';
import StockType from '@/components/stock-type/StockType.vue';
import DoughnutChart from '@/components/shared/DoughnutChart.vue';
import mappings from '@/components/security-level-breakdown/config/mappings.json';

export default {
    components: {
        DoughnutChart,
        AssetAllocation,
        FeesExpenses,
        StockRegions,
        StockSectors,
        StockStats,
        StockType,
    },
    props: {
        /** Type of the component of which security breakdown is shown. */
        type: String,
        /** Security breakdown table fields */
        invalidSecurities: Array,
        /** Accepts the props object. */
        breakdownProps: [Array, Object],
    },
    data() {
        return {
            mappings,
            selectedTab: 0,
            fields: this.breakdownProps.fields,
            modelData: this.breakdownProps.modelData,
            analyzedChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                borderWidth: 0,
            },
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$el.scrollIntoView({ behavior: 'smooth' });
        });
    },
    computed: {
        parsedBreakdownFields() {
            if (this.type === 'asset-allocation') {
                return this.fields[this.modelData?.assetAllocationType];
            }
            if (this.showTabs) {
                return this.fields[this.fields.tabs[this.selectedTab]];
            }
            return this.fields;
        },
        showTabs() {
            return this.fields.tabs?.length > 0;
        },
        chartData() {
            const length = this.modelData?.portfolioAnalyzed?.length || 0;
            let averageAnalyzedPercent = 0;
            let averageNotAnalyzedPercent = 0;
            if (length) {
                const analyzedPercent = this.modelData?.portfolioAnalyzed
                    ?.reduce((sum, security) => (sum + security.analyzedPercent), 0);
                averageAnalyzedPercent = analyzedPercent / length;
                const notAnalyzedPercent = this.modelData?.portfolioAnalyzed
                    ?.reduce((sum, security) => (sum + security.notAnalyzedPercent), 0);
                averageNotAnalyzedPercent = notAnalyzedPercent / length;
                return {
                    labels: [
                        'Analyzed',
                        'Not Analyzed',
                    ],
                    datasets: [
                        {
                            backgroundColor: [
                                '#4daf4a',
                                '#E5E5E5',
                            ],
                            data: [
                                averageAnalyzedPercent || 0,
                                averageNotAnalyzedPercent || 0,
                            ],
                        },
                    ],
                };
            }
            return null;
        },
        hasModelData() {
            return !isEmpty(this.modelData);
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
.security-breakdown {
    @include mixin.border(mixin.$wal-color-black, top, 2px);
}
.security-breakdown section {
    width: 90%;
    margin: map.get(mixin.$wal, 'space', '1-and-a-half-x') auto;
}
.security-breakdown .back-to-summary {
    margin-bottom: map.get(mixin.$wal, 'space', '2-x');
}
</style>

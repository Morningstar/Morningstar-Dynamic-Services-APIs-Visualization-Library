<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Stock Stats</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-center" v-if="!modelData"> No data available </v-col>
            <v-col cols="12" v-else>
                <v-simple-table>
                    <template v-slot:default>
                        <thead class="header">
                            <tr>
                                <th class="text-left">
                                    <span class="header__text">Name</span>
                                </th>
                                <th class="text-right">
                                    <span class="header__text">Portfolio</span>
                                </th>
                                <th class="text-right">
                                    <span class="header__text">Benchmark</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in parsedModelData" :key="index">
                                <td class="text-left">{{ item.key }}</td>
                                <td class="text-right">{{ item.portfolio }}</td>
                                <td class="text-right">{{ item.benchmark }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row v-if="showBreakdown">
            <v-btn
                plain
                @click="
                    $emit('show-security-level-breakdown', {
                        type: 'stock-stats',
                        modelData: breakdownData,
                        fields: mapping.breakdownFields,
                        dataPoints: dataPoints,
                    })
                "
            >
                View Details
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-row>
    </div>
</template>

<script>
import { get } from 'lodash';
import mapping from '@/components/stock-stats/config/mapping.json';
import dataPoints from '@/components/stock-stats/config/dataPoints.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    props: {
        /** To show data for specified data point. */
        dataPoints: {
            type: Object,
            default: () => dataPoints.emea,
        },
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Array, Object],
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
            mapping,
        };
    },
    computed: {
        parsedModelData() {
            const { modelData } = this;
            const stockStatisticsData = modelData;
            const keys = Object.keys(this.dataPoints);
            return keys.map((key) => {
                const dataPoint = key;
                return {
                    key: this.dataPoints[dataPoint],
                    portfolio: this.formatNumber(get(stockStatisticsData.portfolio, `${dataPoint}`, null)),
                    benchmark: this.formatNumber(get(stockStatisticsData.benchmark, `${dataPoint}`, null)),
                };
            });
        },
        breakdownData() {
            const { securityBreakdownData } = this.modelData.breakdownData;
            let securityBreakdown = {};
            if (securityBreakdownData) {
                const breakdown = {};
                securityBreakdownData.forEach((
                    {
                        SecurityId, Name, Weight, PriceRatiosItem, ProfitabilityItem,
                        EquityStyleItem, EquityStyleBreakdown, Analyzed, NotAnalyzed,
                    },
                ) => {
                    if (SecurityId) {
                        if (!(SecurityId in breakdown)) {
                            breakdown[SecurityId] = {};
                        }
                        Object.assign(breakdown[SecurityId], {
                            Analyzed,
                            NotAnalyzed,
                            SecurityId,
                            Name,
                            Weight,
                            ...PriceRatiosItem,
                            ...ProfitabilityItem,
                            ...EquityStyleItem,
                            ...EquityStyleBreakdown,
                        });
                    }
                });
                securityBreakdown = this.getSecurityLevelBreakdown(
                    Object.values(breakdown),
                );
            }
            return securityBreakdown;
        },
    },
    methods: {
        getSecurityLevelBreakdown(breakdown) {
            const securityBreakdown = [];
            const portfolioAnalyzed = [];
            let formattedBreakdown = {};
            breakdown.forEach((security) => {
                const securityName = security?.Name;
                const weight = security?.Weight;
                const analyzedPercent = this.formatNumber(security?.Analyzed) * 1 || 0;
                const notAnalyzedPercent = this.formatNumber(security?.NotAnalyzed) * 1 || 0;
                formattedBreakdown = {
                    priceEarnings: this.formatNumber(security.PriceEarnings),
                    priceBook: this.formatNumber(security.PriceBook),
                    roa: this.formatNumber(security.ROA),
                    roe: this.formatNumber(security.ROE),
                    averageMarketCap: this.formatNumber(security.AverageMarketCap),
                };
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
            };
        },
    },
};
</script>
<style lang="scss" scoped>
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;
</style>

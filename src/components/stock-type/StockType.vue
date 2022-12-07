<template>
    <div class="stock-type">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Stock Type</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead class="header">
                            <tr>
                                <th class="text-left">
                                    <span class="header__text">% of Stocks</span>
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
                                <td :class="['text-left', item.key]">{{ item.name }}</td>
                                <td class="text-right">{{ (item.portfolio) }}</td>
                                <td class="text-right">{{ (item.benchmark) }}</td>
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
                        type: 'stock-type',
                        modelData: parsedBreakdownData,
                        fields: mapping.breakdownFields,
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
import { get, camelCase, lowerFirst } from 'lodash';
import mapping from '@/components/stock-type/config/mapping.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    props: {
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
            mapping,
        };
    },
    computed: {
        parsedModelData() {
            const { stockTypeData } = this.modelData;
            const portfolioData = get(stockTypeData, 'Portfolio', []);
            const benchmarkData = get(stockTypeData, 'Benchmark', []);
            const parsedData = {
                portfolio: portfolioData.reduce((newObj, currentObj) => (
                    { ...newObj, [currentObj.Id]: currentObj.Value }), {}),
                benchmark: benchmarkData.reduce((newObj, currentObj) => (
                    { ...newObj, [currentObj.Id]: currentObj.Value }), {}),
            };

            const keys = Object.keys(mapping.dataPoints);
            return keys.map((key) => {
                const dataPoint = key;
                return {
                    key: camelCase(key),
                    name: mapping.dataPoints[dataPoint],
                    portfolio: this.formatNumber(get(parsedData, `portfolio.${dataPoint}`)) || '-',
                    benchmark: this.formatNumber(get(parsedData, `benchmark.${dataPoint}`)) || '-',
                };
            });
        },
        parsedBreakdownData() {
            const { securityBreakdownData } = this.modelData.breakdownData;
            let securityBreakdown = {};
            if (this.showBreakdown) {
                securityBreakdown = this.getSecurityLevelBreakdown(
                    Object.values(securityBreakdownData),
                );
            }
            return securityBreakdown;
        },
    },
    methods: {
        getSecurityLevelBreakdown(breakdown) {
            const securityBreakdown = [];
            const portfolioAnalyzed = [];
            breakdown.forEach((security) => {
                const securityName = security?.Name;
                const weight = security?.Weight;
                const analyzedPercent = security.Analyzed.toFixed(2) * 1;
                const notAnalyzedPercent = security.NotAnalyzed.toFixed(2) * 1;
                const formattedBreakdown = this.formatObject(security.EquityTypeBreakdownItem);
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
        formatObject(data) {
            return data?.reduce((newValue, currentValue) => {
                const key = lowerFirst(currentValue.Id);
                const value = this.formatNumber(currentValue.Value);
                return {
                    ...newValue,
                    [key]: value,
                };
            }, {});
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

// Constants
$space-2-and-a-quarter-x: map.get(mixin.$wal, 'space', '2-and-a-quarter-x');
$space-half-x: map.get(mixin.$wal, 'space', 'half-x');
$image: '@/components/stock-type/assets/stockType.png';

$icon-mappings: (
    "highYield": (x: -18px, y: bottom),
    "distressed": (x: 0, y: bottom),
    "hardAsset": (x: right, y: -22px),
    "cyclical": (x: 0, y: 0),
    "slowGrowth": (x: -146px, y: -22px),
    "classicGrowth": (x: -128px, y: -22px),
    "aggressiveGrowth": (x: -110px, y: -22px),
    "speculativeGrowth": (x: -165px, y: -22px),
);

@include mixin.wal-component-title;
@include mixin.wal-table;
.stock-type {
    @each $name, $positions in $icon-mappings {
        .#{$name} {
            display: flex;
            align-items: center;

            &::before {
                content: '';
                display: inline-block;
                vertical-align: bottom;
                width: $space-2-and-a-quarter-x;
                height: $space-2-and-a-quarter-x;
                background: url($image) no-repeat;
                margin-right: $space-half-x;
                background-position-x: map-get($positions, 'x');
                background-position-y: map-get($positions, 'y');
            }
        }
    }

    .notAvailable {
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            vertical-align: bottom;
            background: mixin.$wal-color-black;
            width: $space-2-and-a-quarter-x;
            height: $space-2-and-a-quarter-x;
            margin-right: $space-half-x;
        }

        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            left: 30px;
            width: 14px;
            height: map.get(mixin.$wal, 'space', 'quarter-x');
            background: mixin.$wal-color-white;
        }
    }
}
</style>

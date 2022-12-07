<template>
    <div class="stock-sectors">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Stock Sectors</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="fieldDefinitions"
                    :items="parsedModelData"
                    :item-class="rowClass"
                    :items-per-page="-1"
                    :disable-sort="true"
                    hide-default-footer>
                    <template v-slot:[`item.name`] ="{ value }">
                        <div :class="value">
                            {{ nameMapping[value] }}
                        </div>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row v-if="showBreakdown">
            <v-btn plain @click="$emit('show-security-level-breakdown', {
                type: 'stock-sectors',
                modelData: breakdownData,
                fields: breakdownFields,
            })">
                View Details
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-row>
    </div>
</template>

<script>
import { get, lowerFirst } from 'lodash';
import outputMapping from '@/components/stock-sectors/config/mapping.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    props: {
        /** Define the table columns. */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    text: 'Sector Type',
                    value: 'name',
                },
                {
                    text: 'Weight %',
                    value: 'portfolio',
                    align: 'end',
                },
                {
                    text: 'Benchmark %',
                    value: 'benchmark',
                    align: 'end',
                },
            ],
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
            breakdownFields: outputMapping.breakdownFields,
            nameMapping: outputMapping.nameMapping,
            sectorTypes: ['cyclical', 'sensitive', 'defensive'],
        };
    },
    computed: {
        parsedModelData() {
            if (this.modelData) {
                let stockSectorsData = [];
                const portfolioData = get(this.modelData, 'portfolio', null);
                const benchmarkData = get(this.modelData, 'benchmark', null);
                const mapping = outputMapping.stockSectors;
                this.sectorTypes.forEach((key) => {
                    const breakdown = [];
                    const mappingKey = mapping[key];
                    let netPortfolio = 0;
                    let netBenchmark = 0;

                    Object.values(mappingKey).forEach((dataKey) => {
                        netPortfolio += portfolioData?.[dataKey] || 0;
                        netBenchmark += benchmarkData?.[dataKey] || 0;
                        breakdown.push({
                            name: lowerFirst(dataKey),
                            portfolio: portfolioData ? this.formatNumber(portfolioData[dataKey]) : '-',
                            benchmark: benchmarkData ? this.formatNumber(benchmarkData[dataKey]) : '-',
                        });
                    });
                    breakdown.unshift({
                        name: key,
                        portfolio: this.formatNumber(netPortfolio) || '-',
                        benchmark: this.formatNumber(netBenchmark) || '-',
                        highlight: true,
                    });
                    stockSectorsData = [...stockSectorsData, ...breakdown];
                });
                return stockSectorsData;
            }
            return [];
        },
        breakdownData() {
            const { securityBreakdownData } = this.modelData.breakdownData;
            let securityBreakdown = {};
            if (securityBreakdownData) {
                securityBreakdown = this.getSecurityLevelBreakdown(securityBreakdownData);
            }
            return securityBreakdown;
        },
    },
    methods: {
        formatObject(data) {
            return data?.reduce((newValue, currentValue) => ({
                ...newValue,
                [lowerFirst(currentValue.Id)]: this.formatNumber(currentValue.Value),
            }), {});
        },
        generateBreakdown(data) {
            return data?.reduce((newValue, currentValue) => ({
                [lowerFirst(currentValue.Id)]: this.formatNumber(currentValue.Value),
                ...this.formatObject(currentValue.ExposureItem),
                ...newValue,
            }), {});
        },
        getSecurityLevelBreakdown(breakdown) {
            const securityBreakdown = [];
            const portfolioAnalyzed = [];
            let formattedBreakdown = {};
            breakdown.forEach((security) => {
                const securityName = security?.Name;
                const weight = security?.Weight;
                const analyzedPercent = this.formatNumber(security?.Analyzed) * 1 || 0;
                const notAnalyzedPercent = this.formatNumber(security?.NotAnalyzed) * 1 || 0;
                formattedBreakdown = this.generateBreakdown(security.Sector);
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
        rowClass(item) {
            if (this.sectorTypes.includes(item.name)) {
                return `highlight highlight-${item.name}`;
            }
            return '';
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

$icon-mappings: (
    'cyclical': '@/components/stock-sectors/assets/icon-cyclical.svg',
    'basicMaterials': '@/components/stock-sectors/assets/icon-basic_materials.svg',
    'consumerCyclical': '@/components/stock-sectors/assets/icon-consumer_cyclical.svg',
    'financialServices': '@/components/stock-sectors/assets/icon-financial_services.svg',
    'realEstate': '@/components/stock-sectors/assets/icon-real_estate.svg',
    'defensive': '@/components/stock-sectors/assets/icon-defensive.svg',
    'consumerDefensive': '@/components/stock-sectors/assets/icon-consumer_defensive.svg',
    'healthcare': '@/components/stock-sectors/assets/icon-healthcare.svg',
    'utilities': '@/components/stock-sectors/assets/icon-utilities.svg',
    'sensitive': '@/components/stock-sectors/assets/icon-sensitive.svg',
    'communicationServices': '@/components/stock-sectors/assets/icon-communication_services.svg',
    'energy': '@/components/stock-sectors/assets/icon-energy.svg',
    'industrials': '@/components/stock-sectors/assets/icon-industrials.svg',
    'technology': '@/components/stock-sectors/assets/icon-technology.svg',
);

.stock-sectors {
    @include mixin.wal-component-title;
    @include mixin.wal-table;
    @include mixin.wal-highlight-table-cell;
    tbody {
        @each $name, $icon in $icon-mappings {
            .#{$name} {
                display: flex;
                align-items: center;

                &::before {
                    display: inline-block;
                    width: 30px;
                    height: 20px;
                    content: '';
                    background: url($icon) no-repeat;
                    vertical-align: bottom;
                    margin-right: map.get(mixin.$wal, space, 'haf-x');
                }
            }
        }

        td {
            font-size: map.get(mixin.$wal, space, '2-x') !important;
        }
        .highlight {
            &-sensitive {
                color: #C2261E;
            }
            &-cyclical {
                color: #8FB840;
            }
            &-defensive {
                color: #538AC9;
            }
        }
    }
}
</style>

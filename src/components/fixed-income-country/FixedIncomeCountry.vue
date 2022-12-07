<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Fixed Income Country</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="fieldDefinitions"
                    :items="parsedModelData"
                    :items-per-page="5"
                    :sort-by="['portfolio']"
                    :sort-desc="['true']"
                    >
                    <template v-slot:[`item.name`] ="{ value }">
                        <div :class="value">
                            {{ nameMapping[value.toLowerCase()] }}
                        </div>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import mapping from '@/components/fixed-income-country/config/mapping.json';

export default {
    props: {
        /** Define the table columns. */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    text: 'Country',
                    value: 'name',
                },
                {
                    text: 'Portfolio %',
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
            type: Object,
            default: () => ({}),
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            nameMapping: mapping,
        };
    },
    computed: {
        parsedModelData() {
            if (Object.keys(this.modelData || {}).length) {
                const portfolioCountryDataKeys = Object
                    .keys(this.modelData?.portfolio?.values || {});
                const benchmarkCountryDataKeys = Object
                    .keys(this.modelData?.benchmark?.values || {});
                benchmarkCountryDataKeys.forEach((key) => {
                    if (portfolioCountryDataKeys.indexOf(key) < 0) {
                        portfolioCountryDataKeys.push(key);
                    }
                });
                return portfolioCountryDataKeys.map((country) => ({
                    name: country,
                    portfolio: this.modelData.portfolio.values[country] ?? '-',
                    benchmark: this.modelData.benchmark.values[country] ?? '-',
                }));
            }
            return [];
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;
</style>

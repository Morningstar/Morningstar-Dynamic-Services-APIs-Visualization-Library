<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Fixed Income Sectors</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-center"
                   v-if="!(Object.keys(modelData).length)"> No data available </v-col>
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
    </div>
</template>

<script>
import mapping from '@/components/fixed-income-sectors/config/mapping.json';

export default {
    props: {
        /** To show data for specified data point. */
        dataPoints: {
            type: Array,
            default: () => mapping.dataPoints,
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
    computed: {
        parsedModelData() {
            return this.dataPoints.map((sector) => ({
                key: sector,
                portfolio: this.modelData.portfolio[sector] ?? '-',
                benchmark: this.modelData.benchmark[sector] ?? '-',
            }));
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

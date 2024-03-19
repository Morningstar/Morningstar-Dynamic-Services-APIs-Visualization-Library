<template>
     <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Carbon Score</h2>
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
                                    <span class="header__text">Carbon</span>
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
import { get } from 'lodash';
import dataPoints from '@/components/carbon-score/config/dataPoints.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
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
    },
    computed: {
        parsedModelData() {
            const { modelData } = this;
            const carbonScoreData = modelData;
            const keys = Object.keys(dataPoints);
            return keys.map((key) => {
                const dataPoint = key;
                return {
                    key: dataPoints[dataPoint],
                    portfolio: this.formatNumber(get(carbonScoreData.portfolio, `${dataPoint}`, null)),
                    benchmark: this.formatNumber(get(carbonScoreData.benchmark, `${dataPoint}`, null)),
                };
            });
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

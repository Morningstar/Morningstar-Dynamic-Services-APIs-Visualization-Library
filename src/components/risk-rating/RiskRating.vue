<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Risk & Rating</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <MorningstarRating :modelData="
                    (parsedModelData.RiskAndRating) || []"/>
            </v-col>
            <v-col cols="12" md="6">
                <div class="title">
                    <h2>Risk Measurement</h2>
                </div>
                <PortfolioSrri :modelData="parsedModelData" :showHeader="false" />
                <RiskMeasures :modelData="
                    (parsedModelData.RiskStatistics) || []" />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { get, set } from 'lodash';
import PortfolioSrri from '@/components/portfolio-srri/PortfolioSrri.vue';
import MorningstarRating from './MorningstarRating.vue';
import RiskMeasures from './RiskMeasures.vue';

export default {
    components: {
        MorningstarRating,
        PortfolioSrri,
        RiskMeasures,
    },
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: Array,
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        parsedModelData() {
            const data = (this.modelData && this.modelData[0]) || {};
            set(data, 'sRRI[0].value', get(data, 'CollectedSRRI.Rank'));
            return data;
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
</style>

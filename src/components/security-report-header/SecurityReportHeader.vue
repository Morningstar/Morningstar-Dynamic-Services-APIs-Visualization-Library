<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Security Report Header</h2>
            </v-col>
        </v-row>
        <v-container fluid>
            <div class="heading">
                <span v-if="parsedModelData.investmentName">
                    {{ parsedModelData.investmentName }}
                </span>
                <span v-if="parsedModelData.symbol">
                    ({{ parsedModelData.symbol }})
                </span>
            </div>
            <div class="ratings" v-if="parsedModelData.mstarRating">
                <div v-for="rating in parseInt(parsedModelData.mstarRating)" :key="rating"
                    :title="`Morningstar Rating: ${parsedModelData.mstarRating}`" role="img"
                    class="ratings__star-rating">
                </div>
                <div :title="`Morningstar Analyst Rating: ${parsedModelData.analystRatingScale}`"
                    class="ratings__analyst-rating">
                    {{ parsedModelData.analystRatingScale }}
                </div>
            </div>
            <div class="sustainability" v-if="parsedModelData.sustainabilityRank">
                <div v-for="rating in parseInt(parsedModelData.sustainabilityRank)"
                     :key="rating"
                     :title="`Morningstar Sustainability Rating:
                ${parsedModelData.sustainabilityRank}`" class="sustainability__globe-rating"
                     role="img">
                </div>
            </div>
        </v-container>
        <v-container fluid>
            <div class="investmentStrategy" v-if="parsedModelData.investmentStrategy">
                {{ parsedModelData.investmentStrategy }}
            </div>
        </v-container>
        <key-value-pair :model-data="parsedModelData.keyValuePairData"></key-value-pair>
    </div>
</template>

<script>
import { get } from 'lodash';
import KeyValuePair from '@/components/shared/KeyValuePair.vue';
import labelMapping from '@/components/security-report-header/config/mapping.json';

export default {
    components: { KeyValuePair },
    props: {
        /** Define the table columns. */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    fieldName: 'id',
                    modelPath: 'Id',
                },
                {
                    fieldName: 'isin',
                    modelPath: 'Isin',
                },
                {
                    fieldName: 'currency',
                    modelPath: 'Currency.Id',
                },
                {
                    fieldName: 'exchange',
                    modelPath: 'Exchange',
                },
                {
                    fieldName: 'legalStructure',
                    modelPath: 'LegalStructure',
                },
                {
                    fieldName: 'fundBenchmark',
                    modelPath: 'FundBenchmark.0.Name',
                },
            ],
        },
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
            const security = this.modelData ? this.modelData[0] : {};
            const parsedData = {};
            // Main header data
            parsedData.investmentName = security.LegalName;
            parsedData.investmentStrategy = security.InvestmentStrategy;
            parsedData.symbol = security.Symbol;
            parsedData.analystRatingScale = security.AnalystRatingScale;
            // should make call to sal api for sustainability rank
            parsedData.sustainabilityRank = '';
            parsedData.mstarRating = security.RiskAndRating?.filter(
                (periodData) => periodData.TimePeriod === 'M255',
            )[0]?.RatingValue;

            // Key Value Pair data
            parsedData.keyValuePairData = this.fieldDefinitions?.map((field) => ({
                key: get(labelMapping.dataPoints, field.fieldName),
                value: get(security, field.modelPath) ?? '-',
            }));
            return parsedData;
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;

// Constants
$space-1-and-a-qurter-x: map.get(mixin.$wal, 'space', '1-and-a-qurter-x');
$space-2-and-a-half-x: map.get(mixin.$wal, 'space', '2-and-a-half-x');

// Mixin
@mixin applyIcon($url) {
    background-image: url($url);
    height: map.get(mixin.$wal, 'space', '2-and-a-half-x');
    width: $space-2-and-a-half-x;
}

.heading {
    display: inline-block;
    @include mixin.wal-heading(2);
}

.ratings {
    display: inline-flex;
    margin: $space-1-and-a-qurter-x;

    &__star-rating {
        @include applyIcon('@/assets/star_rating.svg')
    }

    &__analyst-rating {
        margin-left: $space-2-and-a-half-x
    }
}

.sustainability {
    display: inline-flex;
    margin: $space-1-and-a-qurter-x;

    &__globe-rating {
        @include applyIcon('@/assets/globes.svg')
    }
}

.investmentStrategy {
    display: inline-block;
}
</style>

<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Morningstar Rating (Relative to Category)</h2>
            </v-col>
        </v-row>
        <v-data-table
            :headers="fieldDefinitions"
            :items="parsedModelData"
            :items-per-page="-1"
            :disable-sort="true"
            hide-default-footer
        >
            <template v-slot:[`item.morningstarRating`]="{ value }">
                <div v-if="value" class="ratings">
                    <div v-for="rating in value" :key="rating"
                        :title="`Morningstar Rating: ${value}`" role="img"
                        class="ratings__star-rating">
                    </div>
                </div>
                <template v-else>–</template>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import riskRatingMappings from '@/components/risk-rating/config/risk-rating-mappings.json';

export default {
    props: {
        /** Define the table columns */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    text: '',
                    value: 'timePeriod',
                },
                {
                    text: 'Morningstar Return',
                    value: 'morningstarReturn',
                },
                {
                    text: 'Morningstar Risk',
                    value: 'morningstarRisk',
                },
                {
                    text: 'Morningstar Rating',
                    value: 'morningstarRating',
                },
            ],
        },
        /** Accepts the "RiskAndRating" property of the response object
        * returned from API Data Access Library. */
        modelData: Array,
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        parsedModelData() {
            const tableData = [];
            const riskAndRating = this.modelData || [];
            const periods = ['M36', 'M60', 'M120', 'M255'];
            periods.forEach((timePeriod) => {
                const timePeriodData = riskAndRating.find((data) => data.TimePeriod === timePeriod);
                tableData.push({
                    morningstarRating: timePeriodData && timePeriodData.RatingValue,
                    morningstarReturn: riskRatingMappings[`rating_${
                        timePeriodData && timePeriodData.PerformanceRatingValue
                    }`] || '–',
                    morningstarRisk: riskRatingMappings[`rating_${
                        timePeriodData && timePeriodData.RiskRatingValue
                    }`] || '–',
                    timePeriod: riskRatingMappings[`timePeriod_${timePeriod}`],
                });
            });
            return tableData;
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
.ratings {
    display: inline-flex;
    margin: map.get(mixin.$wal, 'space', '1-and-a-quarter-x');;

    &__star-rating {
        @include mixin.applyIcon('@/assets/star_rating.svg');
    }
}
</style>

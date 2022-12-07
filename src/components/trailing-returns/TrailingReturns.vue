<template>
    <chart-table-panel
        :model-data="parsedModelData"
        :show-header="showHeader"
        :title="'Trailing Returns (%)'"
        :header-labels="['Time Period', 'Portfolio', 'Benchmark']"
        :displays="displays"
        :chart-options="chartOptions"
        :height="chartHeight"
    ></chart-table-panel>
</template>

<script>
import ChartTablePanel from '@/components/shared/ChartTablePanel.vue';
import trailingReturnsMapping from '@/components/trailing-returns/config/mapping.json';
import dataPoints from '@/components/trailing-returns/config/dataPoints.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    components: {
        ChartTablePanel,
    },
    props: {
        /** To show data for specific time period. */
        dataPoints: {
            type: Array,
            default: () => dataPoints.emea,
        },
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Array, Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Views to be displayed. Toggle button won't be displayed if only one view is passed. */
        displays: {
            type: Array,
            default: () => ['chart', 'table'],
        },
        /** Chart.js bar chart options */
        chartOptions: Object,
        /** Chart height in pixels */
        chartHeight: Number,
    },
    computed: {
        parsedModelData() {
            if (this.modelData) {
                const labels = [];
                const portfolioData = [];
                const benchmarkData = [];
                this.dataPoints.forEach((dataPoint) => {
                    labels.push(trailingReturnsMapping.dataPoints[dataPoint]);
                    portfolioData.push(this.getTimePeriodData(dataPoint, this.modelData.portfolio));
                    benchmarkData.push(this.getTimePeriodData(dataPoint, this.modelData.benchmark));
                });
                return {
                    labels,
                    datasets: [
                        {
                            label: 'Portfolio',
                            backgroundColor: '#024A7A',
                            data: portfolioData,
                        },
                        {
                            label: 'Benchmark',
                            backgroundColor: '#1DADE2',
                            data: benchmarkData,
                        },
                    ],
                };
            }
            return null;
        },
    },
    methods: {
        getTimePeriodData(timePeriod, data = []) {
            const result = data.find((dataPoint) => dataPoint.timePeriod === timePeriod) || {};
            return result.value;
        },
    },
};
</script>
<style lang="scss" scoped>
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;
</style>

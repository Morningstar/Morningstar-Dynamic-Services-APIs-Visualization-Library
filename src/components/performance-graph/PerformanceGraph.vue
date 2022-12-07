<template>
    <div class="performance-graph">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2 v-if="title">{{ title }}</h2>
                <h2 v-else-if="showTimeSeriesData">Performance Graph (Time Series)</h2>
                <h2 v-else>Performance Graph</h2>
            </v-col>
        </v-row>
        <v-row v-if="hasPerformanceData">
            <v-col cols="12">
                <v-tabs
                    background-color="transparent"
                    show-arrows
                    color="black">
                    <v-tab
                        class="performance-graph-btn"
                        v-for="item in getTabs"
                        :key="item.title"
                        @click="tabChanged(item)">{{ item.title }}
                    </v-tab>
                </v-tabs>
            </v-col>
            <v-col cols="12">
                <LineChart
                    :chart-options="chartOptions"
                    :chart-data="chartData"
                    chart-id="performance-graph-chart"/>
            </v-col>
        </v-row>
        <v-row
            v-else
            class="text-center"
        >
            <v-col>
                No data available
            </v-col>
        </v-row>
    </div>
</template>

<script>
import LineChart from '@/components/shared/LineChart.vue';
import helper from '@/stories/stories-helper';
import Service from './performance-graph-service';
import ComponentMixin from '../component-helper-mixin';

export default {
    components: {
        LineChart,
    },
    mixins: [ComponentMixin],
    props: {
        /** Accepts the response object returned from API SDK. */
        modelData: {
            type: [Array, Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Enable time series api settings, return false if using other api */
        showTimeSeriesData: {
            type: Boolean,
            default: true,
        },
        /** portfolio to fetch graph data from API */
        portfolio: {
            type: [Object, String, Array],
            default: () => helper.samplePortfolio,
        },
        /** Component title to be displayed. Defaults to "Performance Graph".
         * Defaults to "Performance Graph (Time Series)" if `showTimeSeriesData` is `true`
         * or to "Performance Graph" otherwise. */
        title: String,
    },
    data() {
        return {
            chartData: {},
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                parsing: {
                    xAxisKey: 'formattedDate',
                    yAxisKey: 'value',
                },
                pointStyle: 'circle',
                pointRadius: 1,
                pointHoverRadius: 6,
                plugins: {
                    tooltip: {
                        backgroundColor: '#000000',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        bodySpacing: 10,
                        borderWidth: 2,
                        borderColor: '#000000',
                        callbacks: {
                            label(context) {
                                const label = context.raw.name || '';
                                const value = context.raw.value || '';
                                return `${label} : ${value}`;
                            },
                        },
                    },
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            color: '#6e7383',
                            boxWidth: 25,
                            boxHeight: 2,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            color: '#eef5ff',
                        },
                    },
                    y: {
                        grid: {
                            color: '#eef5ff',
                        },
                    },
                },
            },
            chartColors: [
                '#ffba38',
                '#31357c',
            ],
            timelineLevelDefinitions: {
                month: [0, 13],
                quarter: [14, 37],
                year: [38, 2000],
            },
            graphBaseValue: 10000,
            selectedTab: 'oneYear',
        };
    },
    computed: {
        hasPerformanceData() {
            return Object.keys(this.chartData).length
                && ((Object.keys((this.modelData && this.modelData.portfolio) || {}).length
                    || Object.keys((this.modelData && this.modelData.benchmark) || {}).length));
        },
        parsedModelData() {
            const data = this.modelData;
            const portfolioName = data && data.portfolioName
                ? data.portfolioName
                : this.portfolio?.name;

            return [{
                name: portfolioName || 'Portfolio',
                type: 'portfolio',
                data: this.transformPerformanceChartData(data?.portfolio || []),
            }, {
                name: data?.benchmarkName || 'Benchmark',
                type: 'benchmark',
                data: this.transformPerformanceChartData(data?.benchmark || []),
            }];
        },
        getTabs() {
            return [
                {
                    value: 12,
                    checked: true,
                    key: 'oneYear',
                    title: '1 Year',
                },
                {
                    value: 24,
                    key: 'twoYears',
                    title: '2 Years',
                },
                {
                    value: 36,
                    key: 'threeYears',
                    title: '3 Years',
                },
                {
                    value: 60,
                    key: 'fiveYears',
                    title: '5 Years',
                },
                {
                    value: 120,
                    key: 'tenYears',
                    title: '10 Years',
                },
            ];
        },
    },
    watch: {
        showTimeSeriesData(newVal) {
            if (newVal && this.parsedModelData && this.parsedModelData.length > 0) {
                this.chartData = this.parseChartData(this.selectedTab) || {};
            }
        },
    },
    mounted() {
        if (this.parsedModelData && this.parsedModelData.length > 0) {
            this.chartData = this.parseChartData(this.selectedTab) || {};
        }
    },
    methods: {
        drawGraphByFrequency(seriesData, months) {
            let monthCount = months;
            if (monthCount === 'YTD') {
                monthCount = Service.getYTDMonthCount(seriesData);
            }
            return Service.getFrequencySeriesData(
                this.graphBaseValue,
                seriesData,
                monthCount,
                this.showTimeSeriesData,
            );
        },
        getChartData(monthCount) {
            const frequencySeriesData = this.drawGraphByFrequency(this.parsedModelData, monthCount);
            const lineChartData = Service.getLineChartData(frequencySeriesData);
            return lineChartData;
        },
        parseChartData(tab) {
            const selectedTab = this.getTabs.find((item) => item.key === tab);
            const portfolioData = this.getChartData(selectedTab?.value)[0];
            const benchmarkData = this.getChartData(selectedTab?.value)[1];
            const portfolioLegendLabel = this.getFormattedLegendValue(portfolioData);
            const benchmarkLegendLabel = this.getFormattedLegendValue(benchmarkData);
            if (portfolioData.length || benchmarkData.length) {
                return {
                    datasets: [
                        {
                            label: portfolioLegendLabel,
                            borderColor: this.chartColors[0],
                            backgroundColor: this.chartColors[0],
                            data: portfolioData,
                        },
                        {
                            label: benchmarkLegendLabel,
                            borderColor: this.chartColors[1],
                            backgroundColor: this.chartColors[1],
                            data: benchmarkData,
                        },
                    ],
                };
            }
            return {};
        },
        getFormattedLegendValue(value) {
            const getLatestDate = value.reduce((m, current, index) => {
                if (m.date) {
                    return (current.date > m.date) && index ? current : m;
                }
                return current;
            }, {});
            let newValue = getLatestDate?.value;
            const name = getLatestDate?.name;

            const { graphBaseValue } = this;
            newValue = ((newValue - graphBaseValue) / graphBaseValue) * 100.0;

            return `${name} : ${newValue.toFixed(2)}`;
        },
        tabChanged(event) {
            this.chartData = this.parseChartData(event.key);
        },
        transformPerformanceChartData(data, overrideValue) {
            return data.map((item) => {
                const value = Number.parseFloat(item[1]);
                const endDate = this.toUTCLocalISOString(new Date(item[0]));
                return {
                    endDate,
                    value: overrideValue ?? value,
                };
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
</style>

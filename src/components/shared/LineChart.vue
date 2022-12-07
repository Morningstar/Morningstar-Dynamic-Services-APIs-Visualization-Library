<template>
    <LineChart
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
    />
</template>

<script>
import { Line as LineChart } from 'vue-chartjs/legacy';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement);

export default {
    name: 'LineChartGraph',
    components: {
        LineChart,
    },
    props: {
        chartData: {
            type: Object,
            default: () => {},
        },
        chartId: {
            type: String,
            default: 'line-chart',
        },
        chartOptions: {
            type: Object,
            default: () => {},
        },
        datasetIdKey: {
            type: String,
            default: 'label',
        },
        width: {
            type: Number,
            default: 400,
        },
        height: {
            type: Number,
            default: 300,
        },
        cssClasses: {
            default: '',
            type: String,
        },
        styles: {
            type: Object,
            default: () => {},
        },
        plugins: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

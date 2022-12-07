<template>
    <Doughnut
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
import { Doughnut } from 'vue-chartjs/legacy';

import {
    Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
    name: 'DoughnutChart',
    components: {
        Doughnut,
    },
    props: {
        chartId: {
            type: String,
            default: 'doughnut-chart',
        },
        datasetIdKey: {
            type: String,
            default: 'label',
        },
        width: {
            type: Number,
            default: 250,
        },
        height: {
            type: Number,
            default: 250,
        },
        cssClasses: String,
        styles: Object,
        plugins: Array,
        chartData: {
            type: Object,
            required: true,
            default: () => ({
                labels: [
                    'Label 1',
                    'Label 2',
                    'Label 3',
                ],
                datasets: [
                    {
                        backgroundColor: [
                            '#4daf4a',
                            '#377eb8',
                            '#ff7f00',
                        ],
                        data: [
                            20.0005,
                            55,
                            20,
                        ],
                    },
                ],
            }),
        },
        chartOptions: {
            type: Object,
            default: () => ({
                type: 'doughnut',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    type: Array,
                    default: () => [],
                    legend: {
                        display: false,
                    },
                },
            }),
        },
    },
};
</script>

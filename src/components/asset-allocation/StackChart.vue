<template>
    <Bar
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
import { Bar } from 'vue-chartjs/legacy';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: 'StackChart',
    components: {
        Bar,
    },
    props: {
        chartId: {
            type: String,
            default: 'bar-chart',
        },
        datasetIdKey: {
            type: String,
            default: 'label',
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        cssClasses: String,
        styles: Object,
        plugins: Array,
        chartData: {
            type: Object,
            required: true,
            default: () => ({
                labels: [
                    'US Stocks',
                    'Non US Stocks',
                    'Bonds',
                    'Cash',
                    'Other',
                ],
                datasets: [
                    {
                        data: [-90, 20, 12, 39, 10, 80, 39],
                        borderColor: [
                            '#4daf4a',
                            '#377eb8',
                            '#ff7f00',
                            '#984ea3',
                            '#e41a1c',
                            '#a41b1c',
                        ],
                        backgroundColor: [
                            'rgba(77, 175, 74, 0.2)',
                            'rgba(55, 126, 184, 0.2)',
                            'rgba(255, 127, 0, 0.2)',
                            'rgba(152, 78, 163, 0.2)',
                            'rgba(228, 26, 28, 0.2)',
                            'rgba(164, 27, 28, 0.2)',
                        ],
                    },
                ],
            }),
        },
        chartOptions: {
            type: Object,
            default: () => ({
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 1px wide
                elements: {
                    bar: {
                        borderWidth: 1,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
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
    data() {
        return {};
    },
};
</script>

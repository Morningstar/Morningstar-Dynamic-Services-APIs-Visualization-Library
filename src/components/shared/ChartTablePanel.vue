<template>
    <div>
        <v-row v-if="showHeader">
            <v-col class="title">
                <h2 :class="{ 'pr-16': showToggleButton  }">{{ title }}</h2>
                <div
                    v-if="showToggleButton"
                    class="toggle-btn-container mr-3">
                    <v-btn
                        icon
                        aria-label="Display Table"
                        :raised="toggle"
                        :elevation="toggle ? 2 : 0"
                        :class="[{ 'toggle-btn-active': !toggle }, 'rounded']"
                        small
                        @click="toggleDisplays('table')"
                    >
                        <v-icon>mdi-table-large</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        aria-label="Display chart"
                        :raised="!toggle"
                        :elevation="toggle ? 0 : 2"
                        :class="[{ 'toggle-btn-active': toggle }, 'rounded']"
                        small
                        @click="toggleDisplays('chart')"
                    >
                        <v-icon>mdi-chart-bar</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row v-if="!isChartDataAvailable" class="text-center">
            <v-col>No Data Available</v-col>
        </v-row>
        <v-row v-else>
            <v-col v-show="showChart">
                <Bar
                    :chart-options="chartOptions"
                    :chart-data="modelData"
                    :chart-id="chartId"
                    :dataset-id-key="datasetIdKey"
                    :plugins="plugins"
                    :css-classes="cssClasses"
                    :styles="styles"
                    :width="width"
                    :height="height"
                />
            </v-col>
            <v-col v-show="showTable">
                <v-simple-table>
                    <template v-slot:default>
                        <thead class="header">
                            <tr>
                                <th
                                    v-for="(headerLabel, index) in headerLabels"
                                    :key="index"
                                    :class="index ? 'text-right' : 'text-left'">
                                    <span class="header__text">{{ headerLabel }}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(label, index) in modelData.labels"
                                :key="index"
                            >
                                <td class="text-left">{{ label }}</td>
                                <td
                                    class="text-right"
                                    v-for="(dataset, dataIndex) in modelData.datasets"
                                    :key="dataIndex">
                                    {{ getFormattedData(dataset.data[index]) }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                <ul>
                    <li
                        v-for="(footerLegend, index) in footerLegends"
                        :key="index"
                    >{{ footerLegend }}</li>
                </ul>
            </v-col>
        </v-row>
    </div>
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
import ComponentMixin from '../component-helper-mixin';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    mixins: [ComponentMixin],
    name: 'ChartTablePanel',
    components: {
        Bar,
    },
    props: {
        /** Views to be displayed "chart" / "table" or both to be toggled using a button */
        displays: {
            type: Array,
            default: () => ['chart', 'table'],
        },
        /** Table column header labels */
        headerLabels: {
            type: Array,
            default: () => ['Time Period', 'Fund', 'Category'],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** The component title to be displayed */
        title: String,
        modelData: {
            type: Object,
            default: () => ({}),
        },
        /** HTML id of the chart element */
        chartId: {
            type: String,
            default: 'bar-chart',
        },
        /** Vuetify Chart options */
        chartOptions: {
            type: Object,
            default: () => ({
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    type: Array,
                    default: () => [],
                    legend: {
                        align: 'start',
                        labels: {
                            textAlign: 'left',
                        },
                    },
                },
            }),
        },
        /** Unique keys differentiating datasets */
        datasetIdKey: {
            type: String,
            default: 'label',
        },
        /** Initial width of the chart element */
        width: {
            type: Number,
            default: 400,
        },
        /** Initial height of the chart element */
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
    data() {
        return {
            toggle: true,
        };
    },
    computed: {
        footerLegends() {
            const tableLegends = [];
            this.headerLabels.forEach((headerLabel, index) => {
                if (index) { // skip 0th index
                    const chartLegend = this.modelData.datasets[index - 1].label;
                    if (headerLabel !== chartLegend) {
                        tableLegends.push(`${headerLabel}: ${chartLegend}`);
                    }
                }
            });
            return tableLegends;
        },
        isChartDataAvailable() {
            // eslint-disable-next-line max-len
            return this.modelData?.datasets?.some((dataset) => dataset.data?.some((item) => !!item));
        },
        showToggleButton() {
            return this.isChartDataAvailable && this.displays.length > 1;
        },
        showChart() {
            return this.showToggleButton ? this.toggle : this.displays.indexOf('chart') > -1;
        },
        showTable() {
            return this.showToggleButton ? !this.toggle : this.displays.indexOf('table') > -1;
        },
    },
    methods: {
        getFormattedData(dataValue) {
            return this.formatNumber(dataValue) || '–';
        },
        toggleDisplays(display) {
            this.toggle = display === 'chart';
        },
    },
};
</script>
<style lang="scss" scoped>
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;
.title {
    position: relative;
}
.toggle-btn {
    &-container {
        position: absolute;
        top: 0;
        right: 0;
    }
    &-active {
        &::before {
            opacity: 0.2;
        }
    }
}
</style>

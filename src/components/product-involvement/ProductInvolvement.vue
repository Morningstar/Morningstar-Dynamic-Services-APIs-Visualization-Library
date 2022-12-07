<template>
    <div class="product-involvement">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Product Involvement</h2>
                <div
                    class="toggle-btn-container mr-3">
                    <v-btn
                        icon
                        small
                        aria-label="Display Table"
                        :class="[{ 'toggle-btn-active': showTable }, 'rounded']"
                        @click="showTable = true"
                    >
                        <v-icon>mdi-table-large</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        small
                        aria-label="Display chart"
                        :class="[{ 'toggle-btn-active': !showTable }, 'rounded']"
                        @click="displayChart"
                    >
                        <v-icon>mdi-chart-bar</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="showTable">
                <v-data-table
                    :headers="fieldDefinitions"
                    :items="parsedModelData"
                    :item-class="rowClass"
                    :items-per-page="-1"
                    :disable-sort="true"
                    hide-default-footer>
                    <template v-slot:[`item.name`]="{ value }">
                        <div :class="value">
                            {{ nameMapping[value] }}
                        </div>
                    </template>
                </v-data-table>
            </v-col>
            <v-row v-else>
                <v-col lg="9" md="9">
                    <Bar
                        :chart-options="chartOptions"
                        :chart-data="chartData"
                        :width="width"
                        :height="height"
                    />
                </v-col>
                <v-col lg="3" md="3">
                    <section class="legends-details"
                        aria-hidden="true">
                        <table>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        <em>Product Type</em>
                                    </th>
                                    <th>
                                        <em>Fund %</em>
                                    </th>
                                    <th>
                                        <em>Bmark %</em>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(dataPoint, index) of dataPoints"
                                    :key="index"
                                >
                                    <td>
                                        <span class="color-info">
                                            {{ nameMapping[dataPoint] }}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            :style=" {
                                                'background-color'
                                                : legendColor(dataPoint, 'fund') }"
                                            class="color-container"
                                        ></span>
                                    </td>
                                    <td>
                                        <span
                                            :style=" {
                                                'background-color'
                                                : legendColor(dataPoint, 'benchmark') }"
                                            class="color-container"
                                        ></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </v-col>
            </v-row>
        </v-row>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs/legacy';
import productInvolvementMapping from '@/components/product-involvement/config/product-involvement-mapping.json';

export default {
    components: {
        Bar,
    },
    props: {
        /** Define the table columns. */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    text: 'Product Type',
                    value: 'name',
                },
                {
                    text: 'Fund %',
                    value: 'portfolio',
                    align: 'end',
                },
                {
                    text: 'Benchmark %',
                    value: 'benchmark',
                    align: 'end',
                },
            ],
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
        /** Chart.js bar chart options */
        chartOptions: {
            type: Object,
            default: () => ({
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 1,
                    },
                },
                plugins: {
                    type: Array,
                    default: () => [],
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    yAxes: {
                        stacked: false,
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                },
            }),
        },
        /** Initial width of the chart element */
        width: {
            type: Number,
            default: 50,
        },
        /** Initial height of the chart element */
        height: {
            type: Number,
            default: 30,
        },
    },
    data() {
        return {
            nameMapping: productInvolvementMapping.dataPointMapping,
            dataPoints: productInvolvementMapping.valueMapping.dataPoints,
            showTable: true,
            chartData: {
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    label: 'Fund %',
                },
                {
                    data: [],
                    backgroundColor: [],
                    label: 'Benchmark %',
                }],
            },
        };
    },
    computed: {
        parsedModelData() {
            if (this.modelData) {
                const parseProductInvolvementData = [];
                const { valueMapping } = productInvolvementMapping;
                const productInvolvementData = this.modelData;

                if (productInvolvementData.portfolio || productInvolvementData.benchmark) {
                    this.dataPoints.forEach((key) => {
                        parseProductInvolvementData.push({
                            name: key,
                        });
                        valueMapping.dataPointsObject[key].category.forEach((item) => {
                            if (item) {
                                const portfolioValue = productInvolvementData?.portfolio[item]?.toFixed(2) ?? '-';
                                const benchmarkValue = productInvolvementData?.benchmark[item]?.toFixed(2) ?? '-';
                                this.chartData.datasets[0].data.push(portfolioValue);
                                this.chartData.datasets[1].data.push(benchmarkValue);
                                parseProductInvolvementData.push({
                                    name: item,
                                    portfolio: portfolioValue,
                                    benchmark: benchmarkValue,
                                });
                            }
                        });
                    });
                    return parseProductInvolvementData;
                }
            }
            return [];
        },
    },
    methods: {
        rowClass(item) {
            if (this.dataPoints.includes(item.name)) {
                return 'highlight';
            }
            return '';
        },
        displayChart() {
            if (this.showTable) {
                this.showTable = false;
                if (!this.chartData.labels) {
                    const { dataPointsObject } = productInvolvementMapping.valueMapping;
                    const chartLabels = [];
                    const fundBackgroundColor = [];
                    const benchmarkBackgroundColor = [];
                    this.dataPoints.forEach((key) => {
                        dataPointsObject[key].category.forEach((dataPoint) => {
                            chartLabels.push(this.nameMapping[dataPoint]);
                            fundBackgroundColor.push(dataPointsObject[key].chartColors.fund);
                            benchmarkBackgroundColor
                                .push(dataPointsObject[key].chartColors.benchmark);
                        });
                    });
                    this.chartData.labels = chartLabels;
                    this.chartData.datasets[0].backgroundColor = fundBackgroundColor;
                    this.chartData.datasets[0].borderColor = fundBackgroundColor;
                    this.chartData.datasets[1].backgroundColor = benchmarkBackgroundColor;
                    this.chartData.datasets[1].borderColor = fundBackgroundColor;
                }
            }
        },
        legendColor(dataPoint, column) {
            const { dataPointsObject } = productInvolvementMapping.valueMapping;
            return dataPointsObject[dataPoint].chartColors[column];
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

$icon-mappings: (
    "animalTesting": "@/components/product-involvement/assets/icon-animal_testing.svg",
    "furAndSpecialtyLeather":
        "@/components/product-involvement/assets/icon-fur_specialty_leather.svg",
    "controversialWeapons":
        "@/components/product-involvement/assets/icon-controversial_weapons.svg",
    "militaryContracting": "@/components/product-involvement/assets/icon-military_contracting.svg",
    "smallArms": "@/components/product-involvement/assets/icon-small_arms.svg",
    "nuclear": "@/components/product-involvement/assets/icon-nuclear.svg",
    "thermalCoal": "@/components/product-involvement/assets/icon-thermal_coal.svg",
    "gmo": "@/components/product-involvement/assets/icon-gmos.svg",
    "palmOil": "@/components/product-involvement/assets/icon-palm_oil.svg",
    "pesticides": "@/components/product-involvement/assets/icon-pesticides.svg",
    "alcohol": "@/components/product-involvement/assets/icon-alcohol.svg",
    "lifeEthics": "@/components/product-involvement/assets/icon-life_ethics.svg",
    "tobacco": "@/components/product-involvement/assets/icon-tobacco.svg",
    "adultEntertainment": "@/components/product-involvement/assets/icon-adult_entertainment.svg",
    "gambling": '@/components/product-involvement/assets/icon-gambling.svg',
);

.product-involvement {
    @include mixin.wal-component-title;
    @include mixin.wal-table;
    table {
        tbody {
            @each $name, $icon in $icon-mappings {
                .#{$name} {
                    display: flex;
                    align-items: center;
                    &::before {
                        display: inline-block;
                        width: 30px;
                        height: 20px;
                        content: '';
                        background: url($icon) no-repeat;
                        vertical-align: bottom;
                        margin-right: map.get(mixin.$wal, space, 'half-x');
                    }
                }
            }
            @include mixin.wal-highlight-table-cell;
        }
    }

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

    .legends-details {
        $container-size: map.get(mixin.$wal, 'space', '1-and-a-half-x');
        font-size: map.get(mixin.$wal, 'font-size', 'xs') !important;

        .color-container {
            width: $container-size;
            height: $container-size;
            display: block;
            margin: map.get(mixin.$wal, 'space', 'half-x') map.get(mixin.$wal, 'space', '1-x');
        }
        caption {
            position: absolute;
            clip: rect(1px, 1px, 1px, 1px);
        }
        .color-info, th em {
            font-size: map.get(mixin.$wal, 'font-size', 'xs');
        }
    }
}
</style>

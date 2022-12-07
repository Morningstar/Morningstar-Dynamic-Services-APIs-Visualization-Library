<template>
    <div class="risk-score">
        <v-row v-if="showHeader">
                <v-col cols="12" class="title">
                    <h2>Risk Score</h2>
            </v-col>
        </v-row>
        <v-row v-if="!parsedModelData" class="text-center">
            <v-col>No Data Available</v-col>
        </v-row>
        <v-row v-else>
            <v-col sm="6" md="6" lg="6">
                <div class="risk-score__chart">
                    <div ref="chart" :id="`risk-score-${chartId}`"></div>
                    <!-- tooltip -->
                    <v-menu v-if="showAlertTooltip" offset-y z-index="10" max-width="250px"
                        right top nudge-top="5" class="risk-score__tooltip">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" type="button" icon color="#000"
                                outlined x-small class="warning-btn"
                                aria-label="Off scale information">&#33;</v-btn>
                        </template>
                        <v-card color="#f5c400">
                            <v-card-text>
                                This Portfolio Risk Score is above the average of
                                100%-equity portfolios benchmarked by Morningstar.</v-card-text>
                        </v-card>
                    </v-menu>
                </div>
            </v-col>
            <v-col sm="6" md="6" lg="6">
                <h3 class="risk-score__legend-header">
                    <v-subheader>Profile Benchmarks</v-subheader>
                    <!-- Popover -->
                    <v-menu offset-y z-index="10" max-width="250px" left
                        class="risk-score__popover">
                        <template v-slot:activator="{ on, attrs }">
                            <button v-bind="attrs" v-on="on" type="button"
                                aria-label="Profile Benchmarks Informational">&#9432;</button>
                        </template>
                        <v-card color="#fff">
                            <v-card-text>
                                <p>The Profile Benchmarks are aligned to
                                Morningstar's Target Allocation Indexes,
                                and their scores reflect the equity exposure of each index.</p>
                                <p>The indexes represent the holdings and asset mixes of all
                                fixedallocation funds, from conservative to aggressive,
                                available in your local market.</p></v-card-text>
                        </v-card>
                    </v-menu>
                </h3>
                <v-list flat class="risk-score__legends">
                    <v-list-item
                        v-for="(item, i) in computedLegendsData"
                        :key="i"
                        class="risk-score__legends-item">
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                            {{ item.value }}
                        <v-divider></v-divider>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import legendsData from '@/components/risk-score/config/profile-benchmarks.json';
import Service from './gauge-chart-service';

export default {
    name: 'risk-score',
    props: {
        /** Add unique ID */
        chartId: {
            type: String,
            default: 'gauge-chart',
        },
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            chartSettings: {
                arrowPoints: [-31, 31, -17, 28, -28, 17],
                baseColor: '#000000',
                benchmarkHoverArcWidth: 16,
                defaultModColors: {
                    0: '#ddcde9',
                    100: '#9741DB',
                },
                enableHoverAnimation: true,
                gaugeAnimation: {
                    arrowEaseNormal: 'in-out',
                    arrowEaseOutOfRange: 'bounce',
                    comfortEase: 'in-out',
                    enableComfortFadeIn: true,
                },
                gaugeStartAngle: -135,
                gaugeEndAngle: 135,
                innerCircleOuterRadius: 33,
                innerRadius: 52,
                markerColor: 'rgba(0, 0, 0, 0.62)',
                markerTextLetterWidth: 6,
                maxValue: 150,
                minValue: 0,
                modColors: {
                    comfort: '#4975B9',
                    nearComfort: '#C6D2E4',
                    baseColor: '#E5E5E5',
                },
                offScaleColor: '#f5c400',
                offScaleMarkerWidth: 6,
                onLightGray: {
                    modColors: {
                        comfort: '#3062AE',
                        nearComfort: '#A3B9DD',
                        baseColor: '#CCCCCC',
                    },
                    markerColor: 'rgba(0, 0, 0, 0.76)',
                },
                outerRadius: 68,
                size: 160,
                transitionMs: {
                    default: 500,
                    comfortAnimationDelay: 0,
                    comfortArc: 500,
                    nearComfortArc: 500,
                    markerText: 400,
                    markerTextAppearsIn: 500,
                    markerTextDisappearsIn: 200,
                    warningIconAnimationOffsetDelay: 1.2,
                },
            },
            gaugeType: 'default',
            legends: ['ultraConservative', 'conservative', 'moderateConservative', 'moderate', 'moderateAggressive', 'aggressive', 'ultraAggressive'],
            legendsData,
        };
    },
    computed: {
        computedLegendsData() {
            const legendData = {};
            const legendNames = this.legends;

            if (legendNames && legendNames.length > 0) {
                legendNames.forEach((legend) => {
                    if (this.legendsData[legend]) {
                        legendData[legend] = this.legendsData[legend];
                    }
                });
            }

            return legendsData;
        },
        parsedModelData() {
            const portfolioRiskScore = this.modelData
                ? this.modelData?.riskScore[0]?.portfolioRiskScore : null;
            return (portfolioRiskScore === null || portfolioRiskScore === undefined)
                ? null : Math.round(portfolioRiskScore);
        },
        showAlertTooltip() {
            return this.parsedModelData > this.chartSettings.maxValue;
        },
    },
    mounted() {
        const data = {
            riskScore: this.parsedModelData,
            comfortRanges: null,
        };
        if (this.$refs.chart && this.parsedModelData) {
            Service.initChart(this, this.chartSettings, this.chartId);
            Service.update(data);
        }
    },
};
</script>
<style lang="scss">
    @use "sass:map";
    @use '~@/components/shared/scss/mixin.scss' as mixin;
    .risk-score {
        @media only screen and (min-width: 768px) {
            &__chart {
                margin-top: 70px;
            }
        }
        @include mixin.wal-component-title;
        &__chart {
            transform: scale(1.35);
            text-align: center;
            position: relative;
            .warning-btn.v-btn {
                position: absolute;
                top: calc(100% - 33px);
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #f5c400;
            }
        }

        .v-menu__content {
            background: mixin.$wal-color-white;
        }

        &__legends-item.v-list-item {
            padding: map.get(mixin.$wal, 'space', '1-and-a-half-x');
            min-height: 0;
            font-size: map.get(mixin.$wal, 'font-size', 's');
            @include mixin.border(mixin.$wal-color-light-grey-1, bottom, 1px, solid);

            .v-list-item__title {
                font-size: map.get(mixin.$wal, 'font-size', 's');
                color: mixin.$wal-color-black;
            }

            &:last-child {
                border-bottom: none;
            }
        }

        &__legend-header  {
            display: inline-flex;
            .v-subheader {
                height: map.get(mixin.$wal, 'space', '1-and-a-quarter-x');
                padding-right: map.get(mixin.$wal, 'space', 'half-x');
                padding-left: map.get(mixin.$wal, 'space', '1-and-a-quarter-x');
            }

            button {
                margin-top: map.get(mixin.$wal, 'space', '1-and-a-quarter-x') * -1;
                outline: 0;
            }
        }

        &__popover {
            background: mixin.$wal-color-white;
        }

        .gauge-chart-value {
            font-size: map.get(mixin.$wal, 'space', '3-and-a-half-x');
            fill: mixin.$wal-color-black;
            font-weight: 200;
        }

        .gauge-chart-max-value, .gauge-chart-min-value {
            font-size: map.get(mixin.$wal, 'font-size', 's');
            fill: mixin.$wal-color-black;
        }

        .marker-text-value {
            fill: mixin.$wal-color-black;
            font-size: map.get(mixin.$wal, 'space', '1-and-a-quarter-x');
            font-weight: 400;
            letter-spacing: -0.5px;
            opacity: 0;
        }

        .tick-hover-area {
            cursor: pointer;
        }

        .tick-group--hovered .tick {
            stroke: rgba(0, 0, 0, 1) !important;
        }
    }
</style>

<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Sustainability</h2>
            </v-col>
        </v-row>
        <v-row
            v-if="hasEsgData"
        >
            <template v-for="type in [corporate, sovereign]">
                <v-col :key="type.type"
                       class="pb-16"
                       cols="12"
                       lg="6"
                       md="6"
                >
                    <h3 class="title">{{ type.label }}</h3>
                    <div class="esg" :key="type.type" v-if="hasTypeData(type)">
                        <section class="esg-legend">
                            <ul class="esg-legend-list-group">
                                <li class="esg-legend-list-group__item">
                                    <div class="esg-legend-circle">
                                        <div class="esg-legend-circle-inner"></div>
                                    </div>
                                    <span :title="type.portfolioName"
                                          class="esg-legend-name list-group__item-text">
                                        {{
                                            `${type.portfolioName}
                                                (Based on
                                                ${type.portfolioAum}% of AUM)`
                                        }}
                                    </span>
                                </li>
                                <li class="esg-legend-list-group__item">
                                    <div class="esg-benchmark-line esg-legend-benchmark-line">
                                        <div class="esg-benchmark-line-content"></div>
                                    </div>
                                    <span :title="type.benchmarkName"
                                          class="esg-legend-name list-group__item-text">
                                        {{ `${type.benchmarkName}` }}
                                    </span>
                                </li>
                            </ul>
                        </section>
                        <section class="esg-bar mt-12">
                            <span class="esg-bar-start-value">{{ range[0] }}</span>
                            <div class="esg-bar-linear">
                                <div class="esg-bar-benchmark-line"
                                     :style="type.type === 'corporate'
                                        ? corporatePositionBenchmarkLine
                                        : sovereignPositionBenchmarkLine">
                                    <div class="esg-bar-benchmark-line-content"/>
                                    <span class="esg-bar-benchmark-text">
                                        {{
                                            type.type === 'corporate'
                                                ? type.benchmarkCorporateSustainabilityScore
                                                : type.benchmarkSovereignSustainabilityScore
                                        }}
                                    </span>
                                </div>
                                <div
                                    class="esg-bar-circle-inner"
                                    :style="type.type === 'corporate'
                                            ? corporatePositionESGCircle
                                            : sovereignPositionESGCircle"
                                >
                                    <div class="esg-bar-circle-inner__tooltip">
                                            <span>
                                                {{
                                                    type.type === 'corporate'
                                                        ? type.portfolioCorporateSustainabilityScore
                                                        : type.portfolioSovereignSustainabilityScore
                                                }}
                                            </span>
                                    </div>
                                </div>
                            </div>
                            <span class="esg-bar-start-text">Low ESG Risk</span>
                            <span class="esg-bar-end-text">Severe ESG Risk</span>
                            <span class="esg-bar-end-value">{{ range[1] }}</span>
                        </section>
                    </div>
                    <span class="warning-message" v-else>{{ message }}</span>
                </v-col>
            </template>
            <v-col
                cols="12">
                <section v-if="pillarData.length">
                    <h3 class="title">Corporate ESG Pillars (lower scores = lower risk)</h3>
                    <div class="esg-data">
                        <div
                            v-for="pillar in pillarData"
                            :key="pillar.scoreType"
                            class="esg-data-pillar">
                            <div
                                :class="['esg-data-pillar__icon',
                            `esg-data-pillar__icon--${ pillar.scoreType.toLowerCase() }`]"
                                aria-hidden="true"
                            ></div>
                            <div
                                :class="`esg-data-pillar__${ pillar.scoreType.toLowerCase() }`">
                                <div class="esg-data-pillar__value">
                                    {{ pillar.score }}
                                </div>
                                <div class="esg-data-pillar__label">
                                    {{ pillar.scoreType }}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </v-col>
        </v-row>
        <v-row
            v-else
            class="text-center"
        >
            <v-col>
                No Data Available
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { get } from 'lodash';
import ComponentMixin from '../component-helper-mixin';
import mappings from './config/mapping.json';

export default {
    mixins: [ComponentMixin],
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: Object,
        /** Accepts the range of score to be plotted on esg bar. */
        range: {
            type: Array,
            default: () => [0, 50],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            barWidth: null,
            corporate: {},
            enableBenchmark: false,
            message: '',
            pillarData: [],
            sovereign: {},
        };
    },
    watch: {
        modelData: {
            handler(newVal) {
                this.generateSustainabilityData(newVal);
            },
            immediate: true,
        },
    },
    computed: {
        corporatePositionBenchmarkLine() {
            const score = this.corporate.benchmarkCorporateSustainabilityScore;
            return this.calculatePosition(score, this.barWidth);
        },
        corporatePositionESGCircle() {
            const score = this.corporate.portfolioCorporateSustainabilityScore;
            return this.calculatePosition(score, this.barWidth);
        },
        hasEsgData() {
            return !!Object.keys(this.modelData).length;
        },
        sovereignPositionBenchmarkLine() {
            const score = this.sovereign.benchmarkSovereignSustainabilityScore;
            return this.calculatePosition(score, this.barWidth);
        },
        sovereignPositionESGCircle() {
            const score = this.sovereign.portfolioSovereignSustainabilityScore;
            return this.calculatePosition(score, this.barWidth);
        },
    },
    mounted() {
        this.barWidth = this.$el
            .querySelector('.esg-bar-linear')?.clientWidth;
        const SustainabilityComp = this;
        window.addEventListener('resize', () => {
            this.barWidth = SustainabilityComp.$el
                .querySelector('.esg-bar-linear')?.clientWidth;
        });
    },
    methods: {
        calculatePosition(score, width) {
            const position = ((score / this.range[1]) * width);
            return { transform: `translateX(${position}px)` };
        },
        generateSustainabilityData(data = {}) {
            const esgBreakdownData = {};
            const portfolio = get(data, 'portfolio', {});
            const benchmark = get(data, 'benchmark', {});
            const portfolioCorporateSustainabilityScore = this.formatNumber(
                get(portfolio, 'esgRisk.portfolioCorporateSustainabilityScore'),
                2,
            );
            const portfolioSovereignSustainabilityScore = this.formatNumber(
                get(portfolio, 'esgRisk.portfolioSovereignSustainabilityScore'),
                2,
            );
            const benchmarkCorporateSustainabilityScore = this.formatNumber(
                get(benchmark, 'esgRisk.historicalCorporateSustainabilityScore'),
                2,
            );
            const benchmarkSovereignSustainabilityScore = this.formatNumber(
                get(benchmark, 'esgRisk.historicalSovereignSustainabilityScore'),
                2,
            );
            if (portfolioCorporateSustainabilityScore) {
                this.corporate = {
                    type: 'corporate',
                    label: mappings.dataPoints.corporate,
                    portfolioName: portfolio.name,
                    benchmarkName: benchmark.name,
                    portfolioAum: this.formatNumber(
                        get(portfolio, 'esgRisk.corporateSustainabilityRatingPercentOfEligiblePortfolioCovered'),
                        2,
                    ),
                    portfolioCorporateSustainabilityScore,
                    benchmarkCorporateSustainabilityScore,
                };
            }

            if (portfolioSovereignSustainabilityScore) {
                this.sovereign = {
                    type: 'sovereign',
                    label: mappings.dataPoints.sovereign,
                    portfolioName: portfolio.name,
                    benchmarkName: benchmark.name,
                    portfolioAum: this.formatNumber(
                        get(portfolio, 'esgRisk.sovereignSustainabilityRatingPercentOfEligiblePortfolioCovered'),
                        2,
                    ),
                    portfolioSovereignSustainabilityScore,
                    benchmarkSovereignSustainabilityScore,
                };
            }

            esgBreakdownData.environmentalScore = this.formatNumber(
                get(portfolio, 'esgRisk.portfolioEnvironmentalRiskScore'),
                2,
            );
            esgBreakdownData.socialScore = this.formatNumber(
                get(portfolio, 'esgRisk.portfolioSocialRiskScore'),
                2,
            );
            esgBreakdownData.governanceScore = this.formatNumber(
                get(portfolio, 'esgRisk.portfolioGovernanceRiskScore'),
                2,
            );
            esgBreakdownData.unallocatedScore = this.formatNumber(
                get(portfolio, 'esgRisk.portfolioUnallocatedESGRiskScore'),
                2,
            );

            this.pillarData = [];

            Object.entries(esgBreakdownData).forEach((pillar) => {
                const obj = {
                    scoreType: mappings.dataPoints[pillar[0]],
                    score: this.formatNumber(pillar[1], 2),
                };
                this.pillarData.push(obj);
            });
        },
        hasTypeData(type) {
            if (type.type === 'corporate'
                && isFinite(type.portfolioCorporateSustainabilityScore)) {
                return true;
            }
            if (isFinite(type.portfolioSovereignSustainabilityScore)) {
                return true;
            }
            this.message = `The ${mappings.dataPoints[type.type]} is not available for the
                                    ${type.portfolioName}.
                                    The portfolio needs to have at least 67% of the eligible
                                    ${type.type} assets covered with ESG research in order to receive a
                                    ${mappings.dataPoints[type.type]}.`;
            return false;
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

$bar-height: map.get(mixin.$wal, 'space', '5-x');
$space-2-x: map.get(mixin.$wal, 'space', '2-x');
$space-3-x: map.get(mixin.$wal, 'space', '3-x');
$space-2-and-a-half-x: map.get(mixin.$wal, 'space', '2-and-a-half-x');

$label-font-size: map.get(mixin.$wal, 'font-size', 's');

@include mixin.wal-component-title;
h3.title {
    @include mixin.wal-heading(3, true);
}

.esg {
    &-bar {
        display: flex;
        position: relative;

        &-linear {
            height: $bar-height;
            width: 100%;
            background: linear-gradient(
                    90deg, #969BBB 0%, #D0D3C1 29.17%, #F1F39B 69.79%, #FFB904 100%
            );
        }

        &-start-value,
        &-end-value {
            display: inline-block;
            box-sizing: border-box;
            text-align: center;
            font-size: $label-font-size;
            line-height: map.get(mixin.$wal, 'line-height', 'level-3');
            color: mixin.$wal-color-dark-grey;
        }

        &-start-value {
            padding-top: map.get(mixin.$wal, 'space', '1-x');
            padding-right: map.get(mixin.$wal, 'space', '1-x');
            width: $space-2-x;
        }

        &-end-value {
            padding-top: map.get(mixin.$wal, 'space', '1-x');
            padding-left: map.get(mixin.$wal, 'space', '1-x');
            width: $space-2-and-a-half-x;
        }

        &-start-text,
        &-end-text {
            display: inline-block;
            position: absolute;
            font-size: $label-font-size;
            line-height: map.get(mixin.$wal, 'line-height', 'level-6');
            margin: map.get(mixin.$wal, 'space', '2-x');
            top: map.get(mixin.$wal, 'space', '6-x');
        }

        &-start-text {
            left: 0;
        }

        &-end-text {
            right: 0;
        }

        &-benchmark-line {
            position: absolute;
            top: 0;
            z-index: 1;
            height: $bar-height;
            @include mixin.border(mixin.$wal-color-dark-grey, left, 1px, dotted);
            border-right: 0;
        }

        &-benchmark-text {
            display: inline-block;
            position: absolute;
            top: 45px;
            left: 50%;
            transform: translateX(-50%);
            font-size: map.get(mixin.$wal, 'font-size', 'l');
            font-weight: mixin.$wal-font-weight-regular;
            line-height: map.get(mixin.$wal, 'line-height', 'level-6');
            color: mixin.$wal-color-dark-grey;
            text-align: center;
        }

        &-circle-inner {
            height: $space-2-and-a-half-x;
            width: $space-2-and-a-half-x;
            border-radius: 50%;
            @include mixin.border(mixin.$wal-color-light-blue, all, 3px);
            position: absolute;
            top: map.get(mixin.$wal, 'space', '1-and-a-quarter-x');

            &__tooltip {
                color: mixin.$wal-color-white;
                border-radius: map.get(mixin.$wal, 'space', 'half-x');
                font-size: $label-font-size;
                line-height: map.get(mixin.$wal, 'line-height', 'level-6');
                display: inline-block;
                padding: 5px map.get(mixin.$wal, 'space', '2-x');
                position: absolute;
                opacity: 0.9;
                pointer-events: none;
                background-color: mixin.$wal-color-light-blue;
                bottom: map.get(mixin.$wal, 'space', '4-x');
                transform: translate(-40%);
            }
        }
    }

    &-legend {
        &-circle,
        &-name,
        &-benchmark-line {
            display: inline-block;
        }

        &-name,
        &-value {
            font-size: map.get(mixin.$wal, 'font-size', 's');
            line-height: 1.2;
            font-weight: mixin.$wal-font-weight-regular;
        }

        &-name {
            text-align: left;
        }

        &-value {
            text-align: right;
        }

        &-list-group {
            margin: 0 0 map.get(mixin.$wal, space, '3-x');

            &__item {
                border-top: 0;
                display: inline-block;
            }
        }

        &-benchmark-line {
            @include mixin.border(mixin.$wal-color-dark-grey, left, 1px, dotted);
            border-right: 0;
            height: map.get(mixin.$wal, space, '1-and-a-half-x');
            margin: 0 map.get(mixin.$wal, space, 'half-x');
        }

        &-circle-inner {
            height: $space-2-x;
            width: $space-2-x;
            border-radius: 50%;
            @include mixin.border(mixin.$wal-color-light-blue, all, 3px);
            position: relative;
            top: 3px;
        }
    }

    &-data {
        display: flex;
        flex-wrap: wrap;

        &-pillar {
            display: flex;
            margin: 0 $space-3-x $space-2-x 0;
            flex: 1;

            &__icon {
                height: 46px;
                width: 46px;
                margin-bottom: 6px;
                margin-right: 6px;
                background-repeat: no-repeat;

                &--environmental {
                    background-image: url('./assets/images/esg-environmental.svg');
                }

                &--social {
                    background-image: url('./assets/images/esg-social.svg');
                }

                &--governance {
                    background-image: url('./assets/images/esg-governance.svg');
                }

                &--unallocated {
                    background-image: url('./assets/images/esg-unallocated.svg');
                }
            }

            &__value {
                color: mixin.$wal-color-light-green;
                font-size: 23px;;
                line-height: 27px;
            }

            &__label {
                color: mixin.$wal-color-light-green;
                font-size: 16px;
                font-weight: bold;
                line-height: 21px;
                min-width: 77px;
            }
        }
    }
}

ul {
    padding: 0 !important;
}

</style>

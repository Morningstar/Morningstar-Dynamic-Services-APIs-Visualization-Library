<template>
    <v-row class="risk-score-table">
        <v-col>
            <hr class="risk-score-table__top-border"/>
            <v-row class="risk-score-table--score">
                <v-col class="col-left">
                    <span>Risk Score</span>
                </v-col>
                <v-col class="col-right">
                    <span v-if="riskScore >= 0">{{ riskScore }}</span>
                </v-col>
            </v-row>
            <hr class="risk-score-table__bottom-border"/>
            <v-row class="risk-score-table--level">
                <v-col class="col-left">
                    <span>Risk Level</span>
                    <v-menu offset-y :close-on-content-click="false" location="end">
                        <template v-slot:activator="{ on }">
                            <v-btn small icon v-on="on">
                            <v-icon dark small color="black">mdi-information-outline</v-icon>
                            </v-btn>
                        </template>
                        <div class="menu-popover">
                            <b>About Risk Levels</b>
                            <hr/>
                            <span>The Morningstar Portfolio Risk Score (MPRS) measures the overall
                                risk of portfolios including client portfolios, model portfolios,
                                and fund portfolios. MPRS uses Morningstar Risk Model's
                                holdings-based analysis to derive a risk estimate and
                                score for each portfolio, and Morningstar's multi-asset Target
                                Allocation Indexes to define the following risk ranges:</span>
                            <br/>
                            <v-row class="menu-popover__legends-headings">
                                <v-col>
                                    <div class="legends-col">
                                        <div class="legends-col__color" style="width: 30px;"></div>
                                        <div class="legends-col__risk">Range</div>
                                        <div class="legends-col__risk">Risk Level</div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div class="popover__row">
                                        <div id="riskLevelGradient" class="Conservative-risk"></div>
                                        <div class="risk-range-column">0</div>
                                        <div class="risk-level-column">Conservative</div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div class="popover__row">
                                        <div id="riskLevelGradient" class="moderate-risk"></div>
                                        <div class="risk-range-column">25</div>
                                        <div class="risk-level-column">Moderate</div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div class="popover__row">
                                        <div id="riskLevelGradient" class="aggressive-risk"></div>
                                        <div class="risk-range-column">50</div>
                                        <div class="risk-level-column">Aggressive</div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div class="popover__row">
                                        <div id="riskLevelGradient"
                                            class="very-aggressive-risk"></div>
                                        <div class="risk-range-column">82</div>
                                        <div class="risk-level-column">Very Aggressive</div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="extreme-risk">
                                <v-col>
                                    <div class="popover__row">
                                        <div class="extreme-risk--gradient"></div>
                                        <div class="risk-range-column">100+</div>
                                        <div class="risk-level-column">Extreme Risk</div>
                                    </div>
                                </v-col>
                            </v-row>
                            <span>You can use MPRS to immediately see how much risk a portfolio is
                                taking, and use Morningstar's Risk Profiler to generate a
                                personalized Risk Comfort Range for each of your clients.</span>
                        </div>
                    </v-menu>
                </v-col>
                <v-col class="col-right">
                    <span>{{ riskScoreLevel }}</span>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'risk-score-table',
    props: {
        riskScore: Number,
    },
    computed: {
        riskScoreLevel() {
            switch (true) {
            case this.riskScore >= 0 && this.riskScore < 25: {
                return 'Conservative';
            }
            case this.riskScore >= 25 && this.riskScore < 50: {
                return 'Moderate';
            }
            case this.riskScore >= 50 && this.riskScore < 82: {
                return 'Aggressive';
            }
            case this.riskScore >= 82 && this.riskScore <= 100: {
                return 'Very Aggressive';
            }
            case this.riskScore > 100: {
                return 'Extreme Risk';
            }
            default:
                return '';
            }
        },
    },
};
</script>

<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.risk-score-table {
    .col-left {
        width: 102px;
        height: fit-content;
        font-style: normal;
        font-weight: 400;
        font-size: map.get(mixin.$wal, 'font-size', 's');
        line-height: 18px;
        color: mixin.$wal-color-dark-grey;
        flex: none;
        order: 0;
        flex-grow: 1;
        text-align: left;
    }

    .col-right {
        width: 72px;
        height: fit-content;
        font-style: normal;
        font-weight: 700;
        font-size: map.get(mixin.$wal, 'font-size', 's');
        line-height: 18px;
        text-align: right;
        color: mixin.$wal-color-dark-grey;
        flex: none;
        order: 0;
        flex-grow: 1;
    }

    &__top-border {
        height: 1px;
        border: 0;
        background: #808080;
    }

    &__bottom-border {
        height: 1px;
        border: 0;
        background: mixin.$wal-color-regular;
    }

    &--score {
        padding: 10px 0 10px 0;
    }

    &--level {
        padding: 10px 0 10px 0;
    }
}

.v-menu__content {
        max-width: 400px;
        background-color: mixin.$wal-color-white;
        padding: 16px;
        font-size: map.get(mixin.$wal, 'font-size', 's');
}

.menu-popover {
    hr {
        height: 1px;
        border: 0;
        background-color: #808080;
        margin: 10px 0 ;
    }
}

.legends-col {
    display: flex;
    flex-direction: row;
}

.legends-col__risk {
    color: #5e5e5e;
    font-weight: 400;
    padding-left: 9px;
    margin-right: 8px;
    margin-top: 10px;
    font-style: normal;
    font-size: map.get(mixin.$wal, 'font-size', 's');
    color: mixin.$wal-color-dark-grey;
    border: none;
}

.popover__row {
    display: flex;
    flex-direction: row;
}

#riskLevelGradient {
    width: 40px;
    height: 50px;
    margin-top: 2px;
}

.risk-range-column {
    width: 50px;
    height: 18px;
    top: 0;
    margin-left: 9px;
    margin-right: 8px;
    font-style: normal;
    font-weight: 700;
    font-size: map.get(mixin.$wal, 'font-size', 's');
    color: mixin.$wal-color-dark-grey;
    border-top: 1px solid #ababab;
    text-align: left;
}

.risk-level-column {
    width: 100%;
    height: 18px;
    font-style: normal;
    font-weight: 400;
    font-size: map.get(mixin.$wal, 'font-size', 's');
    line-height: 18px;
    color: mixin.$wal-color-dark-grey;
    border-top: 1px solid #ababab;
    text-align: left;
}

.extreme-risk {
    margin-bottom: 10px;
    &--gradient {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            top: 50%;
            width: 100%;
            background-color: #ed4a04;
            height: 2px;
        }
        background: linear-gradient(180deg, rgba(237, 74, 4, 0.7) 0%, rgba(237, 74, 4, 0) 100%);
        width: 40px;
        height: 30px;
        margin-top: 2px;
    }
}

.menu-popover {
    &__legends-headings {
        margin-top: 10px;
    }

    .col {
        padding: 0 12px 0 12px;
    }

    .Conservative-risk {
        background:linear-gradient(180deg, #1D469A 0%, #55378C 100%)
    }

    .moderate-risk {
        background:linear-gradient(180deg, #55378C 0%, #8C297F 100%)
    }

    .aggressive-risk {
        background:linear-gradient(180deg, #8C297F 0%, #98245C 100%)
    }

    .very-aggressive-risk {
        background:linear-gradient(180deg, #98245C 0%, #A12040 100%)
    }
}
</style>

<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Portfolio Risk Score</h2>
            </v-col>
        </v-row>
        <v-row v-if="riskScore" class="risk-score">
            <v-col sm="6" md="6" lg="6">
                <div class="risk-score-dial" :style="cssVars">
                    <div class="dial-container">
                        <div class="risk-text-container">
                            <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                            <path id="curve" d="M 50 255 Q 15 220 15 180" fill="transparent" />
                            <path id="curve2" d="M 35 70 Q 70 20 120 20" fill="transparent" />
                            <path id="curve3" d="M 220 35 Q 280 60 280 180" fill="transparent" />
                            <path id="curve4" d="M 280 200 Q 265 250 210 280" fill="transparent" />
                            <text class="risk-text">
                                <textPath xlink:href="#curve">Conservative</textPath>
                            </text>
                            <text class="risk-text">
                                <textPath xlink:href="#curve2">Moderate</textPath>
                            </text>
                            <text class="risk-text">
                                <textPath xlink:href="#curve3">Aggressive</textPath>
                            </text>
                            <text class="risk-text">
                                <textPath xlink:href="#curve4">Very Aggressive</textPath>
                            </text>
                            </svg>
                        </div>
                        <div class="dial-background">
                            <div class="fade-area"></div>
                        </div>
                        <div class="score-dial-container">
                            <div v-if="isExtremeRisk" class="extreme-risk-container">
                                <svg
                                    width="232"
                                    height="232"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <clipPath id="medium-extreme">
                                            <path
                                                d="M 190,224 C 183,228 176,232 168,234 L 160,214 C
                                                168,212 170,210 178,205 L 188,224 Z"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div class="extreme-risk"></div>
                                <div class="extreme-risk-marker-container">
                                    <div class="extreme-risk-marker"></div>
                                </div>
                            </div>

                            <div class="dial-circle">
                                <svg
                                    width="234"
                                    height="232"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <clipPath id="outline">
                                            <path
                                                d="M61.1414 203.351C57.7804 208.718 50.6663 210.395
                                                45.6527 206.526C29.1017 193.756 16.2942 176.671
                                                8.71034 157.06C-0.254749 133.877 -1.43573 108.416
                                                5.34494 84.5058C12.1256 60.5956 26.5015 39.5277
                                                46.3114 24.4694C66.1212 9.41113 90.2945 1.17627
                                                115.197 1.0028C140.1 0.829326 164.386 8.72663
                                                184.405 23.5075C204.423 38.2883 219.093 59.1538
                                                226.207 82.9673C233.322 106.781 232.497 132.255
                                                223.857 155.561C216.549 175.276 203.981 192.538
                                                187.611 205.537C182.652 209.475 175.515 207.898
                                                172.079 202.579C168.634 197.244 170.229 190.177
                                                175.101 186.103C187.313 175.888 196.711 162.635
                                                202.286 147.599C209.198 128.954 209.857 108.575
                                                204.166 89.5238C198.474 70.4731 186.739 53.7806
                                                170.724 41.956C154.709 30.1313 135.28 23.8135
                                                115.358 23.9522C95.4356 24.091 76.097 30.6789
                                                60.2491 42.7255C44.4012 54.7721 32.9005 71.6264
                                                27.476 90.7547C22.0514 109.883 22.9962 130.251
                                                30.1683 148.798C35.9526 163.755 45.5353 176.876
                                                57.8902 186.92C62.8176 190.926 64.5117 197.969
                                                61.1414 203.351Z"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                    <path
                                        d="M61.1414 203.351C57.7804 208.718 50.6663 210.395 45.6527
                                        206.526C29.1017 193.756 16.2942 176.671 8.71034
                                        157.06C-0.254749 133.877 -1.43573 108.416 5.34494
                                        84.5058C12.1256 60.5956 26.5015 39.5277 46.3114
                                        24.4694C66.1212 9.41113 90.2945 1.17627 115.197 1.0028C140.1
                                        0.829326 164.386 8.72663 184.405 23.5075C204.423 38.2883
                                        219.093 59.1538 226.207 82.9673C233.322 106.781 232.497
                                        132.255 223.857 155.561C216.549 175.276 203.981 192.538
                                        187.611 205.537C182.652 209.475 175.515 207.898 172.079
                                        202.579C168.634 197.244 170.229 190.177 175.101
                                        186.103C187.313 175.888 196.711 162.635 202.286
                                        147.599C209.198 128.954 209.857 108.575 204.166
                                        89.5238C198.474 70.4731 186.739 53.7806 170.724
                                        41.956C154.709 30.1313 135.28 23.8135 115.358
                                        23.9522C95.4356 24.091 76.097 30.6789 60.2491
                                        42.7255C44.4012 54.7721 32.9005 71.6264 27.476
                                        90.7547C22.0514 109.883 22.9962 130.251 30.1683
                                        148.798C35.9526 163.755 45.5353 176.876 57.8902
                                        186.92C62.8176 190.926 64.5117 197.969 61.1414 203.351Z"
                                        fill="transparent"
                                        stroke="#999999"
                                        stroke-width="2"
                                    />
                                </svg>
                            </div>
                            <div class="dial-circle-inner"></div>
                            <div
                                v-for="x in segments"
                                :key="x"
                                class="dial-marker-container"
                                :class="`risk-score-${x}`"
                            >
                                <div class="marker"></div>
                            </div>
                            <div
                                v-if="isExtremeRisk"
                                class="dial-pointer-container"
                                :class="`risk-score-extreme-animated`"
                            >
                                <div
                                    class="dial-needle"
                                    :class="{
                                        'outside-comfort': true,
                                    }"
                                ></div>
                            </div>
                            <div
                                v-if="!isExtremeRisk"
                                class="dial-pointer-container"
                                :class="`risk-score-${
                                    riskScore <= 100 ? riskScore : 100
                                }-animated`"
                            >
                                <div
                                    class="dial-needle"
                                    :class="{
                                        'outside-comfort': true,
                                    }"
                                ></div>
                            </div>
                            <div
                                class="dial-circle-pointer-text"
                                :class="{
                                    [`incrementing-score-${
                                        riskScore <= 100 ? riskScore : 100
                                    }-animated`]: true,
                                }"
                            >
                                <span v-if="riskScore <= 100" style="color: #333333">{{
                                    riskScore
                                }}</span>
                                <span v-if="riskScore > 100" style="color: #ed4a04">
                                    {{ getExtremeRisk }}
                                    <div class="extreme-plus">+</div>
                                </span>
                            </div>
                            <div class="dial-range-container">
                                <div class="minimum-score">0</div>
                                <div v-if="!isExtremeRisk" class="maximum-score">100</div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col sm="6" md="6" lg="6" class="risk-score__table">
                <risk-score-table
                    :risk-score="riskScore"
                ></risk-score-table>
            </v-col>
        </v-row>
        <v-row v-else class="text-center">
            <v-col>No Data Available</v-col>
        </v-row>
    </div>
</template>

<script>
import RiskScoreTable from './RiskScoreTable.vue';

export default {
    name: 'risk-score',
    components: {
        RiskScoreTable,
    },
    props: {
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
            rangeLow: 0,
            rangeHi: 0,
            segments: [25, 49, 80],
        };
    },
    computed: {
        riskScore() {
            const portfolioRiskScore = this.modelData && Object.prototype.hasOwnProperty.call(this.modelData, 'riskScores')
                ? this.modelData?.riskScores[0]?.portfolio?.riskScore
                : null;
            return portfolioRiskScore === null || portfolioRiskScore === undefined
                ? null
                : Math.round(portfolioRiskScore);
        },
        isExtremeRisk() {
            return this.riskScore > 100;
        },
        cssVars() {
            return {
                '--range-deg': this.computeRangePos,
                '--range-deg2': this.computeRangePos2,
            };
        },
        computeRangePos() {
            const pos = (this.rangeLow + (this.rangeHi - this.rangeLow) / 2) / 100.0;
            const deg = 295 * pos - 147.5;
            return `${deg}deg`;
        },
        computeRangePos2() {
            const pos = (this.rangeLow + (this.rangeHi - this.rangeLow) / 2) / 100.0;
            const deg = 295 * pos - 147.5;
            return `${-deg}deg`;
        },
        getExtremeRisk() {
            return (this.riskScore > 100 && this.riskScore <= 200) ? 100 : 200;
        },
    },
};
</script>
<style lang="scss">
@import "./styles/variables";
@import "./styles/risk-score.scss";
</style>

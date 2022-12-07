<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Risk Statistics</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                class="text-center"
                v-if="!parsedModelData.length"
            >
                No data available
            </v-col>
            <v-col
                cols="12"
                v-else
            >
                <v-simple-table>
                    <template v-slot:default>
                        <thead class="header">
                            <tr>
                                <th
                                    v-for="(field, index) in fieldDefinitions"
                                    :key="index"
                                    :colspan="index === 0 ? 2 : 1"
                                    class="text-right"
                                >
                                    <span class="header__text">
                                        {{ field.text }}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in parsedModelData" :key="item.name">
                                <td class="text-left">{{item.name || '-'}}</td>
                                <td
                                    v-for="(field, index) in fieldDefinitions"
                                    :key="index"
                                    class="text-right"
                                >
                                    {{ item[field.value] || '-'}}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { get } from 'lodash';

export default {
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: Object,
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Gives control to show different years on column header. */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    text: 'Year 1',
                    value: 'year1',
                },
                {
                    text: 'Year 3',
                    value: 'year3',
                },
                {
                    text: 'Year 5',
                    value: 'year5',
                },
                {
                    text: 'Year 10',
                    value: 'year10',
                },
            ],
        },
    },
    computed: {
        parsedModelData() {
            const xray = this.modelData;
            const results = [];

            if (xray) {
                const riskStatistics = get(xray, 'RiskStatistics', []);
                const captureRatio = get(xray, 'CaptureRatio.Portfolio', []);
                const drawdown = get(xray, 'Drawdown.Portfolio', []);
                const statsDataPoints = [
                    'SharpeRatio',
                    'InformationRatio',
                    'MaxDrawdown',
                    'Upside',
                    'Downside',
                ];

                statsDataPoints.forEach((data) => {
                    const result = {
                        name: data,
                    };
                    const name = data.split(/(?=[A-Z])/);

                    switch (true) {
                    case Object.keys(riskStatistics[0]?.Portfolio || {}).indexOf(data) > -1:
                        riskStatistics.forEach((statsData) => {
                        // eslint-disable-next-line max-len
                            result[statsData.TrailingTimePeriod.toLowerCase()] = statsData.Portfolio[result.name] || null;
                        });
                        result.name = `${name[0]} ${name[1]}`;
                        break;
                    case Object.keys(captureRatio).indexOf(data) > -1:
                        result.name = `${data} Capture Ratio`;
                        captureRatio[data].TimePeriod.forEach((statsData) => {
                            result[statsData.Id.toLowerCase()] = statsData.Value.toFixed(2);
                        });
                        break;
                    case Object.keys(drawdown.PortfolioDrawdownItem || {}).indexOf(data) > -1:
                        result.name = `${name[0]} ${name[1]} %`;
                        drawdown.TimePeriods.forEach((statsData) => {
                            result[statsData.id.toLowerCase()] = statsData.DrawdownItem
                                ? statsData.DrawdownItem[data].toFixed(2) : null;
                        });
                        break;
                    default:
                        break;
                    }
                    results.push(result);
                });
            }

            return results;
        },
    },
};
</script>
<style lang="scss" scoped>
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;
</style>

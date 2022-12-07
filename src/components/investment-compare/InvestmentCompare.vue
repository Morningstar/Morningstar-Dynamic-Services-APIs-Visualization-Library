<template>
    <div class="investment-compare">
        <v-container fluid>
            <v-row v-if="showHeader" no-gutters>
                <v-col cols="12" class="title">
                    <h2>Investment Compare</h2>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-simple-table class="investment-compare__table" v-if="parsedModelData">
                    <template v-slot:default>
                        <tbody>
                            <tr v-for="field in fieldDefinitions" :key="field.text"
                                :class="['investment-compare__row',
                                    {'investment-compare__row-header': field.header},
                                    {'investment-compare__row-sub-header': field.subHeader},
                                    {'investment-compare__row--sticky': field.sticky}]">
                                <th width="30%">
                                    <span v-if="!field.headerDataPoint">{{ field.text }}</span>
                                    <span v-else>
                                        {{ parsedModelData[0][field.headerDataPoint] }}</span>
                                </th>
                                <td v-for="(row, index) in parsedModelData"
                                    :key="index">
                                    <div v-if="field.customTemplate">
                                        <Custom
                                            :template="field.customTemplate"
                                            :row-data="row"
                                        />
                                    </div>
                                    <div v-else>
                                        <span v-if="field.format ==='number'">
                                            {{ formatNumber(row[field.value], 2) }}
                                        </span>
                                        <span v-else-if="field.format === 'percent'">
                                            {{ formatNumber(row[field.value], 2) ?
                                            formatNumber(row[field.value], 2) + '%' : '-' }}
                                        </span>
                                        <span v-else>{{ row[field.value] }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                <v-col v-else class="text-center">
                    No Data Available
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import {
    each, get, find, maxBy,
} from 'lodash';
import fieldDefinitions from '@/components/investment-compare/config/fieldDefinitions.json';
import mappings from '@/components/investment-compare/config/datapoint-mappings';
import Custom from '@/components/investment-compare/component/Custom.vue';
import ComponentMixin from '@/components/component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    components: {
        Custom,
    },
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Object, Array],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Define the table columns  */
        fieldDefinitions: {
            type: Array,
            default: () => fieldDefinitions,
        },
    },
    data() {
        return {
            calendarYearReturns: {
                historicalPerformanceFilters: {
                    Frequency: 'Y',
                    TimePeriod: 'M12',
                },
                trailingPerformanceFilters: {
                    Type: 'DayEnd',
                },
                trailingPerformanceTimePeriod: 'M0',
                fields: [
                    'CalendarYearReturnsYearToDate',
                    'CalendarYearReturnsYear1',
                    'CalendarYearReturnsYear2',
                    'CalendarYearReturnsYear3',
                    'CalendarYearReturnsYear4',
                    'CalendarYearReturnsYear5',
                    'CalendarYearReturnsYear6',
                    'CalendarYearReturnsYear7',
                    'CalendarYearReturnsYear8',
                    'CalendarYearReturnsYear9',
                    'CalendarYearReturnsYear10',
                ],
            },
            trailingPerformance: {
                criteria: {
                    Type: 'DayEnd',
                },
                fields: [
                    'OneDay',
                    'OneWeek',
                    'OneMonth',
                    'ThreeMonths',
                    'SixMonths',
                    'YearToDate',
                    'OneYearAnnualized',
                    'ThreeYearsAnnualized',
                    'FiveYearsAnnualized',
                    'TenYearsAnnualized',
                ],
            },
            returnType: 'GbPostTax',
        };
    },
    computed: {
        parsedModelData() {
            let currentSecurityObj;
            const transformedSecurityObj = [];
            if (this.modelData) {
                each(this.modelData, (item) => {
                    currentSecurityObj = item;
                    Object.entries(mappings).forEach(([key, value]) => {
                        currentSecurityObj[key] = get(currentSecurityObj, value, '-');
                    });
                    currentSecurityObj.Category = this.getBenchmarkName(currentSecurityObj, 'Category');
                    currentSecurityObj.BestFitIndex = this.getBenchmarkName(currentSecurityObj, 'CategoryPrimaryIndex');
                    currentSecurityObj.Style = this.getStyleBoxValue(currentSecurityObj);
                    currentSecurityObj.BondStyle = this.getStyleBoxValue(currentSecurityObj, 'BondStyleBoxBreakdown');
                    this.getCalendarYearReturns(currentSecurityObj);
                    this.getTrailingPerformance(currentSecurityObj);

                    transformedSecurityObj.push(currentSecurityObj);
                });
            }

            return transformedSecurityObj;
        },
    },
    methods: {
        getBenchmarkName(securityDetails, benchmarkType) {
            const categoryBenchmark = find(
                securityDetails.Benchmark,
                { Type: benchmarkType },
            );
            return get(categoryBenchmark, 'Name', '-');
        },
        getStyleBoxValue(securityDetails, styleBoxBreakdownDataPoint = 'StyleBoxBreakdown') {
            const styleBoxBreakdowns = securityDetails.Portfolios ? securityDetails.Portfolios[0][`${styleBoxBreakdownDataPoint}`] : [];
            const styleBoxBreakdown = find(styleBoxBreakdowns, { SalePosition: 'N' }) || {};
            const maxValue = maxBy(
                styleBoxBreakdown.BreakdownValues,
                (breakdownValue) => breakdownValue.Value,
            ) || {};
            return maxValue.Type;
        },
        getCalendarYearReturns(data) {
            const dataObj = data;
            const currentYear = new Date().getFullYear();
            const fieldNamePrefix = 'CalendarYearReturnsYear';
            const fieldNameSuffix = 'FullYear';

            const transformData = (historicalPerformance, trailingPerformance) => {
                let returnValues = historicalPerformance.Return || [];

                returnValues.forEach((returnValue) => {
                    const returnYear = returnValue.Date ? new Date(returnValue.Date).getFullYear()
                        : null;
                    const name = fieldNamePrefix + (currentYear - returnYear);
                    dataObj[name] = get(returnValue, 'Value', '-');
                });

                returnValues = trailingPerformance.Return || [];
                const ytdReturn = find(returnValues, {
                    TimePeriod: this.calendarYearReturns.trailingPerformanceTimePeriod,
                }) || {};
                dataObj.CalendarYearReturnsYearToDate = ytdReturn.Value || '-';

                dataObj.AsOfDate = (trailingPerformance.Date && new Date(trailingPerformance.Date)) || '-';
                return dataObj;
            };

            this.calendarYearReturns.fields.forEach((field) => {
                const fieldNumber = field.replace(/[^\d]/g, '');
                if (fieldNumber) {
                    dataObj[fieldNamePrefix + fieldNumber + fieldNameSuffix] = `${currentYear - fieldNumber}`;
                }
            });

            this.calendarYearReturns.historicalPerformanceFilters.ReturnType = this.returnType;
            this.calendarYearReturns.trailingPerformanceFilters.ReturnType = this.returnType;

            const historicalPerformance = find(
                dataObj.HistoricalPerformanceSeries,
                this.calendarYearReturns.historicalPerformanceFilters,
            ) || {};

            const trailingPerformance = find(
                dataObj.TrailingPerformance,
                this.calendarYearReturns.trailingPerformanceFilters,
            ) || {};

            return transformData(historicalPerformance, trailingPerformance);
        },
        getTrailingPerformance(data) {
            const dataObj = data;
            const ANNUAL_SUFFIX = 'ann';

            const transformData = (securityDetails, criteria) => {
                const trailingReturn = find(securityDetails.TrailingPerformance, criteria) || {};
                const returnItem = trailingReturn.Return || [];
                const securityData = securityDetails;

                each(returnItem, (item) => {
                    if (item.Annualized) {
                        securityData[item.TimePeriod + ANNUAL_SUFFIX] = get(item, 'Value', '-');
                    } else {
                        securityData[item.TimePeriod] = get(item, 'Value', '-');
                    }
                });
                return securityDetails;
            };
            return transformData(dataObj, this.trailingPerformance.criteria);
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.investment-compare {
    @include mixin.wal-component-title;
    @include mixin.wal-table;

    %sticky {
        position: sticky;
        background-color: #fff;
    }

    .header {
        &__text {
            font-size: 14px;
        }
    }

    .title {
        margin: 10px;
        &__text {
            font-size: 18px;
            font-weight: 500;
        }
    }

    &__table {
        border: thin solid rgba(0,0,0,.12);
    }

    table > tbody > tr th, table > tbody > tr td {
        border-right: thin solid rgba(0,0,0,.12);
        font-weight: normal;
        font-size: 14px !important;
    }

    table tr.investment-compare__row-header, table tr.investment-compare__row-header > th {
        border-right: 0;
        background-color: #eee;
        font-size: 16px !important;
        font-weight: 600;
    }

    table tr.investment-compare__row-sub-header th {
        border-right: 0;
        background-color: #eee;
        font-weight: 600;
    }

    .v-data-table__wrapper {
        height: 500px;
        overflow: auto;
    }

    table > tbody > tr > th {
        @extend %sticky;
        left: 0;
    }

    table > tbody > tr.investment-compare__row--sticky {
        @extend %sticky;
        top: 0;
        z-index: 2;
        box-shadow: 0 8px 6px -6px #eee;

    }

    &__title-header {
        padding: 10px;
    }
}
</style>

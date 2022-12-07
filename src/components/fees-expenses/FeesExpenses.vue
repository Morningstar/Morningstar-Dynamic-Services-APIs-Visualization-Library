<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Fees & Expenses</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                class="text-center"
                v-if="!isDataAvailable"
            >
                No Data Available
            </v-col>
            <v-col
                v-else
                cols="12"
            >
                <v-simple-table>
                    <template v-slot:default>
                        <thead class="header">
                            <tr v-if="setRowHeader">
                                <th
                                    v-if="fieldDefinitions.row.leftColumnHeaderText"
                                    class="text-left"
                                >
                                    <span class="header__text">
                                        {{ fieldDefinitions.row.leftColumnHeaderText }}
                                    </span>
                                </th>
                                <th
                                    v-if="fieldDefinitions.row.rightColumnHeaderText"
                                    class="text-right">
                                    <span class="header__text">
                                        {{ fieldDefinitions.row.rightColumnHeaderText }}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in parsedModelData" :key="index">
                                <td class="text-left">{{ item.feesExpensesKey }}</td>
                                <td class="text-right">{{
                                    formattedValue(item.expenses, item.type)}}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row v-if="showBreakdown">
            <v-btn plain @click="$emit('show-security-level-breakdown', {
                type: 'fees-expenses',
                modelData: parsedBreakDownData,
                fields: fieldDefinitions.breakdownFields.fields,
                fieldDefinitions: fieldDefinitions,
            })">
                View Details
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-row>
    </div>
</template>

<script>
import ComponentMixin from '@/components/component-helper-mixin';
import { get } from 'lodash';

export default {
    mixins: [ComponentMixin],
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: [Array, Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Define the table columns  */
        fieldDefinitions: {
            type: Object,
            default: () => ({}),
        },
        /** Toggles security breakdown button. */
        showBreakdown: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        isDataAvailable() {
            const feesExpensesData = this.modelData?.feesExpensesData;
            if (feesExpensesData) {
                return Array.isArray(feesExpensesData)
                    ? feesExpensesData.length : Object.keys(feesExpensesData).length;
            }
            return false;
        },
        setRowHeader() {
            if (!this.fieldDefinitions.row) return false;

            return Object.keys(this.fieldDefinitions?.row).length > 0;
        },
        parsedModelData() {
            const feesExpensesData = this.modelData?.feesExpensesData;
            const feesData = Array.isArray(feesExpensesData)
                ? feesExpensesData[0] : feesExpensesData;
            const isNotMifid = Boolean(feesData?.fees);
            let result = [];
            if (this.fieldDefinitions.type === 'us' || isNotMifid) { // Either used for Xray API Global OR US data
                const feesExpensesFields = this.fieldDefinitions.fields;
                result = feesExpensesFields.map((field) => {
                    let expensesValue = '';
                    if (Object.keys(feesData).length > 0) {
                        expensesValue = feesData[field.value]
                            ? feesData[field.value].toFixed(2)
                            : feesData.fees[field.value].value.toFixed(2);
                    }
                    return {
                        feesExpensesKey: field.key,
                        expenses: expensesValue || '-',
                    };
                });
            } else {
                result = this.getMifidData(feesData);
            }
            return result;
        },
        parsedBreakDownData() {
            const {
                securityBreakdownData,
                portfolioAnalyzedPercent,
            } = this.modelData.breakdownData;
            const securityBreakdown = [];
            const portfolioAnalyzed = [];

            if (securityBreakdownData) {
                securityBreakdownData.forEach((security) => {
                    const securityName = security?.Name;
                    const analyzedPercent = security.Analyzed;
                    const notAnalyzedPercent = security.NotAnalyzed;
                    const weight = security?.Weight;
                    securityBreakdown.push({
                        securityName,
                        ...this.getFormattedBreakdown(security),
                        weight,
                    });
                    portfolioAnalyzed.push({
                        securityName,
                        analyzedPercent,
                        notAnalyzedPercent,
                        weight,
                    });
                });
            }

            return {
                ...this.modelData,
                securityBreakdown,
                portfolioAnalyzed,
                portfolioAnalyzedPercent,
            };
        },
    },
    methods: {
        getFormattedBreakdown(data) {
            return {
                averageGrossExpenseRatio: data.FundStatisticsItem.AverageGrossExpenseRatio,
                averageNetExpenseRatio: data.FundStatisticsItem.AverageNetExpenseRatio,
                potentialCapGainsExposure: data.FundStatisticsItem.PotentialCapGainsExposure,
            };
        },
        getMifidData(model) {
            const summary = get(model, 'summary', {});
            const totalCosts = get(model, 'totalCosts', {});
            const initialCosts = get(model, 'initialCosts', {});
            const feesExpensesFields = this.fieldDefinitions.fields;

            return feesExpensesFields.map((field) => ({
                feesExpensesKey: field.key,
                expenses: (summary[field.value]
                    || totalCosts[field.value]
                    || initialCosts[field.value]
                    || null),
                type: field.format,
            }));
        },
    },
};
</script>
<style lang="scss" scoped>
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
@include mixin.wal-table;
</style>

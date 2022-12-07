<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Risk Measures {{ asOfDate ? `as of ${asOfDate}` : '' }}</h2>
            </v-col>
        </v-row>
        <v-data-table
            :headers="periods"
            :items="parsedModelData"
            :items-per-page="-1"
            :disable-sort="true"
            hide-default-footer
        >
        </v-data-table>
    </div>
</template>

<script>
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    props: {
        /** Define the table rows */
        fieldDefinitions: {
            type: Array,
            default: () => [
                {
                    text: 'Alpha',
                    value: 'Alphas',
                },
                {
                    text: 'Beta',
                    value: 'Betas',
                },
                {
                    text: 'Information Ratio',
                    value: 'InformationRatios',
                },
                {
                    text: 'R-Squared (%)',
                    value: 'RSquareds',
                },
                {
                    text: 'Sharpe Ratio',
                    value: 'SharpeRatios',
                },
                {
                    text: 'Standard Deviation (%)',
                    value: 'StandardDeviations',
                },
                {
                    text: 'Tracking Error (%)',
                    value: 'TrackingErrors',
                },
            ],
        },
        /** Accepts the "RiskStatistics" property of the response object
        * returned from API Data Access Library. */
        modelData: Array,
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            // Table columns/headers
            periods: [
                {
                    text: '',
                    value: 'dataPoint',
                },
                {
                    text: '1 Year',
                    value: 'M12',
                },
                {
                    text: '3 Years',
                    value: 'M36',
                },
                {
                    text: '5 Years',
                    value: 'M60',
                },
            ],
        };
    },
    computed: {
        riskStatistics() {
            const riskStatisticsData = this.modelData || [];
            return riskStatisticsData.find(
                (data) => data.Type === 'MonthEnd' && data.CurrencyOption === 'DISPLAYCURRENCY',
            ) || {};
        },
        asOfDate() {
            let formattedDate = '';
            if (this.riskStatistics.Date) {
                formattedDate = new Date(this.riskStatistics.Date).toLocaleDateString();
            }
            return formattedDate;
        },
        parsedModelData() {
            const tableData = [];
            const frequency = 'M';
            this.fieldDefinitions.forEach((fieldDef) => {
                const rowData = { dataPoint: fieldDef.text };
                this.periods.slice(1).forEach((timePeriod) => {
                    const fieldData = this.riskStatistics[fieldDef.value] || [];
                    const filteredObject = fieldData.find(
                        (dataItem) => dataItem.Frequency === frequency
                            && dataItem.TimePeriod === timePeriod.value,
                    ) || {};
                    rowData[timePeriod.value] = this.formatNumber(filteredObject.Value, 2) || '–';
                });
                tableData.push(rowData);
            });
            return tableData;
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
</style>

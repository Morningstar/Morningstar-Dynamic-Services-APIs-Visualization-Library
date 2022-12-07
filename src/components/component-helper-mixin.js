import { isNaN } from 'lodash';

export default {
    name: 'component-helper-mixin',
    methods: {
        toLocalISOString(utcDate) {
            return utcDate.toISOString().replace('Z', '');
        },
        convertToUTC(date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        },
        toUTCLocalISOString(date) {
            return this.toLocalISOString(this.convertToUTC(date));
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
        },
        formatNumber(number, maxDec = 2) {
            if (!number) {
                return '-';
            }
            return !isNaN(parseFloat(number))
                ? parseFloat(number).toFixed(maxDec)
                : '-';
        },
        formatPercent(number, maxDec = 2) {
            return number ? `${this.formatNumber(number, maxDec)} %`
                : null;
        },
        formatCurrency(number, currency, maxDec = 2) {
            return number
                ? new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(this.formatNumber(number, maxDec))
                : null;
        },
        formattedValue(value, format) {
            let parsedValue;
            switch (format) {
            case 'currency':
                parsedValue = this.formatCurrency(value, 'GBP');
                break;
            case 'percent':
                parsedValue = this.formatPercent(value);
                break;
            case 'number':
                parsedValue = this.formatNumber(value);
                break;
            default:
                parsedValue = value;
                break;
            }
            return parsedValue;
        },
    },
};

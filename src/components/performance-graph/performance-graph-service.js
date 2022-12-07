import {
    each, merge, head, isNil, last, times, minBy,
} from 'lodash';

function getMonthEndDate(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, number) {
    const lastDay = getMonthEndDate(date).getDate();
    if (lastDay === date.getDate()) {
        date.setDate(1);
        date.setMonth(date.getMonth() + number);
        date.setDate(getMonthEndDate(date).getDate());
    } else {
        date.setMonth(date.getMonth() + number);
    }

    return date;
}

function monthDiff(date1, date2) {
    return (date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth();
}

function convertToUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function convertToStandard(date) {
    const currentDate = convertToUTC(date);
    if (currentDate.getTimezoneOffset() > 0) {
        currentDate.setUTCMinutes(currentDate.getTimezoneOffset() * 2);
    }
    return currentDate;
}

function toLocalISOString(utcDate) {
    return utcDate.toISOString().replace('Z', '');
}

function toUTCLocalISOString(date) {
    return toLocalISOString(convertToUTC(date));
}

function getYTDMonthCount(seriesData) {
    const lastDate = convertToStandard(new Date(last(seriesData[0].data).endDate));
    return lastDate.getMonth() + 1;
}

function getSeriesDataEndDate(data) {
    const length = data && data.length;
    return length ? data[length - 1].endDate : null;
}

function rebaseDataBasedOnEndDate(seriesData) {
    let maxDate = null;
    let needRebase = false;
    each(seriesData, (item) => {
        const endDateValue = getSeriesDataEndDate(item.data);
        if (!endDateValue) {
            return;
        }
        const date = new Date(endDateValue);
        if (!maxDate) {
            maxDate = date;
        } else if (!needRebase && maxDate.getTime() !== date.getTime()) {
            needRebase = true;
        }
        if (maxDate < date) {
            maxDate = date;
        }
    });
    if (!maxDate || !needRebase) {
        return;
    }
    each(seriesData, (item) => {
        const dataItem = item.data;
        const endDateValue = getSeriesDataEndDate(dataItem);
        if (!endDateValue) {
            return;
        }
        const diffMonths = Math.abs(monthDiff(new Date(endDateValue), maxDate));
        times(diffMonths, () => {
            dataItem.push({
                endDate: null,
                value: null,
            });
        });
    });
}

function getEarliestCommonSeriesData(seriesData) {
    if (seriesData.length === 0) {
        return seriesData;
    }
    const earliestCommonSeriesData = [];
    const count = minBy(seriesData, (item) => item.data.length).data.length;
    rebaseDataBasedOnEndDate(seriesData);
    each(seriesData, (item) => {
        const newEarliestCommonSeriesData = {
            name: item.name,
            data: item.data.slice(item.data.length - count),
        };
        const { useLabel } = item;

        if (!isNil(useLabel)) {
            newEarliestCommonSeriesData.useLabel = useLabel;
        }

        earliestCommonSeriesData.push(newEarliestCommonSeriesData);
    });
    return earliestCommonSeriesData;
}

function translateDateToUTCLocalISOString(date) {
    let newDate = convertToStandard(new Date(date));
    newDate = addMonths(newDate, -1);
    return toUTCLocalISOString(newDate);
}
// internal function
function addGraphBaseValueAsFirstDataToSeriesData(graphBaseValue, date, seriesData) {
    const firstData = {};
    firstData.endDate = translateDateToUTCLocalISOString(date);
    firstData.value = graphBaseValue;

    seriesData.unshift(firstData);

    return seriesData;
}

function spliceSeriesData(graphBaseValue, seriesData, monthCount) {
    let newSeriesData = [];

    if (seriesData && seriesData.length > 0) {
        newSeriesData = merge([], seriesData);
        const spliceIndex = newSeriesData.length - monthCount - 1;
        if (spliceIndex < 0) {
            newSeriesData = addGraphBaseValueAsFirstDataToSeriesData(
                graphBaseValue,
                head(newSeriesData).endDate,
                newSeriesData,
            );
        } else {
            newSeriesData = newSeriesData.splice(spliceIndex);
        }
    }

    return newSeriesData;
}

function rebaseSeriesData(graphBaseValue, seriesData, timeSeriesData) {
    let currentValue = null;
    let needsDifferentialRebasing = false;
    let previousValue = null;
    const rebaseData = [];

    each(seriesData, (data, index) => {
        const newData = {};
        if (index === 0) {
            newData.close = graphBaseValue;
            currentValue = graphBaseValue;
            needsDifferentialRebasing = currentValue !== data.value;
        } else {
            if (!timeSeriesData) {
                currentValue *= (1 + (data.value / 100.0));
            } else if (needsDifferentialRebasing) {
                currentValue *= (1 + ((data.value - previousValue) / previousValue));
            } else {
                currentValue = data.value;
            }
            newData.close = currentValue;
        }
        newData.date = data.endDate;
        if (!isNil(data.value)) {
            rebaseData.push(newData);
        }
        previousValue = data.value;
    });

    return rebaseData;
}

function getFrequencySeriesData(graphBaseValue, seriesData, monthCount, timeSeriesData) {
    const earliestCommonSeriesData = getEarliestCommonSeriesData(seriesData);
    const frequencyData = [];
    const handleSeriesData = function handleSeriesData(item) {
        const data = spliceSeriesData(graphBaseValue, item.data, monthCount);
        const newFrequencyData = {
            name: item.name,
            data: rebaseSeriesData(graphBaseValue, data, timeSeriesData),
        };
        const { useLabel } = item;

        if (!isNil(useLabel)) {
            newFrequencyData.useLabel = useLabel;
        }

        frequencyData.push(newFrequencyData);
    };

    each(earliestCommonSeriesData, handleSeriesData);

    return frequencyData;
}

function sliceSeriesData(graphBaseValue, seriesData, startDate, endDate) {
    let newSeriesData = [];

    if (seriesData && seriesData.length > 0) {
        newSeriesData = merge([], seriesData);
        const lastDate = convertToStandard(new Date(last(newSeriesData).endDate));

        let monthCount = 0;
        if (endDate < lastDate) {
            newSeriesData = newSeriesData.slice(
                0,
                newSeriesData.length - monthDiff(endDate, lastDate),
            );
        }
        monthCount = monthDiff(startDate, endDate);
        newSeriesData = spliceSeriesData(graphBaseValue, newSeriesData, monthCount);
    }

    return newSeriesData;
}

function getDateRangeSeriesData(graphBaseValue, seriesData, startDate, endDate) {
    const earliestCommonSeriesData = getEarliestCommonSeriesData(seriesData);

    const dateRangeData = [];

    const handleSeriesData = function handleSeriesData(item) {
        const data = sliceSeriesData(graphBaseValue, item.data, startDate, endDate);
        const newDateRangeData = {
            name: item.name,
            data: rebaseSeriesData(graphBaseValue, data),
        };
        const { useLabel } = item;

        if (!isNil(useLabel)) {
            newDateRangeData.useLabel = useLabel;
        }

        dateRangeData.push(newDateRangeData);
    };

    each(earliestCommonSeriesData, handleSeriesData);

    return dateRangeData;
}

function getLineChartData(seriesData) {
    const lineChartData = [];

    each(seriesData, (item) => {
        const obj = [];
        const { name } = item;
        each(item.data, (data) => {
            obj.push({
                name,
                value: data.close.toFixed(2),
                formattedDate: new Date(data.date).toLocaleString('en-gb', { month: 'short', year: 'numeric' }),
                date: data.date,
            });
        });
        lineChartData.push(obj);
    });
    return lineChartData;
}

export default {
    getFrequencySeriesData,
    getDateRangeSeriesData,
    getLineChartData,
    getYTDMonthCount,
};

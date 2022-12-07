import PerformanceGraph from '@/components/performance-graph/PerformanceGraph.vue';
import sampleTimeSeriesData from '@/components/performance-graph/config/sampleTimeSeriesData.json';
import docPage from '@/components/performance-graph/docs/doc-time-series.mdx';
import { action } from '@storybook/addon-actions';
import { get } from 'lodash';
import helper from './stories-helper';

export default {
    title: 'Components/Performance Graph Time Series',
    component: PerformanceGraph,
    argTypes: {
        modelData: Object,
        showHeader: Boolean,
        portfolio: Object,
        showTimeSeriesData: Boolean,
    },
    parameters: {
        docs: {
            page: docPage,
        },
    },
};

const Template = (args, { argTypes, loaded }) => {
    let response = {};
    if (loaded && Object.keys(loaded).length) {
        response = loaded;
        action('Component loaded')('API Data');
    } else {
        response.modelData = args.modelData;
        action('Component loaded')('Static Data');
    }
    return {
        props: Object.keys(argTypes),
        components: { PerformanceGraph },
        template: `<performance-graph :model-data='${JSON.stringify(response.modelData)}'
                        :showHeader='showHeader'
                        :showTimeSeriesData='showTimeSeriesData'
                        :portfolio='${JSON.stringify(loaded.portfolio)}'/>`,
    };
};

export const StoryDetails = Template.bind({});
StoryDetails.storyName = 'Performance Graph Time Series';
StoryDetails.loaders = [
    async () => ({
        modelData: await Promise.allSettled([
            window.mstarApisSdk.timeSeries
                .getIntlTimeseriesData('F0GBR052QA', {
                    startDate: '2011-01-31',
                }),
            window.mstarApisSdk.timeSeries
                .getIntlTimeseriesData('EUCA000555'),
        ]).then((apiData) => {
            const parseHistoricalDetailsData = (reference, data = []) => {
                const timeSeriesData = get(data, reference, []);
                const timeSeriesDetails = [];

                const details = timeSeriesData.map((item) => [item.EndDate, item.Value]);
                timeSeriesDetails.push(...details);

                return timeSeriesDetails;
            };
            return {
                portfolio: parseHistoricalDetailsData('TimeSeries.Security[0].GrowthSeries[0].HistoryDetail', apiData[0].value),
                benchmark: parseHistoricalDetailsData('TimeSeries.Security[0].GrowthSeries[0].HistoryDetail', apiData[1].value),
            };
        }),
        portfolio: helper.samplePortfolio,
        showTimeSeriesData: true,
    }),
];
StoryDetails.args = {
    modelData: sampleTimeSeriesData,
    showHeader: true,
    portfolio: helper.samplePortfolio,
    showTimeSeriesData: true,
};

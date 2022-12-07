export default {
    RiskStatistics: [
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year1',
            DataFrequency: 'Monthly',
            Portfolio: {
                Mean: -13.44,
                SharpeRatio: -0.98,
                StandardDeviation: 13.26,
                InformationRatio: 0.04,
                TrackingError: 8.75,
                SortinoRatio: -1.04,
                ExcessReturn: -0.06,
            },
            Benchmark: {
                Mean: -13.81,
                SharpeRatio: -0.73,
                StandardDeviation: 17.68,
                SortinoRatio: -0.83,
            },
            Security: [
                {
                    SecurityId: 'FOUSA06OEZ',
                    Weight: 30,
                    RiskStatisticsItem: {
                        Mean: -15.58837,
                        SharpeRatio: -1.039,
                        StandardDeviation: 15.427,
                    },
                },
                {
                    SecurityId: 'FOUSA06IVV',
                    Weight: 50,
                    RiskStatisticsItem: {
                        Mean: -13.3399,
                        SharpeRatio: -0.824,
                        StandardDeviation: 16.176,
                    },
                },
                {
                    SecurityId: 'F00000T770',
                    Weight: 20,
                    RiskStatisticsItem: {
                        Mean: -11.77827,
                        SharpeRatio: -1.741,
                        StandardDeviation: 7.135,
                    },
                },
            ],
        },
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year3',
            DataFrequency: 'Monthly',
            Portfolio: {
                Mean: 3.53,
                SharpeRatio: 0.26,
                StandardDeviation: 16.73,
                InformationRatio: -0.8,
                TrackingError: 7.76,
                SortinoRatio: 0.36,
                ExcessReturn: -1.81,
            },
            Benchmark: {
                Mean: 9.74,
                SharpeRatio: 0.57,
                StandardDeviation: 19.3,
                SortinoRatio: 0.85,
            },
            Security: [
                {
                    SecurityId: 'FOUSA06OEZ',
                    Weight: 30,
                    RiskStatisticsItem: {
                        Mean: 6.31214,
                        SharpeRatio: 0.397,
                        StandardDeviation: 17.98,
                    },
                },
                {
                    SecurityId: 'FOUSA06IVV',
                    Weight: 50,
                    RiskStatisticsItem: {
                        Mean: 2.60328,
                        SharpeRatio: 0.198,
                        StandardDeviation: 21.131,
                    },
                },
                {
                    SecurityId: 'F00000T770',
                    Weight: 20,
                    RiskStatisticsItem: {
                        Mean: 0.06332,
                        SharpeRatio: -0.017,
                        StandardDeviation: 8.508,
                    },
                },
            ],
        },
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year5',
            DataFrequency: 'Monthly',
            Portfolio: {
                Mean: 3.85,
                SharpeRatio: 0.26,
                StandardDeviation: 14.7,
                InformationRatio: -0.94,
                TrackingError: 7.27,
                SortinoRatio: 0.36,
                ExcessReturn: -1.97,
            },
            Benchmark: {
                Mean: 10.67,
                SharpeRatio: 0.64,
                StandardDeviation: 17.46,
                SortinoRatio: 0.93,
            },
            Security: [
                {
                    SecurityId: 'FOUSA06OEZ',
                    Weight: 30,
                    RiskStatisticsItem: {
                        Mean: 7.18507,
                        SharpeRatio: 0.441,
                        StandardDeviation: 16.179,
                    },
                },
                {
                    SecurityId: 'FOUSA06IVV',
                    Weight: 50,
                    RiskStatisticsItem: {
                        Mean: 2.44289,
                        SharpeRatio: 0.162,
                        StandardDeviation: 18.3,
                    },
                },
                {
                    SecurityId: 'F00000T770',
                    Weight: 20,
                    RiskStatisticsItem: {
                        Mean: 1.63293,
                        SharpeRatio: 0.109,
                        StandardDeviation: 7.049,
                    },
                },
            ],
        },
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year10',
            DataFrequency: 'Monthly',
            Portfolio: {},
            Benchmark: {},
            Security: [
                {
                    SecurityId: 'FOUSA06OEZ',
                    Weight: 30,
                    RiskStatisticsItem: {
                        Mean: 8.94733,
                        SharpeRatio: 0.66,
                        StandardDeviation: 13.379,
                    },
                },
                {
                    SecurityId: 'FOUSA06IVV',
                    Weight: 50,
                    RiskStatisticsItem: {
                        Mean: 5.58171,
                        SharpeRatio: 0.384,
                        StandardDeviation: 15.671,
                    },
                },
                {
                    SecurityId: 'F00000T770',
                    Weight: 20,
                    RiskStatisticsItem: {},
                },
            ],
        },
    ],
    MPTStatistics: [
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year1',
            DataFrequency: 'Monthly',
            Portfolio: {
                Alpha: -4.86,
                Beta: 0.66,
                RSquared: 77.37,
            },
        },
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year3',
            DataFrequency: 'Monthly',
            Portfolio: {
                Alpha: -4.17,
                Beta: 0.8,
                RSquared: 85.1,
            },
        },
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year5',
            DataFrequency: 'Monthly',
            Portfolio: {
                Alpha: -4.44,
                Beta: 0.78,
                RSquared: 84.66,
            },
        },
        {
            AsOfDate: '2022-06-30T00:00:00',
            TrailingTimePeriod: 'Year10',
            DataFrequency: 'Monthly',
            Portfolio: {},
        },
    ],
    Drawdown: {
        AsOfDate: '2022-06-30T00:00:00',
        Portfolio: {
            PortfolioDrawdownItem: {
                MaxDrawdown: -22.4446,
                NoOfPeriods: 91,
                PeakDate: '2020-02-01T00:00:00',
                ValleyDate: '2020-04-30T00:00:00',
                UpPercent: 0.593,
                DownPercent: 0.407,
            },
            TimePeriods: [
                {
                    id: 'Month3',
                    DrawdownItem: {
                        MaxDrawdown: -6.0706,
                        NoOfPeriods: 3,
                        PeakDate: '2022-05-01T00:00:00',
                        ValleyDate: '2022-05-31T00:00:00',
                        UpPercent: 0.333,
                        DownPercent: 0.667,
                    },
                },
                {
                    id: 'Month6',
                    DrawdownItem: {
                        MaxDrawdown: -9.2328,
                        NoOfPeriods: 6,
                        PeakDate: '2022-02-01T00:00:00',
                        ValleyDate: '2022-05-31T00:00:00',
                        UpPercent: 0.333,
                        DownPercent: 0.667,
                    },
                },
                {
                    id: 'Year1',
                    DrawdownItem: {
                        MaxDrawdown: -9.2328,
                        NoOfPeriods: 12,
                        PeakDate: '2022-02-01T00:00:00',
                        ValleyDate: '2022-05-31T00:00:00',
                        UpPercent: 0.417,
                        DownPercent: 0.583,
                    },
                },
                {
                    id: 'Year2',
                    DrawdownItem: {
                        MaxDrawdown: -9.2328,
                        NoOfPeriods: 24,
                        PeakDate: '2022-02-01T00:00:00',
                        ValleyDate: '2022-05-31T00:00:00',
                        UpPercent: 0.583,
                        DownPercent: 0.417,
                    },
                },
                {
                    id: 'Year3',
                    DrawdownItem: {
                        MaxDrawdown: -22.4446,
                        NoOfPeriods: 36,
                        PeakDate: '2020-02-01T00:00:00',
                        ValleyDate: '2020-04-30T00:00:00',
                        UpPercent: 0.583,
                        DownPercent: 0.417,
                    },
                },
                {
                    id: 'Year5',
                    DrawdownItem: {
                        MaxDrawdown: -22.4446,
                        NoOfPeriods: 60,
                        PeakDate: '2020-02-01T00:00:00',
                        ValleyDate: '2020-04-30T00:00:00',
                        UpPercent: 0.617,
                        DownPercent: 0.383,
                    },
                },
                {
                    id: 'Year10',
                },
            ],
            CalendarYear: [
                {
                    id: '2015',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -12.3054,
                        NoOfPeriods: 12,
                        PeakDate: '2015-06-01T00:00:00',
                        ValleyDate: '2015-10-31T00:00:00',
                        UpPercent: 0.333,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2016',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -6.6747,
                        NoOfPeriods: 12,
                        PeakDate: '2016-02-01T00:00:00',
                        ValleyDate: '2016-03-31T00:00:00',
                        UpPercent: 0.583,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2017',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: 0.0874,
                        NoOfPeriods: 12,
                        PeakDate: '2017-09-01T00:00:00',
                        ValleyDate: '2017-09-30T00:00:00',
                        UpPercent: 1,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2018',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -10.0299,
                        NoOfPeriods: 12,
                        PeakDate: '2018-03-01T00:00:00',
                        ValleyDate: '2018-11-30T00:00:00',
                        UpPercent: 0.417,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2019',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -5.3389,
                        NoOfPeriods: 12,
                        PeakDate: '2019-06-01T00:00:00',
                        ValleyDate: '2019-06-30T00:00:00',
                        UpPercent: 0.75,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2020',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -22.4446,
                        NoOfPeriods: 12,
                        PeakDate: '2020-02-01T00:00:00',
                        ValleyDate: '2020-04-30T00:00:00',
                        UpPercent: 0.583,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2021',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -3.6251,
                        NoOfPeriods: 12,
                        PeakDate: '2021-12-01T00:00:00',
                        ValleyDate: '2021-12-31T00:00:00',
                        UpPercent: 0.667,
                        DownPercent: 0.407,
                    },
                },
                {
                    id: '2022',
                    CalenderYearDrawdownItem: {
                        MaxDrawdown: -9.2328,
                        NoOfPeriods: 6,
                        PeakDate: '2022-02-01T00:00:00',
                        ValleyDate: '2022-05-31T00:00:00',
                        UpPercent: 0.333,
                        DownPercent: 0.407,
                    },
                },
            ],
        },
    },
    CaptureRatio: {
        AsOfDate: '2022-06-30T00:00:00',
        Portfolio: {
            Downside: {
                TimePeriod: [
                    {
                        Id: 'Year1',
                        Value: 71.6,
                    },
                    {
                        Id: 'Year3',
                        Value: 83.32,
                    },
                    {
                        Id: 'Year5',
                        Value: 81.35,
                    },
                ],
            },
            Upside: {
                TimePeriod: [
                    {
                        Id: 'Year1',
                        Value: 49.62,
                    },
                    {
                        Id: 'Year3',
                        Value: 68.83,
                    },
                    {
                        Id: 'Year5',
                        Value: 65.33,
                    },
                ],
            },
        },
    },
};

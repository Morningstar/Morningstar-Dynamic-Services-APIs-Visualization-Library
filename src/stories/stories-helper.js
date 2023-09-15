const samplePortfolio = {
    type: 3,
    benchmark: {
        type: 'Standard',
        holdings: [
            {
                identifier: 'EUCA000555',
                identifierType: 'MSID',
                weight: 100,
            },
        ],
    },
    holdings: [
        {
            identifier: 'F0GBR052QA',
            identifierType: 'MSID',
            amount: 5000,
        },
        {
            identifier: 'F000000EY1',
            identifierType: 'MSID',
            amount: 2000,
        },
        {
            identifier: 'F00000OXG7',
            identifierType: 'MSID',
            amount: 2000,
        },
        {
            identifier: 'F00000TWNO',
            identifierType: 'MSID',
            amount: 1000,
        },
    ],
    name: 'UK demo portfolio',
};

const investorPreferencesPortfolio = {
    type: 3,
    benchmark: {
        type: 'Standard',
        holdings: [
            {
                identifier: 'EUCA000555',
                identifierType: 'MSID',
                weight: 100,
            },
        ],
    },
    holdings: [
        {
            identifier: 'F000015BVI',
            identifierType: 'MSID',
            amount: 5000,
        },
        {
            identifier: 'F000013M7Y',
            identifierType: 'MSID',
            amount: 2000,
        },
        {
            identifier: 'F00000OXG7',
            identifierType: 'MSID',
            amount: 2000,
        },
        {
            identifier: 'F00000TWNO',
            identifierType: 'MSID',
            amount: 1000,
        },
    ],
    name: 'UK demo portfolio',
};

const sampleUsPortfolio = [
    {
        name: 'US demo portfolio - weight',
        totalValue: 10000,
        currency: 'USD',
        holdings: [
            {
                securityId: 'FOUSA06OEZ',
                weight: 30,
            },
            {
                securityId: 'FOUSA06IVV',
                weight: 50,
            },
            {
                securityId: 'F00000T770',
                weight: 20,
            },
        ],
        benchmark: {
            type: 'Standard',
            holdings: [
                {
                    securityId: 'XIUSA0010V',
                    weight: 100,
                },
            ],
        },
    },
];

const sampleEsgPortfolio = [
    {
        Name: 'Test Portfolio1',
        TotalValue: 10000,
        Holdings: [
            {
                SecurityId: 'F0GBR052QA',
                Weight: 50,
            },
            {
                SecurityId: 'F000000EY1',
                Weight: 20,
            },
            {
                SecurityId: 'F00000OXG7',
                Weight: 20,
            },
            {
                SecurityId: 'F00000TWNO',
                Weight: 10,
            },
        ],
        Benchmark: {
            Type: 'Standard',
            Holdings: [
                {
                    SecurityId: 'XIUSA0010V',
                    Type: 'XI',
                    Weight: 100,
                },
            ],
        },
    },
];

const sampleLargePortfolio = [
    {
        Name: 'Test Portfolio1',
        TotalValue: 10000,
        Holdings: [
            {
                SecurityId: 'F00000VPDY',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000VPDZ',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000VPE0',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK3S',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK3Q',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK3R',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T76W',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T76Y',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T76Z',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T76X',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T770',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T772',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T773',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T771',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000VPDQ',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000VPDR',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000VPDS',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK3Z',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK42',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK47',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK4B',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK4F',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK4J',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK4N',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK4R',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WK3V',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T777',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T775',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T776',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T774',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F000011DGV',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F000011DGU',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000H35Y',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000H35X',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000H35W',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000J8SX',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000PQ2U',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA007RP',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA00ABD',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA05GYK',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA00DEK',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA08N2L',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA00KJW',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA00COA',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA00CTW',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA05HX7',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WRW6',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WRW5',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WRW7',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000UEIB',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000UEIA',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000UEIC',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000QSIZ',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000QSIX',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000N79H',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000N75J',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000UDFO',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000N1IS',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000XKG7',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000XKG8',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000OEUB',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000OEUC',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000OEUA',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000ZKDA',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000ZKD9',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000ZKKG',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T6OZ',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T6P0',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000T6P1',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000PEIU',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000PEIV',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000PEIW',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000ZF1O',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F000010IS3',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'FOUSA05KKV',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000YSY7',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000YSY8',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000WQUJ',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F000010GIB',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F000010GIA',
                Type: 'FO',
                Value: 100,
            },
            {
                SecurityId: 'F00000U3B0',
                Type: 'FO',
                Value: 100,
            },
        ],
        Benchmark: {
            Type: 'Standard',
            Holdings: [
                {
                    SecurityId: 'XIUSA0010V',
                    Type: 'XI',
                    Weight: 100,
                },
            ],
        },
    },
];

const sampleCostCalculationPortfolio = [
    {
        id: 'default',
        amount: 10000,
        holdings: [
            {
                identifier: 'F0GBR052QA',
                identifierType: 'MSID',
                weight: 25.64102564102564,
                initial: {},
                ongoing: [
                    {
                        name: 'Ongoing',
                    },
                    {
                        name: 'Transaction',
                    },
                    {
                        name: 'Performance',
                    },
                ],
            },
            {
                identifier: 'F000000EY1',
                identifierType: 'MSID',
                weight: 12.82051282051282,
                initial: {},
                ongoing: [
                    {
                        name: 'Ongoing',
                    },
                    {
                        name: 'Transaction',
                    },
                    {
                        name: 'Performance',
                    },
                ],
            },
            {
                identifier: 'F00000OXG7',
                identifierType: 'MSID',
                weight: 10.256410256410255,
                initial: {},
                ongoing: [
                    {
                        name: 'Ongoing',
                    },
                    {
                        name: 'Transaction',
                    },
                    {
                        name: 'Performance',
                    },
                ],
            },
            {
                identifier: 'F00000TWNO',
                identifierType: 'MSID',
                weight: 51.28205128205128,
                initial: {},
                ongoing: [
                    {
                        name: 'Ongoing',
                    },
                    {
                        name: 'Transaction',
                    },
                    {
                        name: 'Performance',
                    },
                ],
            },
        ],
    },
];

const parseModelData = (modelData) => JSON.stringify(modelData)?.replaceAll("'", '&#39;');

export default {
    samplePortfolio,
    sampleUsPortfolio,
    sampleCostCalculationPortfolio,
    sampleEsgPortfolio,
    sampleLargePortfolio,
    investorPreferencesPortfolio,
    parseModelData,
};

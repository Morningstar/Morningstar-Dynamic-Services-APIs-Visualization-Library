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
    parseModelData,
};

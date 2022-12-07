<template>
    <v-app>
        <v-main>
            <AssetAllocation :modelData="data" :colors="colorData"/>
        </v-main>
    </v-app>
</template>

<script>
import AssetAllocation from '@/components/asset-allocation/AssetAllocation.vue';

export default {
    name: 'App',

    components: {
        AssetAllocation,
    },

    data: () => ({
        data: {
            benchmark: [
                {
                    breakdowns: {
                        assetAllocation: [
                            {
                                salePosition: 'N',
                                type: 'MorningstarEUR3',
                                values: {
                                    4: 100,
                                },
                            },
                            {
                                salePosition: 'L',
                                type: 'MorningstarEUR3',
                                values: {
                                    4: 100,
                                },
                            },
                        ],
                    },
                },
            ],
            breakdowns: {
                assetAllocation: [
                    {
                        salePosition: 'N',
                        type: 'MorningstarEUR3',
                        values: {
                            1: 20.0005,
                            2: 56.79631,
                            3: 4.07219,
                            4: 14.63254,
                            99: 0.00004,
                        },
                    },
                    {
                        salePosition: 'L',
                        type: 'MorningstarEUR3',
                        values: {
                            1: 44.49892,
                            2: 36.79631,
                            3: 4.59144,
                            4: 14.63254,
                            99: 0,
                        },
                    },
                    {
                        salePosition: 'S',
                        type: 'MorningstarEUR3',
                        values: {
                            1: 0,
                            2: 0,
                            3: 0.51925,
                            4: 0,
                            99: 0,
                        },
                    },
                ],
            },
        },
        colorData: [
            '#4daf4a',
            '#377eb8',
            '#ff7f00',
            '#984ea3',
            '#e41a1c',
            '#a41b1c',
        ],
    }),
};
</script>

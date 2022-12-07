<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="portfolio">
        <div v-if="!showBreakdown">
            <div class="ma-3 pb-6 portfolio__container"
                v-for="(option, index) in componentsOptions.sections" :key="index">
                <v-row v-if="componentsOptions.showSectionHeader">
                    <v-col class="pb-1 group-title">
                        <h2 :class="index ? 'pt-4' : ''">{{ sectionMapping[option.section] }}</h2>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        sm="12"
                        :md="getCols(component) || option.components.length === 1 ? '12' : '6'"
                        cols="12"
                        v-for="(component, index) in option.components" :key="index">
                            <component
                                class="portfolio__component"
                                :is="componentMapping[component].type"
                                :model-data="modelData && modelData[component]"
                                :show-header="showHeader"
                                :show-breakdown="componentsOptions.showBreakdown"
                                v-bind="getProps(component)"
                                @show-security-level-breakdown="showSecurityLevelBreakdown"
                            >
                            </component>
                    </v-col>
                </v-row>
            </div>
        </div>
        <section v-else>
            <security-level-breakdown
                :type="breakdownType"
                :breakdown-props="breakdownProps"
                :invalid-securities="modelData.invalidSecurities"
                @show-xray="showBreakdown = false"
            />
        </section>
    </div>
</template>

<script>
import AssetAllocation from '@/components/asset-allocation/AssetAllocation.vue';
import PerformanceGraph from '@/components/performance-graph/PerformanceGraph.vue';
import FeesExpenses from '@/components/fees-expenses/FeesExpenses.vue';
import FixedIncomeCountry from '@/components/fixed-income-country/FixedIncomeCountry.vue';
import FixedIncomeSectors from '@/components/fixed-income-sectors/FixedIncomeSectors.vue';
import PortfolioHoldings from '@/components/portfolio-holdings/PortfolioHoldings.vue';
import PortfolioSrri from '@/components/portfolio-srri/PortfolioSrri.vue';
import ProductInvolvement from '@/components/product-involvement/ProductInvolvement.vue';
import RiskScore from '@/components/risk-score/RiskScore.vue';
import RiskStatistics from '@/components/risk-statistics/RiskStatistics.vue';
import StockRegions from '@/components/stock-regions/StockRegions.vue';
import StockSectors from '@/components/stock-sectors/StockSectors.vue';
import StockStats from '@/components/stock-stats/StockStats.vue';
import StockType from '@/components/stock-type/StockType.vue';
import Sustainability from '@/components/sustainability/Sustainability.vue';
import TrailingReturns from '@/components/trailing-returns/TrailingReturns.vue';
import SecurityLevelBreakdown from '@/components/security-level-breakdown/SecurityLevelBreakdown.vue';
import mapping from '@/components/shared/portfolio/config/mapping.json';

export default {
    components: {
        AssetAllocation,
        FeesExpenses,
        FixedIncomeCountry,
        FixedIncomeSectors,
        PortfolioHoldings,
        PortfolioSrri,
        PerformanceGraph,
        ProductInvolvement,
        RiskScore,
        RiskStatistics,
        StockRegions,
        StockSectors,
        StockStats,
        StockType,
        Sustainability,
        TrailingReturns,
        SecurityLevelBreakdown,
    },
    props: {
        componentsOptions: {
            type: Object,
            default: () => ({
                showSectionHeader: true,
                sections: [
                    {
                        section: 'overview',
                        components: [
                            'riskScore',
                            'assetAllocation',
                            'sustainability',
                        ],
                    },
                    {
                        section: 'assetClass',
                        components: [
                            'stockRegions',
                            'stockStats',
                            'stockSectors',
                            'fixedIncomeSectors',
                            'fixedIncomeCountry',
                            'portfolioSrri',
                        ],
                    },
                    {
                        section: 'sustainability',
                        components: [
                            'productInvolvement',
                        ],
                    },
                    {
                        section: 'performance',
                        components: [
                            'performanceGraph',
                            'trailingReturns',
                            'FeesExpenses',
                        ],
                    },
                    {
                        section: 'holdings',
                        components: [
                            'portfolioHoldings',
                        ],
                    },
                ],
            }),
        },
        modelData: {
            type: [Array, Object],
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            breakdownProps: null,
            breakdownType: null,
            componentMapping: mapping.componentMapping,
            sectionMapping: mapping.sectionMapping,
            showBreakdown: false,
        };
    },
    methods: {
        getCols(component) {
            return this.componentMapping[component]?.cols === 12;
        },
        getProps(component) {
            return this.componentsOptions.props ? this.componentsOptions.props[component] : null;
        },
        showSecurityLevelBreakdown(event) {
            this.breakdownProps = event;
            this.breakdownType = event.type;
            this.showBreakdown = true;
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.portfolio {
    @include mixin.wal-group-title;
    .portfolio__container:first-of-type {
        margin-top: 0 !important;
    }
    &__component {
        @include mixin.border(mixin.$wal-color-light-grey, top, 1px);

        .title h2 {
            border-bottom: 0;
            font-size: map.get(mixin.$wal, 'font-size', m);
        }
    }
}
</style>

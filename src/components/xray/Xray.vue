<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="portfolio-xray">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Portfolio: {{ getPortfolioName }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <portfolio
                    :model-data="modelData"
                    :components-options="componentsOptions"
                    :show-header="showHeader">
                </portfolio>
            </v-col>
        </v-row>
        <floating-scroll-button></floating-scroll-button>
    </div>
</template>

<script>
import Portfolio from '@/components/shared/portfolio/Portfolio.vue';
import FloatingScrollButton from '../shared/FloatingScrollButton.vue';

export default {
    components: { Portfolio, FloatingScrollButton },
    props: {
        /** To set sections and its components for Portfolio component */
        componentsOptions: Object,
        /** Accepts the response object returned from API Data Access Library */
        modelData: {
            type: [Array, Object],
        },
        /** Portfolio passed to the component */
        portfolio: {
            type: [Array, Object],
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            portfolioData: {},
        };
    },
    computed: {
        getPortfolioName() {
            return this.modelData.portfolioName || '';
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;
.portfolio-xray {
    @include mixin.wal-component-title(true, true);
    .title h2 {
        border: none;
        font-size: map.get(mixin.$wal, 'font-size', xxl);
    }
    @include mixin.wal-table;
}
</style>

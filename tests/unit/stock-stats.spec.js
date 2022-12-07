// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import StockStats from '@/components/stock-stats/StockStats.vue';

Vue.use(Vuetify);

describe('StockStats.vue', () => {
    it('should render Stock Stats', () => {
        const wrapper = shallowMount(StockStats);
        expect(wrapper.find('.title h2').text()).toBe('Stock Stats');
    });
});

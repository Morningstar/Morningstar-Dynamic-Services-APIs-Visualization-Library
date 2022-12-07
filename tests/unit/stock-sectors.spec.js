// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import StockSectors from '@/components/stock-sectors/StockSectors.vue';

Vue.use(Vuetify);

describe('StockSectors.vue', () => {
    it('should render Stock Sectors', () => {
        const wrapper = shallowMount(StockSectors);
        expect(wrapper.find('.title h2').text()).toBe('Stock Sectors');
    });
});

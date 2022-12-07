// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import StockType from '@/components/stock-type/StockType.vue';

Vue.use(Vuetify);

describe('StockType.vue', () => {
    it('should render Stock Type', () => {
        const wrapper = shallowMount(StockType);
        expect(wrapper.find('.title h2').text()).toBe('Stock Type');
    });
});

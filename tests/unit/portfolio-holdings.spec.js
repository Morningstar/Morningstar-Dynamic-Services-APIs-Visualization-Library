// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import PortfolioHoldings from '@/components/portfolio-holdings/PortfolioHoldings.vue';

Vue.use(Vuetify);

describe('PortfolioHoldings.vue', () => {
    it('should render Portfolio Holdings', () => {
        const wrapper = shallowMount(PortfolioHoldings);
        expect(wrapper.find('.title h2').text()).toBe('Portfolio Holdings');
    });
});
